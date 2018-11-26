const mqtt = require("mqtt");
const chatController = require("../controller/Chat.Socket.Controller");
const userModel = require("../model/User.model")();
const dialogModel = require("../model/Dialog.model")();


const socketRouter = [chatController]



module.exports = (wss) => {

    // init envent list

    wss.on("connection", ws => {
        console.log("websocket a user is connected");

        var eventList = new Map();

        var mqtt = require('mqtt');
        var mqttClient = mqtt.connect("mqtt://127.0.0.1:11883");
        ws.mqttClient = mqttClient;
        //mqttClient.subscribe("wxmsg");
        for (let controller of socketRouter) {
            let elist = controller(ws);
            for (let [k, v] of elist) {
                //console.log(k,v,"socket router");
                eventList.set(k, v);
            }
        }

        function dispatch(type, data, socket) {
            let func = eventList.get(type);
            //console.log(eventList);
            if (func) {
                func(data);
            }
            else {
                socket.send(JSON.stringify({ type: "notFound", data: `${type} is not found` }));
            }
        }


        // 监听客户端发来的消息
        ws.on('message', (message) => {
            try {
                //console.log(message);
                message = JSON.parse(message);
                if (message.type) {
                    switch (message.type) {
                        case "heart":
                            ws.send(JSON.stringify({ type: "heart" }));
                            break;
                        default:
                            dispatch(message.type, message.data, ws);
                            break;
                    }
                }
                //console.log(`WebSocket received: ${message}`);
            }
            catch (err) {
                console.log("json parse message error", err);
            }

        });

        ws.mqttClient.on("message", async (topic, message) => {
            try{
                message = JSON.parse(message.toString());
                console.log("client get msg ", message);
    
                // 微信 消息
                if (message.methods == "wxMsg") {
                    //解析发送消息的用户的信息 
                    let sender = await userModel.getUserInfoByOpenid(message.data.message.FromUserName);
                    let dialog = await dialogModel.getNoFinishedDialog(sender.wuid);
                    if (!dialog) {
                        return;
                    }
                    //console.log("sender",dialog);
                    let data = {
                        dialogId: dialog.id,
                        fromUser: sender,
                        message: message.data.message,
                    }
    
                    ws.send(JSON.stringify({ type: "wxmsg", data: data }));
                }
                // 新会话创建
                else if(message.methods == "newDialog")
                {
    
                    ws.send(JSON.stringify({ type: "newDialog", data:{} }));
                }
                // 会话结束
                else if (message.methods == 'dialogFinished')
                {
                    ws.send(JSON.stringify({ type: "dialogFinished", data:message.data}));
                }
                // 会话被转接
                else if (message.methods == 'dialogTransfer')
                {
                    ws.send(JSON.stringify({ type: "dialogTransfer", data:""}));
                }
                else if (message.methods == 'collectionfinish')
                {
                    ws.send(JSON.stringify({ type: "collectionfinish", data:""}));
                }
            }
            catch(err)
            {
                console.log("socket 接到消息异常",err);
            }
           

        })

        // 监听关闭事件
        ws.on('close', (code, message) => {
            ws.mqttClient.end(null, () => {
                console.log("mqtt client is closed");
            });
            ws.terminate();
            eventList = null;
            mqttClient = null;
            ws = null;

            console.log(`WebSocket client closed (code: ${code}, message: ${message || 'none'}) and the resource is released`);
        });

        // 连接后马上发送成功响应
        //ws.send(`Server: 收到我的消息了嘛`);
    })

    /**
     * 监听websocket服务错误
     */
    wss.on('error', (err) => {
        console.log(err);
    });
}