const cluster = require("cluster");
const fs = require("fs");
const os = require("os");
const jsonmini = require("jsonminify");
global.$config = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
if (cluster.isMaster) {
    var core = 1;
    if ($config.debug == 1) {
         core = 1;
    } else {
         core = os.cpus().length;
    }
    //var clusters = [];
    var create = () => {
        var worker = cluster.fork();
        worker.send({
            code: "init",
            type: "down",
            data: {}
        })
        worker.on('exit', (cid) => {
            console.log("子进程挂了", cid);
            create();
            // 检查 workersInfoMap 中该摄像机是否继续推流，如果继续 则需要重新启动
        });
    }

    for (let i = 0; i < core; i++) {
        create();
    }
    // 启动文件自动同步进程，用于开发环境
    if($config.debug == 1)
    {
        const  { autoCopyFile } = require("./dev");
        autoCopyFile();
    }

} else {
    var app = require("./app");
    let {server} = app();
    console.log(`Worker ${process.pid} started`);
}