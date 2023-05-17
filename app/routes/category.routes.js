const router = require("express").Router();

const { authJwt } = require("../middlewares");
const controller = require("../controllers/category.controller");


router.get(
  "/",
  controller.findAll
);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
// router.post("/deleteAll", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);
router.delete("/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);


module.exports = router;