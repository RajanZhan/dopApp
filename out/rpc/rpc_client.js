'use strict';

const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const logger = console;
const host = "192.168.0.101"
// const registry = new ZookeeperRegistry({
//     logger,
//     address: host+':2181',
//   });

async function invoke() {
  // 不需要传入 registry 实例了
  const client = new RpcClient({
    logger,
    //registry
  });
  const consumer = client.createConsumer({
    interfaceName: 'com.nodejs.test.TestService',
    serverHost: host+':12200', // 直接指定服务地址
  });
  await consumer.ready();

  const result = await consumer.invoke('plus', [ 1, 2 ], { responseTimeout: 3000 });
  console.log('1 + 2  ', result);
}

invoke().catch(console.error);