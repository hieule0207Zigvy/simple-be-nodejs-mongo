const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    products: [
        {
            type: Object,
        }
    ]
});

const Cart = mongoose.model("carts", schema);

module.exports = Cart;