var express = require("express");
var router = express.Router();
var { Joi, validate } = require("express-validation");
var User = require("../models/user");
var Chat = require("../models/chat");

const perPage = 10000;

/**
 * @route /chat
 * @method POST
 * @param walletAddress
 * @param chatText
 * @return DB_ERROR
 * @return SUCCESS
 **/
router.post("/", validate({
    body: Joi.object({
        walletAddress: Joi.string().min(42).max(43).required(),
      chatText: Joi.string().required()
    })
}), async function(req, res, next) {
    var { walletAddress, chatText } = req.body;
    try{
        const user = await User.findOne({walletAddress: walletAddress});
        if(!user){
            return res.send({status: false, message: 'wallet_error'})
        }
        const chat = new Chat({
            text: chatText,
            owner: user
        });
        await chat.save();

        res.json(chat);


    }catch(e){
        next();
    }
});

/**
 * @router /chat
 * @method GET
 * @return DB_ERROR
 * @return json(Chats)
 **/
router.get("/", async function(req, res, next) {
    try{
        const chats = await Chat.find({}, null, { skip: 0, limit: perPage }).exec();
        return res.json(chats);
    }catch(e){
        next()
    }
});

/**
 * @router /chat/:pageIndex
 * @method GET
 * @return DB_ERROR
 * @return json(Chats)
 **/
router.get("/:pageIndex", async function(req, res, next) {
    try{
        var pageIndex = req.query.pageIndex;
        pageIndex = isNaN(parseInt(pageIndex)) ? 0 : parseInt(pageIndex);
        console.log(pageIndex)
        const chats = await Chat.find({}, null, { skip: pageIndex * perPage, limit: perPage }).populate('owner').exec();
        return res.json(chats);
    }catch(e){
        next()
    }
});

module.exports = router;