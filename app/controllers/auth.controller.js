const db = require("../models");
const User = db.users;
const Role = db.roles;
const RefreshToken = db.refreshTokens;
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


createToken = async (user) => {
  const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION;
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + jwtRefreshExpiration
  );

  let _token = uuidv4();

  let refreshTokenObject = new RefreshToken({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log('refreshTokenObject', refreshTokenObject);

  let refreshToken = await refreshTokenObject.save();

  return refreshToken.token;
};

verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  if (req.body.roles) {
    const roleData = await Role.find().where('name').in(req.body.roles).exec();
    user.roles = roleData.map(role => role._id);
  } else {
    const userRole = await Role.findOne({ name: "user" });
    user.roles = [userRole.id]
  }
  user.save(err => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = async (req, res) => {
  const secretKey = process.env.SECRET_KEY

  const user = await User.findOne({
    username: req.body.username
  })
  console.log('🚀 ~ file: auth.controller.js:72 ~ exports.signin= ~ user:', user)
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }
  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!"
    });
  }
  const { roles = [] } = user;
  let authorities = [];
  const roleData = await Role.find({ _id: { $in: roles } })
  authorities = roleData.map(item => item.name)
  const token = jwt.sign({ id: user.id, email: user.email, username: user.username, roles: authorities }, secretKey, {
    expiresIn: process.env.JWT_EXPIRATION
  });

  let refreshToken = await createToken(user);

  return res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
    refreshToken: refreshToken,
  });
};

exports.refreshToken = async (req, res) => {
  const jwtExpiration = process.env.JWT_EXPIRATION;
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    console.log('🚀 ~ file: auth.controller.js:111 ~ exports.refreshToken= ~ refreshToken:', refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.SECRET_KEY, {
      expiresIn: jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log('🚀 ~ file: auth.controller.js:136 ~ exports.refreshToken= ~ err:', err)
    return res.status(500).send({ message: err });
  }
};