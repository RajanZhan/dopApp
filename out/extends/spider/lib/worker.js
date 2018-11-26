var cluster = null;
var process = null;
var worker = null;
const mainModel = require("../main.model")();
const proxyModel = require("../../../model/ProxyIp.model")();

function onMsg(msg) {
    if (msg && msg.type == "die") {
        console.log("worker is going to close");
        worker.disconnect();
        setTimeout(function () {
            console.log("worker is disconnect");
            process.exit(1);
        }, 4000)
    }
}


module.exports = async (cluster) => {
    process = cluster.worker.process;
    cluster = cluster;
    worker = cluster.worker;
    setInterval(() => {
        console.log("worker runing ....", worker.id);
    }, 6000)

    process.on('message', function (msg) {
        onMsg(msg);
        // console.log('[worker] ',msg);
        // process.send('[worker] worker'+cluster.worker.id+' received!');
    });
    await $common.sleep(2000); //等待程序初始化完成 
    while (true) {
        //console.log("子进程读取ip库");
        await proxyModel.loadSpiderProxyIp($config.spider.getProxyUrl);
        await $common.sleep(3000);

    }
}