const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    name: String,
    walletAddress: {
        type: String,
        uppercase: true
    },
    avatarImg: String,
    email: String,
    phoneNumber: String
}, {
    timestamps: ['createdAt', 'updatedAt'],
});

const User = model("User", UserSchema);

module.exports = User;