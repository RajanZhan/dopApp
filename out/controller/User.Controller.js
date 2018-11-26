//svg-captcha
var express = require('express'),
    router = express.Router();
const tokenModel = require("../model/Token.model")();
// 微信小程序解密专用接口
const WXBizDataCrypt = require('../lib/WXBizDataCrypt')
const tokenAuthMiddle = require("../middleware/tokenAuth.middle");
const planModel = require("../model/Plan.model")()
const userModel = require("../model/User.model")();

function middle(req, res, next) {
    //console.log("home 拦截1111");
    //tokenAuthMiddle(req, res, next);
    next();
}

// 读取 用户信息
router.get("/getUserInfoByUserId", async (req, res) => {
    try {

        await $validate([{
            data: "userId",
            require: true,
            handler: "User@checkUserId",
            msg: "用户id不能为空"
        }, ])(req.query)

        let result = await userModel.getUserInfoById(req.query.userId);
        res.success(result);
    } catch (err) {
        console.log(" getTodayPlan error", err);
        res.error("getTodayPlan 服务器错误 " + err, err);
    }
});




/**
 *  登录
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postLoign", async (req, res) => {
    try {

        let data = req.body;
        await $validate([{
                data: "openid",
                require: true,
                msg: "openid"
            },
            {
                data: "nickname",
                require: true,
                msg: "昵称不能为空"
            },
            {
                data: "headimgurl",
                require: true,
                msg: "用户头像不能为空"
            },
        ])(data);
        var result = null;
        if (data.wuid) {
            result = await userModel.setUser(data);
        } else {
            result = await userModel.addUser(data);
        }
        res.success(result);
    } catch (err) {
        console.error("postLoign", err);
        res.error("服务器错误");
    }
})

// 解密小程序的用户信息字符串
router.get("/getDecodeMpUserInfo", async (req, res) => {

    try {

        let appid = 'wx8cd40d95616d4688';
        let apps = '5aa95ad0c8a1f5a5fe1f6458935f4e49';
        let code = req.query.code;
        let encryptedData = req.query.encryptedData;
        let iv = req.query.iv;
        if ((!code) || (!encryptedData) || (!iv)) {
            return res.stop("数据不完整");
        }

        // 读取session key
        let data = request({
                url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${apps}&js_code=${code}&grant_type=authorization_code`,
            },
            function (error, response, body) {
                if (error) {
                    return console.log("send msg  to wechat error", error);
                }
                //console.log("haha");
                if (!error && response.statusCode == 200) {
                    //console.log('bd',typeof(body)) // 请求成功的处理逻辑
                    //console.log("get s key",body) // 请求成功的处理逻辑
                    let data = JSON.parse(body);
                    if (data.unionid) {
                        return res.success({
                            unionid: data.unionid,
                            detail: data
                        })
                    } else {
                        var pc = new WXBizDataCrypt(appid, data.session_key);
                        var enRes = pc.decryptData(encryptedData, iv);
                        //console.log("decode ",(enRes));
                        return res.success({
                            unionid: enRes.unionId,
                            detail: enRes
                        })
                    }
                }
            }
        )
    } catch (err) {
        console.log(" getUserInfo error" + err);
        res.error("getUserInfo 服务器错误 " + err, err);
    }
});




module.exports = {
    router,
    middle
};