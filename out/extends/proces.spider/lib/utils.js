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

// 生成随机数字
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}


// 时间格式化  "yyyy-MM-dd hh:mm:ss" 
function dateFormate(date, fmt) {
    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    if (date) {
        return new Date(date).Format(fmt);
    }
    return new Date().Format(fmt);

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
        console.log("callToWorker 发生异常",err);
        throw err
    }

}

function md5(str) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex')
}

module.exports = {
    callToWorker,
    sleep,
    killAllWorkers,
    randomNum,
    dateFormate,
    md5,
}