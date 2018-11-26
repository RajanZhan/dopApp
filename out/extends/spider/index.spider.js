const jsonmini = require("jsonminify");
const fs = require("fs");
const cluster = require("cluster");
global.$taskConfig = JSON.parse(jsonmini(fs.readFileSync("extends.config.json").toString()));

if ($taskConfig.debug == 1) {
    global.$config = JSON.parse(jsonmini(fs.readFileSync("../../config.json").toString()));
} else {
    global.$config = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
}


global.$ua = JSON.parse(jsonmini(fs.readFileSync("./ua.json").toString()));

global.$common = require("../../common/utils");
global.$cache = require("../../lib/cache")();
const mainModel = require("./main.model")();
global.$logger = require("../../lib/logger");


const utils = require("./lib/utils");
const ipModel = require("../../model/ProxyIp.model")();;

if (cluster.isMaster) {
    async function doTask() {
        try {




            // cluster.fork().send({type:"init"});
            // cluster.fork().send({type:"init"});
            // cluster.fork().send({type:"init"});
            // cluster.fork().send({type:"init"});

            //cluster.fork().send({type:"init"});
            
            while (1) {
                
                
                let sleep = Number($config.spider.sleep);
                await mainModel.cgSpideer();
                console.log("***************蜘蛛休息中 φ(>ω<*)..... ******************");
                await $common.sleep(1000 * 60 * sleep);
            }


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

            // 检测ip的可用性
            // let ips = await ipModel.getIps();
            // if(ips)
            // {
            //     let checkIps = [];
            //     //console.log(ips);
            //     for(let ip of ips)
            //     {
            //         if(!ip){
            //             continue;
            //         }
            //         checkIps.push(`${ip.type}://${ip.ip}:${ip.port}`)
            //     }
            //     let validIps = await utils.checkValidIp(checkIps);
            //     console.log("可用ip为",utils);
            // }
            // let validat = [];
            // while (validat.length <= 100) {
            //     let ip = await mainModel.getSpiderProxy();
            //     if (ip) {
            //         // 检测ip可用
            //         let check = await utils.checkValidProxyIp(`http://${ip}`);
            //         if (check) {
            //             let arr = ip.split(":");
            //             validat.push({
            //                 type: "http",
            //                 ip: arr[0],
            //                 port: arr[1]
            //             });
            //         } else {
            //             console.log("ip 不可用", ip);
            //         }
            //     }
            // }
            //await mainModel.getSpiderProxy(); // 采集代理ip
            //console.log("完成一次ip代理采集",);

        } catch (err) {
            console.log("程序异常", err);
            //doTask();
        }
    }

    doTask();
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