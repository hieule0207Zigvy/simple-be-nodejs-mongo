const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
    },
});

const Image = mongoose.model("images", schema);

module.exports = Image;