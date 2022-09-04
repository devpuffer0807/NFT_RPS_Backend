const { model, Schema } = require("mongoose");

const ChatSchema = new Schema({
    text: String,
    owner: { 
        type: Schema.Types.ObjectId,
        ref: "User"
     }
}, {
    timestamps: ["createdAt", "updatedAt"]
});

const Chat = model("Chat", ChatSchema);

module.exports = Chat;