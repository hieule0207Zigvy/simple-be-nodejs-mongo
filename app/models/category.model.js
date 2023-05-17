const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: { type: String, unique: true },
});

const Category = mongoose.model("categories", schema);

module.exports = Category;