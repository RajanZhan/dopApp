const baseModel = require("../lib/baseModel");


var getDialogCacheKey = (id) => {
    return `dialog-cache-key-${id}`;
}

var getNoFinishDialogCacheKey = () => {
    return `nofinished-dialog-list`;
}

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     * 创建会话.
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async createDialog(data) {

        try {
            let d = await this.getNoFinishedDialog(data.fromUser);
            if (d) {
                throw new Error("已经创建咨询");
            }
            let dialog = {
                fromUser: data.fromUser,
                forUser: data.forUser,
                toUser: data.toUser,
                time: new Date(),
                depId: data.depId,
                status: 0,
            }

            let res = await this.dataModels.dialog.create(dialog);
            this.activeDialog(res.id);
            // let key = getNoFinishDialogCacheKey();
            // $cache.delete(key);
             this.relateDialogToUser(res.id,data.toUser);
            return res;
        }
        catch (err) {
            throw err;
        }
    }


    /**
     * 检测会话是否过期.
     * @param {int} dialogId .
     * @returns {bool}. 
     */
    async checkDialogTimeout(dialogId) {

        try {
            if (!dialogId) {
                throw new Error("dialogId can not be empty in dialog.model.checkDialogTimeout");
            }
            
            let res = await this.dataModels.dialog.findOne({
                where:{
                    id:dialogId
                }
            });
            //console.log("timeou check",res);
            if(!res)
            {
                throw new Error("dialog info is empty in dialog.model.checkDialogTimeout");
            }
            if(res.status == 0)
            {
                return false;
            }
            else if(res.status == 1)
            {
                return true;
            }
            throw new Error("unknow dialog status  in dialog.model.checkDialogTimeout");

        }
        catch (err) {
            throw err;
        }
    }

     
    /**
      * 将对应的聊天咨询与工作人员进行绑定
      * @param {int} dialogId .
      * @param {int} userId .
      * @returns {unknown}. 返回添加的结果 
      */
     async relateDialogToUser(dialogId,userId) {
        try {

            if ((!dialogId) || (!userId) ) {
                throw new Error("Dialog.model.relateDialogToUser  userId or dialogId can not be empty ");
            }
           let res = await this.dataModels.operatorToDialog.create({
                dialogId:dialogId,
                userId:userId,
            })
            return res;
        }
        catch (err) {
            throw err;
        }
    }


    /**
      * 转接表单
      * 
      * @returns {unknown}. 返回添加的结果 
      */
    async postTransDialog(data) {
        try {

            if ((!data) || (!data.dialogId) || (!data.toUser)) {
                throw new Error("Form.postTransDialog 数据不完整 ");
            }
            
            // 检测会话是否已经过期
            let istimeout = await this.checkDialogTimeout(data.dialogId)
            if(istimeout)
            {
                console.log("会话已经过期",istimeout);
                return null;
            }

            let res = await this.dataModels.dialog.update({
                toUser: data.toUser,
            },
                {
                    where: {
                        id: data.dialogId
                    }
                }
            );
            let key = getDialogCacheKey(data.dialogId);

            $cache.delete(key);
            let dialog = await this.getDialogInfo(data.dialogId);
            const messageModel = require("./Message.model")();
            // 切换成功 ，在此通知到对应的工作人员
            messageModel.sendMsgToMp({
                userId: dialog.fromUser,
                message: {
                    MsgType: "text",
                    Content: "[系统提示] 会话接入成功"
                }
            })

            // 与
            //console.log("会话转接成功", res);

            // 转接成功，会话 - 人 绑定
            this.relateDialogToUser(data.dialogId,data.toUser);
            return true;
        }
        catch (err) {
            throw err;
        }
    }


    /**
     * 根据用户ID读取未完成的会话.
     * @param {int} 
     * @param {int}  operatorId 工作人员的id
     * @returns {object}. 会话信息
     */
    async getNoFinishedDialog(id, operatorId) {

        try {
            console.log("chathis ",this.dataModels);
            if(this.dataModels == undefined)
            {
                return null;
            }
            // 关联查询聊天记录
            var relation =[
                {
                    model:this.dataModels.chathis,
                    as:"chathis",
                    order:[['id','desc']],
                    limit:100,
                    include:[
                        {
                            model:this.dataModels.user,
                            as:"toUserInfo"
                        },
                        {
                            model:this.dataModels.user,
                            as:"fromUserInfo"
                        },
                    ]
                },
                {
                    model:this.dataModels.user,
                    as:"toUserInfo",
                }
            ]

            if (id) {
                var where = {
                    fromUser: id,
                    status: 0,
                }
                let data = await this.dataModels.dialog.findOne({
                    include:relation,
                    where: where
                })
                if (data) {
                    data.setDataValue("ftime", $common.dateFormate(data.time, "yyyy-MM-dd hh:mm"));
                }
                return data;
            }
            else {
               
                if (operatorId) {
                    var where = {
                        status: 0,
                        toUser: operatorId
                    }
                }
                else {
                    var where = {
                        status: 0,
                    }
                }

                let datas = await this.dataModels.dialog.findAll({
                    include:relation,
                    where: where
                })
                for (let i in datas) {
                    datas[i].setDataValue("ftime", $common.dateFormate(datas[i].time, "yyyy-MM-dd hh:mm"))
                }
                return datas;
            }


        }
        catch (err) {
            throw err;
        }
    }



     /**
     * 根据工作人员的ID读取完成的会话.
     * @param {int}  operatorId 工作人员的id
     * @param {int}  page 工作人员的id
     * @param {int}  psize 工作人员的id
     * @returns {array}. 会话信息
     */
    async getFinishedDialog(operatorId,page,psize) {

        try {
            var relation =[
                {
                    model:this.dataModels.chathis,
                    as:"chathis",
                    order:[['id','desc']],
                    limit:100,
                    include:[
                        {
                            model:this.dataModels.user,
                            as:"toUserInfo"
                        },
                        {
                            model:this.dataModels.user,
                            as:"fromUserInfo"
                        },
                    ]
                },
                {
                    model:this.dataModels.user,
                    as:"toUserInfo",
                },
                {
                    model:this.dataModels.user,
                    as:"fromUserInfo",
                }
            ]
            if(!operatorId)
            {
                // 读取所有的 聊天记录
                let dialogs = await this.dataModels.dialog.findAll({
                    include:relation,
                     where:{
                         status:1
                     },
                    // group:"fromUser"
                     
                 })
                 return dialogs;
                
            }
            else
            {
                // 读取指定 工作人员的相关会话
                let ids = await this.dataModels.operatorToDialog.findAll({
                    where:{
                        userId:operatorId
                    }
                })
                
                if(!ids){
                    return [];
                }
                let dids = [];
                for(let d of ids)
                {
                    dids.push(d.dialogId);
                }
                let dialogs = await this.dataModels.dialog.findAll({
                    include:relation,
                    where:{
                        id:{
                            $in:dids
                        }
                    },
                   // group:"fromUser"
                })
                //console.log("ids",ids);
                return dialogs;
            }
            console.log("getFinishedDialog ",this.dataModel);
        }
        catch(err)
        {
            throw err;
        }
    }


    /**
     * 读取会话详情
     * @param {int} id - 会话id
     * @returns {unknown}. 返回添加的结果 
     */
    async getDialogInfo(id) {
        try {

            if (!id) {
                throw new Error("getDialogInfo id is empty");
            }
            let key = getDialogCacheKey(id);
            let cache = await $cache.get(key);
            if (cache) {
                return cache;
            }
            let data = await this.dataModels.dialog.findOne({
                where: {
                    id: id
                }
            })
            $cache.set(key, data.getValues(), 60);
            return data;

        } catch (err) {
            throw err;
        }
    }



    /**
    * 设置会话为过期
    * @param {int} id - 会话id
    * @returns {unknown}. 返回添加的结果 
    */
    async setDialogFinished(id) {
        try {

            if (!id) {
                throw new Error("setDialogTimeout id is empty");
            }
            let data = await this.dataModels.dialog.update({
                status: 1
            },
                {
                    where: {
                        id: id
                    }
                }
            )
            let key = getNoFinishDialogCacheKey();
            await $cache.delete(key);
            $mqtt.publish("client/sys", JSON.stringify({ methods: "dialogFinished", data: { dialogId: id } }))
            return data;
        } catch (err) {
            throw err;
        }
    }


    /**
   * 激活聊天，防止过期
   * @param {int} id - 会话id
   * @returns {unknown}. 返回添加的结果 
   */
    async activeDialog(id) {
        try {
            if (!id) {
                throw new Error("激活会话失败");
            }
            // 激活聊天信息
            let dialogActiveKey = `dialog-active-key-${id}`;
            $cache.set(dialogActiveKey, new Date().getTime(), 60 * 60); //每条会话如果60分钟没
        } catch (err) {
            throw err;
        }
    }

    /**
    * 存储 聊天记录
    * @param { object }  -
    * @returns {unknown}. 返回添加的结果 
    */
   async saveDialogChatHistory(data) {
    try {

        if (!id) {
            throw new Error("setDialogTimeout id is empty");
        }
        let data = await this.dataModels.dialog.update({
            status: 1
        },
            {
                where: {
                    id: id
                }
            }
        )
        let key = getNoFinishDialogCacheKey();
        await $cache.delete(key);
        $mqtt.publish("client/sys",JSON.stringify({methods:"dialogFinished",data:{dialogId:id}}))
        return data;
    } catch (err) {
        throw err;
    }
}


}
module.exports = (option) => {
    return new c(option)
};