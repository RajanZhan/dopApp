//const dbinit = require("./script/db.init");
//const modelinit = require("./script/model.cache");
module.exports = async () => {
    try {
        console.log("子进程调用开始");
        //const request = require("superagent");
        //let res = await $utils.callToWorker("test.test", "test", 1);
       // await $utils.callToWorker("mdcSpider@zonghe", "", 1);
        await $utils.callToWorker("mdcSpider@muyingSpider", "", 1);
        console.log("子进程调用的结果是", );

        //$utils.killAllWorkers();
    } catch (err) {
        console.log("main.js 进程调用异常",err);
        throw err
    }
}