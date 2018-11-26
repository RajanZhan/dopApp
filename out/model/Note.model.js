const baseModel = require("../lib/baseModel");

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     *  读取笔记详情
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getNoteDetail(nid) {

        try {
            if (!nid) {
                throw new Error("note id is empty in Note.model.getNoteDetail");
            }
            
            return await this.dataModels.note.findOne({
                where:{
                    id:nid
                }
            })
        } catch (err) {
            throw err;
        }
    }



    /**
     *  添加随笔
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async addNote(data) {
        try {
            data.status = 1;
            data.createTime = new Date();
            
            return await this.dataModels.note.create(data)

        } catch (err) {
            throw err;
        }
    }

    /**
     *  编辑随笔
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async setNote(data) {
        try {           
            return await this.dataModels.note.update(data,{
                where:{
                    id:data.id
                }
            })

        } catch (err) {
            throw err;
        }
    }

    /**
     *  删除随笔
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async delNote(id) {
        try {           
            return await this.dataModels.note.update({
                status:-1
            },{
                where:{
                    id:id
                }
            })

        } catch (err) {
            throw err;
        }
    }

    /**
     *  检索随笔
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getNoteByKeyWords(userId,key) {
        try {
            key = key?key:""
            return await this.dataModels.note.findAll({
                where: {
                    userId: userId,
                    status:{
                        $ne:-1
                    },
                    $or:{
                        tags:{
                            $like:"%"+key+"%"
                        },
                         content:{
                            $like:"%"+key+"%"
                         }
                    }
                },
                //order:[["status","desc"],["id","desc"]]
            })

        } catch (err) {
            throw err;
        }
    }

   
}
module.exports = (option) => {
    return new c(option)
};