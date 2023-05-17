const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: { type: String, unique: true },
});

const Role = mongoose.model("roles", schema);

module.exports = Role;