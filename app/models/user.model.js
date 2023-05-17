const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roles"
        }
    ]
});
schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
const User = mongoose.model("users", schema);

module.exports = User;