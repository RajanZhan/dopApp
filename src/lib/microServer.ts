/** 微服务注册 */

export default () => {
    const { RpcServer } = require('sofa-rpc-node').server;
    const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
    const logger = console;
    const fs = require("fs");
    const path = require("path");

    // 1. 创建 zk 注册中心客户端
    const registry = new ZookeeperRegistry({
        logger,
        address: $config.msServer.zkHost, // 需要本地启动一个 zkServer
    });
    // 2. 创建 RPC Server 实例
    const server = new RpcServer({
        logger,
        registry, // 传入注册中心客户端
        port: Number($config.msServer.msPort)+ ( Number(Math.random().toFixed(3)) * 1000) ,
    });

    let logics = fs.readdirSync("./logic");
    for (let l of logics) {
        let stat = fs.statSync("./logic/" + l);
        if (stat.isFile()) {
            let content = require("../logic/" + l);
            if (content.default) {
                server.addService({
                    interfaceName: `${path.basename(l, ".js")}`,
                }, content.default);
                console.log("注册微服务服务...", path.basename(l, ".js"));
            }
        }
    }
        server.start()
        .then(() => {
            server.publish();
        });
}