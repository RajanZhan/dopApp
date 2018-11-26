const baseModel = require("../lib/baseModel");
const dialogModel = require("./Dialog.model")();
const userModel = require("./User.model")();
const formModel = require("./Form.model")();
const request = require("request");

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


     /**
    * 聊天信息入库
    * @param {object} data {dialogId,fromUser,toUser,msgType,content,mediaId}
    * @returns {unknown}. 返回添加的结果 
    */
    async saveChatHis(data){
        try{
            if(!data || !data.dialogId || !data.fromUser || !data.toUser || !data.msgType || !data.content)
            {
                console.log(data);
                throw new Error("数据不完整 In message.mdel.saveChatHis");
            }
            if(data.rcontent)
            {
                data.content =data.rcontent; // 设置显示的内容
            }
            //data.msgId = data.MsgId;
            console.log("聊天数据存储",data);
            data.time = new Date();
            return await this.dataModels.chathis.create(data);
        }
        catch(err)
        {
            throw new Error(err);
        }
    }



    /**
    * 发送消息到小程序端
    * @param {object} msg {} - 
    * @returns {unknown}. 返回添加的结果 
    */
    async sendMsgToMp(data) {
        try {
            if ((!data) || (!data.message) || (!data.message.MsgType) || (!data.message.Content)) {
                throw new Error("无法发送信息，数据不完整");
            }
            if((typeof(data.message.MsgId) == 'undefined') )
            {
                throw new Error("MediaId  is empty");
            }
            var userId = null;
            var saveMsg = {
                content:data.message.Content,
                msgType:data.message.MsgType,
                msgId:data.message.MediaId,
            }
            if (!data.message.FromUserName) {
                if (!data.userId) {
                    throw new Error("message.FromUserName 以及 userId 不能同时为空");
                }

                let userinfo = await userModel.getUserInfo(data.userId);
                if (!userinfo.openid) {
                    throw new Error("openid 读取失败");
                }
                data.message.FromUserName = userinfo.openid;
                userId = data.userId;
            }
            else {
                let userinfo = await userModel.getUserInfoByOpenid(data.message.FromUserName);
                userId = userinfo.wuid;
            }

            let dialog = await dialogModel.getNoFinishedDialog(userId);
            if (!dialog) {
                throw new Error("sendMsgToMp dialog is empty");
            }

            saveMsg.toUser = dialog.toUser; 
            saveMsg.dialogId = dialog.id;
            saveMsg.fromUser = userId;
            
            this.saveChatHis(saveMsg);

            if (data.message.MsgType == "collectionfinish") {

                // 通知对应的医生有新的表单已经完成
                let cid = data.message.cid;
                if (!cid) {
                    return console.log("表单id 获取失败");
                }
                let cinfo = await formModel.getCollectionById(cid);
                if (!cinfo) {
                    return console.log("表单信息获取失败");
                }
                // 通知对应的医生
                var topic = `client/${cinfo.docId}`;
                $mqtt.publish(topic, JSON.stringify({
                    methods: "collectionfinish", data: {
                        message: data.message
                    }
                }));
                let docInfo = await userModel.getUserInfo(cinfo.docId);
                console.log("表单填写完成", data);
                this.sendWxTmpltMsg({
                    openid: docInfo.openid,
                    msg: "客户表单填写完成,请您尽快处理"
                })
                return;
            }



            var topic = `client/${dialog.toUser}`;
            console.log("haah", topic);
            //console.log("send to officer");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           .toUser;
            $mqtt.publish(topic, JSON.stringify({
                methods: "wxMsg", data: {
                    message: data.message
                }
            }));

            // 激活聊天信息
            //  let dialogActiveKey = `dialog-active-key-${dialog.id}`;
            //  $cache.set(dialogActiveKey, new Date().getTime(), 60 * 30); //每条会话如果30分钟没
        }
        catch (err) {
            throw err;
        }
    }

    /**
   * 发送消息到wechat
   * @param {object} msg {} - 
   * @returns {unknown}. 返回添加的结果 
   */
    async sendMsgToWx(data) {
        try {
            if ((!data) || (!data.message) || (!data.message.MsgType) || (!data.message.Content)) {
                throw new Error("无法发送信息，数据不完整" + JSON.stringify(data));
            }
            var _this = this;
            var openid = null;
            var userId = null;
            if (!data.message.FromUserName) {
                if (!data.userId) {
                    throw new Error("message.FromUserName 以及 userId 不能同时为空");
                }
                let userinfo = await userModel.getUserInfo(data.userId);
                if (!userinfo.openid) {
                    throw new Error("openid 读取失败");
                }
                data.message.FromUserName = userinfo.openid;
                openid = userinfo.openid;
                userId = userinfo.wuid;
            }
            else {
                let userinfo = await userModel.getUserInfoByOpenid(data.message.FromUserName);
                userId = userinfo.wuid;
                openid = data.message.FromUserName;
            }
            //console.log("发送消息到公众号");

            let sendToWxType = "text"; // 自定义类型的
            if(data.message.MsgType == "form")
            {
                sendToWxType = "text"
            }
            
            request({
                url: $config.outerApi.sendWxApi,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: {
                    ToUserOpenid: openid,
                    MsgType: sendToWxType,
                    Content: data.message.Content,
                    MsgId: data.message.MsgId,
                }
            }, async function (error, response, body) {
                console.log("发送消息到公众号 ", body)
                //const fs = require("fs");
                //fs.writeFileSync("c:/error.html",body)
                if (error) {
                    console.log("send msg  to wechat error", error);
                }
                if (!error && response.statusCode == 200) {
                     //console.log("发送消息到公众号1 ", data) // 请求成功的处理逻辑

                    // 存储消息记录
                    var saveMsg = {
                        content:data.message.Content,
                        rcontent:data.message.RContent,
                        msgType:data.message.MsgType,
                        msgId:data.message.MsgId,
                    }

                    let dialog = await dialogModel.getNoFinishedDialog(userId);
                    if (!dialog) {
                        throw new Error("sendMsgToWx dialog is empty");
                    }
                    saveMsg.toUser = userId; 
                    saveMsg.dialogId = dialog.id;
                    saveMsg.fromUser = dialog.toUser;
                    _this.saveChatHis(saveMsg);
                }
            });
            // let dialog = await dialogModel.getNoFinishedDialog(userId);
            // if (!dialog) {
            //     throw new Error("sendMsgToMp dialog is empty");
            // }

        }
        catch (err) {
            throw err;
        }
    }

    /**
   * 广播消息到会话
   * @param {object} msg {} - 
   * @returns {unknown}. 返回添加的结果 
   */
    async sendMsgToDialog(data) {
        try {
            if ((!data) || (!data.message) || (!data.message.MsgType) || (!data.message.Content)) {
                throw new Error("无法发送信息，数据不完整");
            }
            await this.sendMsgToMp(data);
            await this.sendMsgToWx(data);
        }
        catch (err) {
            throw err;
        }
    }

    // 发送小程序模板 消息  
    /**
  * 广播消息到会话
  * @param {object} msg {} - 
  * @returns {unknown}. 返回添加的结果 
  */
    async sendWxTmpltMsg(data) {
        try {

            let url = `http://wxapi.52ds.club/wechat/wechatapi/wxsendtplmsg`;
            if (!data.openid) {
                return console.log("openid is empty insendWxTmpltMsg", dta);
            }
            request({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: {
                    openid: data.openid,
                    msg: data.msg
                }
            }, function (error, response, body) {
                if (error) {
                    console.log("send msg  to wechat error", error);
                }
                if (!error && response.statusCode == 200) {
                    //console.log(body) // 请求成功的处理逻辑
                    console.log("发送模板消息", body);
                }
            });

            return

        }
        catch (err) {
            throw err;
        }
    }

}
module.exports = (option) => {
    return new c(option)
};