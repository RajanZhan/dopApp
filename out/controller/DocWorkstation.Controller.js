//svg-captcha
var express = require('express'),
    router = express.Router();
const request = require("request");


const userModel = require("../model/User.model")();
const dialogModel = require("../model/Dialog.model")();
const deptModel = require("../model/Dept.model")();
const tokenAuthMiddle = require("../middleware/tokenAuth.middle");
const formModel = require("../model/Form.model")();
const messageModel = require("../model/Message.model")();
const wordsModel = require("../model/Words.model")();

// 微信小程序解密专用接口
const WXBizDataCrypt = require('../lib/WXBizDataCrypt')


async function middle(req, res, next) {
    //console.log("req",req.body);
    tokenAuthMiddle(req, res, next);
}

router.get("/getTest", async (req, res) => {
    // let openid = req.query.openid;//o5Qb_wjO8VngOw3zgRGVM5LBuZ7M
    // messageModel.sendMpTmpltMsg({touser:openid});
    res.success(req.query);
})


// 读取家庭成员
router.get("/getFamily", async (req, res) => {

    try {
        let userId = req.query.userId;
        if (!userId) {
            throw new Error("userId is empty in getFamily methods");
        }

        let result = await userModel.getFamily(userId);
        // console.log("get familgy ",result);
        res.success(result);

    } catch (err) {
        console.log(" getFamily error" + err);
        res.error("getFamily 服务器错误 " + err, err);
    }
});


// 创建咨询会话
router.post("/postCreateDialog", async (req, res) => {

    try {
        let data = req.body;
        console.log("postCreateDialog", data);
        let validate = await res.validate([
            { data: "fromUser", require: true },
            { data: "forUser", require: true },
            //{data:"toUser",require:true},
            { data: "depId", require: true },
        ])(data);
        let operator = await userModel.getOperatorList();
        if((!operator) ||(operator.length == 0) ){
            return res.stop("读取客服失败");
        }

        data.toUser = operator[0].wuid;
        if(!data.toUser){
            return res.stop("客服id不能为空");
        }
        //console.log(data,validate);
        if (!validate[0]) {
            return res.stop(validate[1]);
        }

        let result = await dialogModel.createDialog(data);
        let toUserInfo = await userModel.getUserInfo(data.fromUser);
        toUserInfo = toUserInfo;

        request({
            url: "http://wxapi.52ds.club/wechat/wechatapi/sendchat?wechatid=1",
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                ToUserOpenid: toUserInfo.openid,
                MsgType: "text",
                Content: "咨询创建成功，现在在此咨询医生了",
                MediaId: 0,
            }
        }, function (error, response, body) {
            if (error) {
                console.log("send msg  to wechat error", error);
            }
            if (!error && response.statusCode == 200) {
                //console.log(body) // 请求成功的处理逻辑
            }
        });
        //console.log("fasong muban");
        messageModel.sendWxTmpltMsg({
            openid:operator[0].openid,
            msg:"有新的咨询，请注意查看"
        })


        $mqtt.publish("client/sys",JSON.stringify({methods:"newDialog",data:result}));
        
        res.success(result);

    } catch (err) {
        console.log(" createDialog error" + err);
        res.error("createDialog 服务器错误 " + err, err);
    }
});

// 读取未完成的会话
router.get("/getNoFinishedDialog", async (req, res) => {

    try {
        // if (!req.query.userId) {
        //     throw new Error("id can not be empty");
        // }
        //console.log(data,validate);
        let result = await dialogModel.getNoFinishedDialog(req.query.userId,req.query.operatorId);
        res.success(result);

    } catch (err) {
        console.log(" getNoFinishedDialog error" + err);
        res.error("getNoFinishedDialog 服务器错误 " + err, err);
    }
});

// 读会话详情
router.get("/getDialogInfo", async (req, res) => {

    try {

        let result = await dialogModel.getDialogInfo(req.query.id);
        res.success(result);

    } catch (err) {
        console.log(" getDialogInfo error" + err);
        res.error("getDialogInfo 服务器错误 " + err, err);
    }
});

// 读取某工作人员有关的会话  
router.get("/getFinishedDialog", async (req, res) => {

    try {

        let result = await dialogModel.getFinishedDialog(req.query.userId);
        res.success(result);

    } catch (err) {
        $error({err:err},"getFinishedDialog 服务器错误");
        res.error("getFinishedDialog 服务器错误 " + err, err);
    }
});


// 读取微信用户的信息
router.get("/getUserInfo", async (req, res) => {

    try {
        let userId = req.query.id;
        if (!userId) {
            throw new Error("userId is empty");
        }
        let result = await userModel.getUserInfo(userId);
        res.success(result);

    } catch (err) {
        console.log(" getUserInfo error" + err);
        res.error("getUserInfo 服务器错误 " + err, err);
    }
});

