const jsonmini = require("jsonminify");
const fs = require("fs");
global.$taskConfig = JSON.parse(jsonmini(fs.readFileSync("taskProcess.config.json").toString()));

if ($taskConfig.debug == 1) {
    global.$config = JSON.parse(jsonmini(fs.readFileSync("../../config.json").toString()));
} else {
    global.$config = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
}

var sleep = (time) => {
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove();
        }, time)
    })
}

global.$common = require("../../common/utils");
global.$cache = require("../../lib/cache")();
const mainModel = require("./main.model")();
global.$logger = require("../../lib/logger");

var mqtt = require('mqtt');
global.$mqtt = mqtt.connect("mqtt://127.0.0.1:11883");
$mqtt.on("connect", () => {
    console.log("mqtt is connected..");
})

async function doTask() {
    try {
        //咨询过期检测
        await mainModel.dialogTimeoutCheck();
        mainModel.jdnTask();
        await sleep(5000);
         doTask();
    }
    catch (err) {
        console.log("程序异常",err);
        //doTask();
    }


}
doTask();

// setInterval(async () => {
//     try {
//         doTask();
//     } catch (err) {
//         console.log("check order incomme error", err);
//         $logger.error({
//             path: "task Process error ",
//             err: err
//         });
//     }

// }, $taskConfig.incomeCheckTime * 1000);

