/**
 * 系统启动时 将会执行，在这里可以做系统运行前的初始化工作
 * ** */
module.exports = async (app, server) => {
    //const websockt = require("ws");
    // var mqtt = require('mqtt');
    // global.$mqtt = mqtt.connect("mqtt://127.0.0.1:11883");
    // $mqtt.on("connect",()=>{
    //     console.log("mqtt is connected..");
    // })
    /**
    * 创建websocket服务
    */
    // const wss = new websockt.Server({ server, path: '/' });
    // require("./socket")(wss);

    console.log("app start ....");
    //console.log("config is ",$config);

}