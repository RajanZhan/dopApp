

module.exports = async () => {
    console.log("子进程调用开始");

    //let res = await $utils.callToWorker("test.test", "test", 1);
    let res1 = await $utils.callToWorker("test.wxUpload", "",1);
    console.log("子进程调用的结果是", res1);

    $utils.killAllWorkers();
}