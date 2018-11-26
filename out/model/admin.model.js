const baseModel = require("../lib/baseModel");
const db = require("../common/db")();
// 专栏的model
class c extends baseModel{

    constructor(){
        super();
    }

    /**
     * 获取专栏的列表.
     * @param {number} name - 管理员账号.
     * @returns {object}. 返回管理员数据
     */
    async getAdminInfo(name){
        try{
            // page = page?page:$config.pagination.page;
            // psize = psize?psize:$config.pagination.psize;
            // var pagination = $common.getPageForSql(page,psize);
            if(!name) 
                return  null;
            return await this.dataModels.admin.findOne({
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
     * 添加专栏.
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async addColumn(data){
        try{
            data.status  = 1;
            return await this.dataModels.column.create(data);
        }
        catch(err){
            throw err;
        }  
    }

}
module.exports = c;