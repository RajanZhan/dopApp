//svg-captcha
var express = require('express'),
    router = express.Router();
const svgCaptcha = require('svg-captcha');
const userModel = require("../model/User.model")();
const deptModel = require("../model/Dept.model")();
const tokenModel = require("../model/Token.model")();

function middle(req, res, next) {
    //console.log("home 拦截1111");
    next();
}


router.get("/getTest", async (req, res) => {
    try {
        //console.log(req.query, "get test");

        await $validate([{
            data: "name",
            require: true,
            handler: "App@name"
        }])(req.query)

        res.success(req.query);
    } catch (err) {
        console.log(" test error" + err);
        res.error("test 服务器错误 " + err, err);
    }
});


// 创建会话的前端页面
router.get("/dialogInit", async (req, res) => {
    try {
        var userId = req.query.userId;
        var ip = req.query.ip;
        if (!userId) {
            return res.stop("userId can not empty");
        }
        let family = await userModel.getFamily(userId);
        let depList = await deptModel.getDeptList();
        let token = await tokenModel.setToken({
            ip: ip
        });

        //console.log("depList ",depList);
        //console.log("dept model ",depList);
        //console.log("family",family);

        res.display("public.dialogInit", {
            token: token,
            depList: depList,
            family: family,
            userId: userId
        });
    } catch (err) {
        console.log(" test error" + err);
        res.error("test 服务器错误 " + err, err);
    }
});


router.get("/getVcodeImg", async (req, res) => {
    try {
        console.log("getVcodeImg...");
        var captcha = svgCaptcha.create();
        //req.session.captcha = captcha.text;
        await req.session("vcode", captcha.text);

        res.type('svg');
        res.status(200).send(captcha.data);

    } catch (err) {
        console.log(" getVcodeImg error" + err);
        res.error("getVcodeImg 服务器错误 " + err, err);
    }
});
// router.get("/getVcode", async (req, res) => {
//     try {
//         //res.send(await req.session("vcode"));
//         res.send(await adminModel.getAdminInfo("admin"));
//     } catch (err) {
//         console.log(" getVcode error" + err);
//         res.error("getVcode 服务器错误 " + err, err);
//     }
// })

/**
 * 管理员后台登录. POST
 * @param {number} uname - 页数.
 * @param {number} pwd - 分页的大小.
 * @param {number} vcode - 验证码.
 * @returns {array}. 返回登录的结果 {status :}
 */
// router.post("/login", async (req, res) => {
//     try {
//         //$logger.info({err:"aaaa"});
//         var pdata = req.body;
//         //console.log("pdata",pdata);
//         let validate = await res.validate([{
//                 data: "uname",
//                 require: true
//             }, {
//                 data: "pwd",
//                 require: true
//             },
//             {
//                 data: "vcode",
//                 require: true,
//                 handler: "vcode"
//             }
//         ])(pdata);
//         if (!validate[0]) {
//             res.stop(validate[1]);
//             return;
//         }
//         // let vcode = await req.session("vcode");
//         // if(!vcode) {
//         //     res.stop("验证码已过期");
//         //     return;
//         // }
//         // if(pdata.vcode != vcode.toLowerCase())
//         // {
//         //     res.stop("验证码不正确");
//         //     return;
//         // }
//         let adminInfo = await adminModel.getAdminInfo(pdata.uname);
//         if (!adminInfo) {
//             res.stop("管理员不存在");
//             return;
//         }
//         if (adminInfo.pwd == pdata.pwd) {
//             await req.session("admin", adminInfo);
//             res.success({
//                 id: adminInfo.id,
//                 name: adminInfo.name,
//                 msg: "登录成功"
//             });
//         } else {
//             res.stop("登录失败");
//         }
//     } catch (err) {
//         console.log("登录处理发生错误", err);
//         $logger.error({
//             path: "public/login",
//             err: err
//         });
//         res.error("服务器错误");
//     }
// })


/**
 * 管理员登出后台. POST
 * @returns {array}. 返回登录的结果 {status :}
 */
// router.post("/logout", async (req, res) => {
//     try {
//         await req.csession();
//         res.success("登出成功");
//     } catch (err) {
//         console.log("登出处理发生错误", err);
//         $logger.error({
//             path: "public/logout",
//             err: err
//         });
//         res.error("服务器错误");
//     }
// })


/**
 * 二维码生成. get
 * @returns {imgages}. 返回二维码流
 */
router.get("/qr", async (req, res) => {
    try {
        let qr = require("qr-image");
        let text = req.query.text.replace("$", "#");
        //console.log(text);
        if (!text) {
            res.stop("参数不完整");
            return;
        }
        var img = qr.image(text, {
            size: 10
        });
        res.writeHead(200, {
            "Content-Type": "image/png"
        })
        img.pipe(res);
    } catch (err) {
        console.log(err);
        res.error("服务器错误");
    }
})


/**
 * 保证session生效的心跳. POST
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/heart", async (req, res) => {
    try {
        res.success("heart");
    } catch (err) {
        res.error("服务器错误");
    }
})


module.exports = {
    router,
    middle
};