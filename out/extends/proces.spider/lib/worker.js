var cluster = null;
var process = null;
var worker = null;


// 子进程自杀
function die() {
    console.log("worker is going to close");
    worker.disconnect();
    setTimeout(function () {
        console.log("worker is disconnect");
        process.exit(1);
    }, 4000)
}

// 向主进程报告 异常
function sendError(callId, err) {
    process.send({
        callId: callId,
        type: "toMaster.callModelCb",
        data: {
            err: err
        },
    });
}


// 子进程调用model
async function callModel(callId, data, async1) {
    try {
        //console.log("子进程工作：",worker.id,callId);
        if (!data || !data.action) {
            return sendError(callId, "action is empty");
        }
        let arr = data.action.split("@");
        var model = null;
        let modelName = `${arr[0]}.model`;
        if($models)
        {
            model =  $models.get(modelName);
            if(model){
                console.log("model 从cache读取ok");
            }
        }

        if(!model)
        {
            model = require(`../model/${modelName}`)();
        }
        
        let res = null;
        if (async1 == 1) {
            res = await model[arr[1]]();
        } else {
            res = model[arr[1]]();
        }
        //console.log("model", res);
        process.send({
            callId: callId,
            type: "toMaster.callModelCb",
            data: {
                result: res
            },
        });
    } catch (err) {
        console.log("worker.js callModel error",err)
        sendError(callId, JSON.stringify(err));
    }
    //console.log("worker callModel");

    // setTimeout(function () {
    //     process.send({
    //         callId:callId,
    //         type: "toMaster.callModelCb",
    //         data: {err:"hahah"},
    //     });
    // }, 5000)
}

function onMsg(msg) {
    if (msg) {
        switch (msg.type) {
            case "toWorker.die":
                die();
                break;
            case "toWorker.callModel":
                callModel(msg.callId, msg.data, msg.async1);
                break;
        }
    }
}

const modelCahe = require("../script/model.cache");
const dbinit = require("../script/db.init");
module.exports = async (cluster) => {
   
    await dbinit();
    modelCahe();
    process = cluster.worker.process;
    cluster = cluster;
    worker = cluster.worker;


    // setInterval(() => {
    //     console.log("worker runing ....", worker.id);
    //     process.send({
    //         type: "toMaster.heart",
    //         data: {}
    //     });
    // }, 6000)

    process.on('message', function (msg) {
        //console.log("worker get msg",msg);
        onMsg(msg);
        // console.log('[worker] ',msg);
        // process.send('[worker] worker'+cluster.worker.id+' received!');
    });

    // 初始化完成
    process.send({
        type:"toMaster.workerInitFinished"
    })

}