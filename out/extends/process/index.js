const jsonmini = require("jsonminify");
const fs = require("fs");
const cluster = require("cluster");
global.$config = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
global.$logger = require("../../lib/logger");
global.$cluster = cluster;
const utils = require("./lib/utils");
global.$utils = utils;
const mainfunc = require("./main");

if (cluster.isMaster) {
    global.$callWorderMap = new Map(); // 调用子进程的回调函数列表
    global.$callWorkerRecord = 0; // 缓存当前调用的子进程的记录，用于随机平均调用子进程
    global.$workers = [];
    // 子进程进程调用回调处理
    function callModelCb(callId, data) {

        if (!data || !callId) {
            console.log(data, callId);
            throw new Error("callModelCb error,data or data.callId is empty");
        }

        let cb = $callWorderMap.get(callId);
        if (!cb || !cb.resolve || !cb.reject) {
            console.log(cb);
            throw new Error("callModelCb error,回调数据不完整");
        }
        if (data.err) {
            cb.reject(data.err);
        } else {
            cb.resolve(data);
        }
        $callWorderMap.delete(callId)
        //console.log($callWorderMap,"event size");
    
    }
    async function main() {
        try {

            cluster.on('message', function (worker, msg, handle) {
                //console.log("子进程的消息", msg);
                if (msg) {
                    switch (msg.type) {
                        case "toMaster.callModelCb":
                            callModelCb(msg.callId, msg.data);
                            break;
                    }
                }
            });

            let i = 0;
            while (i < Number($config.workers)) {
                console.log("fork");
                $workers.push(cluster.fork());
                i ++;
            }

            await utils.sleep(100);
            await mainfunc();
            // cluster.on('exit', function (worker, code, signal) {
            //     console.log('[master] ' + 'exit worker' + worker.id + ' died');
            //     console.log("workers is ",cluster.workers);
            // });
            // //
            // cluster.on('disconnect', function (worker, code, signal) {
            //     console.log('[master] ' + 'disconnect worker' + worker.id + ' disconnect');
            // });
            // console.log("workers is ",cluster.workers);
            // mainModel.cgSpideer();
            console.log("主进程结束....");

        } catch (err) {
            console.log("程序异常", err);
            //doTask();
        }
    }
    main();
}

if (cluster.isWorker) {
    require("./lib/worker.js")(cluster, process);

}




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