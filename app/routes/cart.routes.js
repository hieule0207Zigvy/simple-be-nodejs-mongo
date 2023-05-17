const router = require("express").Router();

const { authJwt } = require("../middlewares");
const controller = require("../controllers/cart.controller");


router.get(
  "/:id",
  authJwt.verifyToken,
  controller.findByUserId
);

router.put("/:id", [authJwt.verifyToken], controller.update);



module.exports = router;