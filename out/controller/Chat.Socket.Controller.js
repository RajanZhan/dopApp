
const tokenModel = require("../model/Token.model")();
const userModel = require("../model/User.model")();
const dialogModel = require("../model/Dialog.model")();
const messageModel = require("../model/Message.model")();
const request = require("request");
var socket = null;
var event = new Map();
async function middle(req, res, next) {
    //tokenAuth(req,res,next);
    console.log(req.realIp, 'realIp');

    next();
}
const router = (path, func) => {
    event.set(path, func);
};

router("/getToken", (data) => {
    // console.log("socket ",socket);
    socket.send(JSON.stringify({ type: "token" }));
})

router("/init", (data) => {
    console.log("init ", data);

    // 订阅相关的消息
    if (data || data.userId) {
        socket.mqttClient.subscribe("client/" + data.userId);
    }
    socket.mqttClient.subscribe("client/sys");
    socket.send(JSON.stringify({ type: "init" }));
})


// 发布消息给指定的客户端
router("/officer/sendToOfficer", (data) => {

    let toUser = data.toUser;
    let methods = data.methods;
    if ((!toUser) || (!methods)) {
        return console.log("/officer/sendToOfficer", '数据不完整', data);
    }
    let da = data.data ? data.data : {};
    socket.mqttClient.publish("client/" + toUser, JSON.stringify({ methods: methods, data: da }));
    console.log("/officer/sendToAllOfficer", data);
})





// 接收工作人员端消息
router("/officer/chatMsg", async (data) => {

    try {
        //console.log("officer chat ", data);

        if ((!data.dialogId)) {
            console.log("dialogId  is empty");
            return;
        }

        let dialogId = data.dialogId;
        //let fromUserId = data.fromUserId;
        let dialogInfo = await dialogModel.getDialogInfo(dialogId);
        if (!dialogInfo) {
            console.log("dialogInfo is empty");
            return;
        }
        let toUser = dialogInfo.fromUser;
        if (!toUser) {
            console.log("toUser is empty");
            return;
        }
        let toUserInfo = await userModel.getUserInfo(toUser);
        if (!toUserInfo && !toUserInfo.openid) {
            console.log("toUserInfo is empty");
            return;
        }

        messageModel.sendMsgToWx({

            message: {
                FromUserName: toUserInfo.openid,
                MsgType: data.message.MsgType,
                Content: data.message.Content,
                RContent: data.message.RContent,
                MsgId: data.message.MsgId,
            }
        });
        dialogModel.activeDialog(dialogId);
    }
    catch (err) {
        $error({err:err},"Chat.Socket.Controller ./officer/chatMsg")
    }
})


module.exports = (sck) => {
    socket = sck;
    return event;
}