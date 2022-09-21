/**
 * @author puffer
 * @createdAt 20/08/2022
 * @updatedAt 20/08/2022
 **/

var express = require('express');
var router = express.Router();
var fs = require("fs");
var { Joi, validate } = require('express-validation');
var User = require('../models/user');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

/**
 * @route /auth/login
 * @param walletAddress
 * @method POST
 * @error DB_ERROR
 * @return null
 * @return User
 */
router.post("/login", validate({
    body: Joi.object({
        walletAddress: Joi.string().min(42).max(43).required()
    })
}), async function (req, res, next) {
    const { walletAddress } = req.body;
    try {
        const user = await User.findOne({ walletAddress: walletAddress }).exec();
        return res.status(200).json(user)
    } catch (e) {
        next();
    }
});

/**
 * @route /auth/signup
 * @param name
 * @param avatar
 * @param walletAddress
 * 
 * @error DB_ERROR
 * @return DUPULICATE_ADDRESS_ERROR
 * @return SUCCESS
 */
router.post("/signup",
    [
        validate({
            body: Joi.object({
                name: Joi.string().required(),
                walletAddress: Joi.string().min(42).max(43).required(),
                email: Joi.string(),
                phoneNumber: Joi.string(),
            })
        }),
    ],
    async function (req, res, next) {
        const { name, walletAddress, email, phoneNumber } = req.body;
        var avatarImg = undefined;
        if(req.files?.avatarImg){
            var img = fs.readFileSync(req.files.avatarImg.path);
            avatarImg = 'data:image/jpeg;charset=utf-8;base64,' + img.toString('base64');
        }
        try {
            const _checkUser = await User.findOne({ walletAddress: walletAddress });
            if (_checkUser) {
                await _checkUser.updateOne({ name: name, avatarImg: avatarImg, email: email, phoneNumber: phoneNumber });
            } else {
                const user = new User({
                    name: name,
                    walletAddress: walletAddress,
                    avatarImg: avatarImg,
                    email: email,
                    phoneNumber: phoneNumber
                });
                await user.save();
            }
            const userInfo = await User.findOne({ walletAddress: walletAddress });
            return res.send(userInfo);

        } catch (e) {
            console.log(e)
            return res.status(500).send("DB_ERROR");
        }
    });

module.exports = router;