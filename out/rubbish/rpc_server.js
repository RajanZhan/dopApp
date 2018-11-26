// 'use strict';
var app = require("./app");
app();
const fastJson = require('fast-json-stringify')
console.log(`RPC进程启动...`);
setTimeout(() => {
    const {
        Test
    } = require("./model/Test.Model");
    const test = new Test({})
    const {
        RpcServer
    } = require('sofa-rpc-node').server;

    const {
        ZookeeperRegistry
    } = require('sofa-rpc-node').registry;
    const logger = console;
    const host = "192.168.0.101"
    // 1. 创建 zk 注册中心客户端
    const registry = new ZookeeperRegistry({
        logger,
        address: host + ':2181', // 需要本地启动一个 zkServer
    });

    // 2. 创建 RPC Server 实例
    const rpc_server = new RpcServer({
        logger,
        registry, // 传入注册中心客户端
        port: 12200,
    });

    // 3. 添加服务
    rpc_server.addService({
        interfaceName: 'com.nodejs.test.TestService',
    }, {
        async plus(a, b) {
            //return a + b;
            let data =  await test.test({});
            //console.log("rpc server data",data);
            return data;
        },
    });

    // 4. 启动 Server 并发布服务t
    rpc_server.start()
        .then(() => {
            rpc_server.publish();
        });
}, 3000)