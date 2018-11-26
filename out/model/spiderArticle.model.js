const baseModel = require("../lib/baseModel");
const db = require("../common/db")();
// 专栏的model
class c extends baseModel{

    constructor(){
        super();
    }


    /**
     * 读取所有的title.
     * @param {object} {} - .
     * @returns {object}. 返回管理员数据
     */
    async getAllTitle(){
        try{
            
            // 检测文章是否存在
            return  await this.dataModels.spiderArticle.findAll({
                attr:["title"]
            })

        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 添加文章入库.
     * @param {object} {} - .
     * @returns {object}. 返回管理员数据
     */
    async setArticle(data){
        try{
            
            // 检测文章是否存在
            return  await this.dataModels.spiderArticle.create(data)

        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 添加文章入库.
     * @param {object} {} - .
     * @returns {object}. 返回管理员数据
     */
    async setArticles(data){
        try{
            
            // 检测文章是否存在
            return  await this.dataModels.spiderArticle.bulkCreate(data)

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
    async getArticleByTitle(title){
        try{
            
            return await this.dataModels.spiderArticle.findOne({
                where:{
                    title:title
                }
            });
        }
        catch(err){
            throw err;
        }  
    }

}
module.exports = (opt)=>{
    return new c(opt);
};
