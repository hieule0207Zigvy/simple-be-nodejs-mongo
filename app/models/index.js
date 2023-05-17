const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.tutorials = require("./tutorial.model.js");
db.users = require("./user.model.js");
db.roles = require("./role.model.js");
db.refreshTokens = require("./refreshToken.model.js");
db.products = require("./product.model.js");
db.categories = require("./category.model.js");
db.carts = require("./cart.model.js");
db.images = require("./image.model.js");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
