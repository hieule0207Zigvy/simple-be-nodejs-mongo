const router = require("express").Router();

const { verifySignUp } = require("../middlewares");

const controller = require("../controllers/auth.controller");

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  controller.signup
);

router.post("/signin", controller.signin);
router.post("/refreshtoken", controller.refreshToken);

module.exports = router;