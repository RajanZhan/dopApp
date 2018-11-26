const uuidv1 = require('uuid/v4');


// 异步休眠
function sleep (time){
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove();
        }, time)
    })
}


// 生成任意长度随机字符
function randomStr()
{
    let str = uuidv1();
    //console.log(str,"call randomStr");
    return str;
}

// 杀死所有子进程
function killAllWorkers()
{
   for(let w of $workers)
   {
       w.send({type:"toWorker.die"});
   }
}


// 主进程调用欧
async function callToWorker(name, params,async1) {
    try {
        if ($cluster.isWorker) {
            throw new Error("callToWorker is error ,because this process is in  worker ");
        }
        if($cluster.workers.length == 0)
        {
            throw new Error("callToWorker is error ,worker list is empty");
        }
        if($callWorkerRecord >= $workers.length)
        {
            $callWorkerRecord = 0;
        }
        var callWorker = null;

        callWorker = $workers[$callWorkerRecord]
        $callWorkerRecord ++;
        if(!callWorker)
        {
            console.log($workers,$callWorkerRecord);
            throw new Error("callToWorker is error ,callWorker is empty");
        }
        return new Promise((resolve,reject)=>{
            var callId = randomStr();
            callWorker.send({type:"toWorker.callModel",async1:async1, callId:callId,data:{action:name,params:params,}})
            $callWorderMap.set(callId,{resolve:resolve,reject:reject});
        })
    } catch (err) {
        throw err
    }

}

module.exports = {
    callToWorker,
    sleep,
    killAllWorkers,
}