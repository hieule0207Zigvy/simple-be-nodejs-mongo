const mongoose = require("mongoose");
const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});

const RefreshToken = mongoose.model("refreshtokens", RefreshTokenSchema);

module.exports = RefreshToken;