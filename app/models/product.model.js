const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: String,
    price: String,
    categories:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories"
    },
    images: Array

});

const Product = mongoose.model("products", schema);

module.exports = Product;