router.get("/getUserInfoByUnionId", async (req, res) => {

    try {
        let userId = req.query.unionid;
        if (!userId) {
            throw new Error("userId is empty");
        }
        let result = await userModel.getUserInfoByUnionId(userId);
        res.success(result);

    } catch (err) {
        console.log(" getUserInfo error" + err);
        res.error("getUserInfo 服务器错误 " + err, err);
    }
});


// 解密小程序的用户信息字符串
router.get("/getDecodeMpUserInfo", async (req, res) => {

    try {
        // let userId = req.query.unionid;
        // if(!userId)
        // {
        //     throw new Error("userId is empty");
        // }
        let appid = 'wxa0189f5bdbf6a378';
        let apps = '746fd7a2877745e2dde8caf995fb0ba1';
        let code = req.query.code;
        let encryptedData = req.query.encryptedData;
        let iv = req.query.iv;
        if((!code) || (!encryptedData) || (!iv))
        {
            return res.stop("数据不完整");
        }

        // 读取session key
        let data = request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${apps}&js_code=${code}&grant_type=authorization_code`,
        },
            function (error, response, body) {
                if (error) {
                   return  console.log("send msg  to wechat error", error);
                }
                //console.log("haha");
                if (!error && response.statusCode == 200) {
                    //console.log('bd',typeof(body)) // 请求成功的处理逻辑
                    //console.log("get s key",body) // 请求成功的处理逻辑
                    let data = JSON.parse(body);
                    if(data.unionid)
                    {
                        return res.success({ unionid: data.unionid ,detail:data})
                    }
                    else
                    {
                        var pc = new WXBizDataCrypt(appid, data.session_key);
                        var enRes = pc.decryptData(encryptedData , iv);
                        //console.log("decode ",(enRes));
                        return res.success({ unionid:enRes.unionId ,detail:enRes})
                    }
                }
            }
        )
    } catch (err) {
        console.log(" getUserInfo error" + err);
        res.error("getUserInfo 服务器错误 " + err, err);
    }
});

// 读取科室列表
router.get("/getDeptList", async (req, res) => {

    try {

        let result = await deptModel.getDeptList();

        res.success(result);

    } catch (err) {
        console.log(" getDeptInfo error" + err);
        res.error("getDeptInfo 服务器错误 " + err, err);
    }
});


// 读取科室详细信息
router.get("/getDeptInfo", async (req, res) => {

    try {
        let id = req.query.id;
        if (!id) {
            throw new Error("dept id is empty");
        }
        let result = await deptModel.getDeptInfo(id);
        res.success(result);

    } catch (err) {
        console.log(" getDeptInfo error" + err);
        res.error("getDeptInfo 服务器错误 " + err, err);
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

/*** 表单相关api begin**/

// 读取指定科室下的表单列表
router.get("/getFormListByDeptId", async (req, res) => {
    try {
        let deptId = req.query.deptId;
        if (!deptId) {
            throw new Error("deptId  is empty");
        }
        let result = await formModel.getFormListByDeptId(deptId);
        res.success(result);

    } catch (err) {
        console.log(" getVcodeImg error" + err);
        res.error("getVcodeImg 服务器错误 " + err, err);
    }
});

// 创建病人表单
router.post("/postCreateCollectionTable", async (req, res) => {

    try {
        let data = req.body;
        let validate = await res.validate([
            { data: "userId", require: true },
            { data: "tableId", require: true },
            { data: "docId", require: true },
        ])(data);
        console.log(data, "create table");
        if (!validate[0]) {
            return res.stop(validate[1]);
        }
        let result = await formModel.createCollectionTable(data);
        res.success(result);

    } catch (err) {
        console.log(" createCollectionTable error" + err);
        res.error("createCollectionTable 服务器错误 " + err, err);
    }
});

// 读取指定医生待诊断的表单 getCollectionTablesByDocId
router.get("/getNoFinishCollectionTablesByDocId", async (req, res) => {
    try {
        let docId = req.query.docId;
        if (!docId) {
            throw new Error("docId  is empty");
        }
        let result = await formModel.getNoFinishCollectionTablesByDocId(docId);
        res.success(result);

    } catch (err) {
        console.log(" getCollectionTablesByDocId error" + err);
        res.error("getCollectionTablesByDocId 服务器错误 " + err, err);
    }
});

// 读取指定医生已经完成诊断的表单  getFinishCollectionTablesByDocId
router.get("/getFinishCollectionTablesByDocId", async (req, res) => {
    try {
        let docId = req.query.docId;
        if (!docId) {
            throw new Error("docId  is empty");
        }
        let result = await formModel.getFinishCollectionTablesByDocId(docId);
        res.success(result);

    } catch (err) {
        console.log(" getCollectionTablesByDocId error" + err);
        res.error("getCollectionTablesByDocId 服务器错误 " + err, err);
    }
});

// 读取表单数据
router.get("/getFormDataByFormId", async (req, res) => {
    try {
        let formId = req.query.formId;
        if (!formId) {
            throw new Error("formId  is empty");
        }
        let result = await formModel.getFormDataByFormId(formId);
        res.success(result);

    } catch (err) {
        console.log(" getFormDataByFormId error" + err);
        res.error("getFormDataByFormId 服务器错误 " + err, err);
    }
});

// 写入诊断信息 setDiagnosis
router.post("/postSetDiagnosis", async (req, res) => {

    try {
        let data = req.body;
        let validate = await res.validate([
            { data: "formId", require: true },
            { data: "diagnosis", require: true },
        ])(data);
        if (!validate[0]) {
            return res.stop(validate[1]);
        }
        let result = await formModel.setDiagnosis(data);
        res.success(result);

    } catch (err) {
        console.log(" postSetDiagnosis error" + err);
        res.error("postSetDiagnosis 服务器错误 " + err, err);
    }
});

// 将表单转接到指定的客户
router.post("/postTransDialog", async (req, res) => {

    try {
        let data = req.body;
        let validate = await res.validate([
            { data: "dialogId", require: true },
            { data: "toUser", require: true },
        ])(data);
        // console.log(data,"create table");
        if (!validate[0]) {
            return res.stop(validate[1]);
        }

        let result = await dialogModel.postTransDialog(data);
        
        // 通知医生 

        res.success({result:result});

    } catch (err) {
        console.log(" postTransDialog error" + err);
        res.error("postTransDialog 服务器错误 " + err, err);
    }
});

/*** 表单相关api end**/



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*** 医生相关api begin**/

// 读取指定科室下的表单列表
router.get("/getDocList", async (req, res) => {
    try {

        let result = await userModel.getDocList();
        res.success(result);

    } catch (err) {
        console.log(" getDocList error" + err);
        res.error("getDocList 服务器错误 " + err, err);
    }
});


// 读取工作人员列表 
router.get("/getOfficerList", async (req, res) => {
    try {

        let result = await userModel.getOfficerList();
        res.success(result);

    } catch (err) {
        console.log(" getOfficerList error" + err);
        res.error("getOfficerList 服务器错误 " + err, err);
    }
});


/*** 医生相关api end**/


/*** 常用语相关api begin**/

router.post("/postSetWords", async (req, res) => {

    try {
        let data = req.body;
        let validate = await res.validate([
            { data: "words", require: true },
            { data: "userId", require: true },
        ])(data);
        // console.log(data,"create table");
        if (!validate[0]) {
            return res.stop(validate[1]);
        }
        let id = Number(data.id)
        if(id)
        {
            //console.log("add....",Number(data.id),data.id == null,typeof data.id,Boolean(data.id));
            var result = await wordsModel.updateWords({
                id:data.id,
                words:data.words
            });
        }
        else
        {
            var result = await wordsModel.addWords({
                words:data.words,
                userId:data.userId
            });
        }
        
        res.success({result:result});

    } catch (err) {
        console.log(" postSetWords error" + err);
        res.error("postSetWords 服务器错误 " + err, err);
    }
});

// 读取常用语列表
router.get("/getWordsByUserId", async (req, res) => {
    try {
        let result = await wordsModel.getWordsByUserId(req.query.userId);
        res.success(result);

    } catch (err) {
        console.log(" getWordsByUserId error" + err);
        res.error("getWordsByUserId 服务器错误 " + err, err);
    }
});

// 读取常用语详情
router.get("/getWord", async (req, res) => {
    try {
        let result = await wordsModel.getWord(req.query.id);
        res.success(result);

    } catch (err) {
        console.log(" getWord error" + err);
        res.error("getWord 服务器错误 " + err, err);
    }
});

// 删除常用语
router.post("/postDelWord", async (req, res) => {

    try {
        let result = await wordsModel.delWords(req.body.id);
        res.success({result:result});

    } catch (err) {
        console.log(" postDelWord error" + err);
        res.error("postDelWord 服务器错误 " + err, err);
    }
});

/*** 常用语相关api end**/


// 接收来自公众号的消息
router.post("/handleWxMsg", async (req, res) => {

    try {
        let data = req.body;
        //console.log("get wechat msg",data);

        // let userInfo = await userModel.getUserInfoByOpenid(data.message.FromUserName);
        // if (!userInfo) {
        //     throw new Error("userinfo is empty");
        // }

        console.log(data);

       await messageModel.sendMsgToMp(data);

        var userId = null;
        if (!data.message.FromUserName) {
            throw new Error("message.FromUserName 以及 userId 不能同时为空");
        }
        let userInfo = await userModel.getUserInfoByOpenid(data.message.FromUserName);
        if(!userInfo )
        {
            throw new Error("handleWxMsg userinfo get error");
        }

        let dialog = await dialogModel.getNoFinishedDialog(userInfo.wuid);

        if (!dialog) {
            throw new Error("handleWxMsg dialog is empty");
        }

        dialogModel.activeDialog(dialog.id);
       
        //console.log("publi ", topic);
        res.success("ok");

    } catch (err) {
        //console.log(" handleWxMsg error" + err);
        $error({err:err},"handleWxMsg 服务器错误 ");
        res.error("handleWxMsg 服务器错误 " + err, err);
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