//svg-captcha
var express = require('express'),
    router = express.Router();

const tokenModel = require("../model/Token.model")();

async function middle(req, res, next) {
    //tokenAuth(req,res,next);
    console.log(req.realIp,'realIp');

    next();
}

router.get("/getToken", async (req, res) => {
    try {

        let uname = req.query.uname;
        let pwd = req.query.pwd;
        let ip = req.query.ip?req.query.ip:req.realIp;
        //let ua = req.query.ua?req.query.ua:req.ua;
        if((!uname) || (!pwd))
        {
            throw new Error("数据不完整");
        }
        if((uname != "wstoken") || (pwd != "wstoken1324"))
        {
            //console.log(uname,pwd);
            throw new Error('验证失败');
        }

        let token = await tokenModel.setToken({ip:ip});
        res.success({token:token});

    } catch (err) {
        console.log(" getToken error" + err);
        res.error("getToken 服务器错误 " + err, err);
    }
    
})

/**
 * 管理员后台登录. POST
 * @param {number} uname - 页数.
 * @param {number} pwd - 分页的大小.
 * @param {number} vcode - 验证码.
 * @returns {array}. 返回登录的结果 {status :}
 */
router.get("/getFamily",async (req,res)=>{
    
    try {
        let userId = req.query.userId;
        if(!userId)
        {
            throw new Error("userId is empty in getFamily methods");
        }

        let result = await userModel.getFamily(userId);
        res.success(result);

    } catch (err) {
        console.log(" getFamily error" + err);
        res.error("getFamily 服务器错误 " + err, err);
    }
});





module.exports = {
    router,
    middle
};