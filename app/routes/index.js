const router = require("express").Router();
const cors = require("cors");
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const productRoute = require('./product.routes');
const categoryRoute = require('./category.routes');
const cartRoute = require('./cart.routes');

const corsMiddleware = cors();

router.use('/user', corsMiddleware, userRoute);
router.use('/product', corsMiddleware, productRoute);
router.use('/auth', corsMiddleware, authRoute);
router.use('/category', corsMiddleware, categoryRoute);
router.use('/cart', corsMiddleware, cartRoute);

module.exports = router;