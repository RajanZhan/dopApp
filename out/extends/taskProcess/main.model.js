const baseModel = require("../../lib/baseModel");
const dialogModel = require("../../model/Dialog.model")();
const messageModel = require("../../model/Message.model")();
const request = require("request");
class c  {
    constructor(opt) {
        //super();
        this.option = opt
        
    }

    // 会话过期检测
    async dialogTimeoutCheck() {
        try {

            let dialogs = await dialogModel.getNoFinishedDialog();
            if(!dialogs){
                return;
            }

            for (let d of dialogs) {
                let dialogActiveKey = `dialog-active-key-${d.id}`;
                let dialogActiveFlag = await $cache.get(dialogActiveKey);
                if (!dialogActiveFlag) {
                    console.log("dialog " + d.id + " 还没聊个");
                    continue;
                }
                let left = (new Date().getTime() - Number(dialogActiveFlag)) / 1000;

                console.log(`left ${left}`);
                var noticeTime = 60 * 2;
                var finishedTime = 60 * 3;

                if ((left > noticeTime) && (left < finishedTime)) // 小于一分钟
                {
                    console.log(`dialog ${d.id} 即将过期哦 ${left}`);

                    let noticeKey = `notice-key-${d.id}`;// 检测是否已经 
                    let isNotice = await $cache.get(noticeKey);
                    if (isNotice) {
                        continue;
                    }
                    // 广播即将过期的消息到小程序以及公众号
                    messageModel.sendMsgToDialog({
                        userId: d.fromUser,
                        message: {
                            MsgType: 'text',
                            Content: `[系统提示]：您的咨询即将过期`,
                            MediaId: 0,
                        }
                    });
                    $cache.set(noticeKey, "1", 30 * 60);
                }

                if (left >= finishedTime) {
                    console.log(`dialog ${d.id} 已经过期 ${left}`);
                    // 广播即将过期的消息到小程序以及公众号
                    await messageModel.sendMsgToDialog({
                        userId: d.fromUser,
                        message: {
                            MsgType: 'text',
                            Content: `[系统提示]：您的咨询已经过期`,
                            MediaId: 0,
                        }
                    });
                    console.log("before setDialogFinished");
                    await dialogModel.setDialogFinished(d.id);
                }
                //console.log(dialogActiveFlag);
            }
            console.log("过期会话检测");
        }
        catch (err) {
            throw err;
        }
    }

    // 简道云 任务提醒
    async jdnTask() {
        let key = `jdy-task-time`;
        let last = await $cache.get(key);
        let taskTime = 60;
        var taskurl = "http://www.kmctbio.com/wechat/jiandaoyun/crontab";
        if(!last)
        {
            request({
                url: taskurl,
                method: "get"
            })
            $cache.set(key,new Date().getTime())
            console.log("简道云任务");
        }
        else
        {
            let left = (new Date().getTime() - Number(last)) / 1000;
            if(left > taskTime)
            {
                request({
                    url: taskurl,
                    method: "get"
                })
                $cache.set(key,new Date().getTime())
                console.log("简道云任务");
            }
        }
        
        
    }


}
module.exports = (opt) => {
    return new c(opt);
}