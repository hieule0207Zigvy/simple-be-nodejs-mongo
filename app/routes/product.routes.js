const router = require("express").Router();

const { authJwt } = require("../middlewares");
const upload = require('multer')();
const controller = require("../controllers/product.controller");


router.get(
  "/",
  controller.findAll
);
router.get(
  "/filter",
  controller.findAllWithFilter
);
router.get(
  "/search",
  controller.searchWithFilter
);
router.get(
  "/:id",
  controller.findOne
);

router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
router.post("/deleteAll", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);
router.delete("/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);


module.exports = router;