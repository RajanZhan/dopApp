const baseModel = require("../lib/baseModel");
const db = require("../common/db")();
// 专栏的model
class c extends baseModel{

    constructor(){
        super();
    }

    /**
     * 获取专栏的列表.
     * @param {number} page - 页数.
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getColumns(page,psize){
        try{
            page = page?page:$config.pagination.page;
            psize = psize?psize:$config.pagination.psize;
            var pagination = $common.getPageForSql(page,psize);
            return await this.dataModels.column.findAndCountAll({
                limit:pagination.limit,
                offset:pagination.offset
            });
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 添加专栏.
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async setColumn(data){
        try{
            return await this.dataModels.column.upsert(data);
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据专栏名字 获取专栏详细信息.
     * @param {string} name - 专栏名.
     * @returns {object}. 专栏详情
     */
    async getColumnByName(name){
        try{
            return await this.dataModels.column.findOne({
                where:{
                    name:name
                }
            });
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据专栏id 获取专栏详细信息.
     * @param {number} id - 专栏id.
     * @returns {object}. 专栏详情
     */
    async getColumnById(id){
        try{
            return await this.dataModels.column.findOne({
                where:{
                    id:id
                }
            });
        }
        catch(err){
            throw err;
        }  
    }


}
module.exports = c;