const baseModel = require("../lib/baseModel");
const db = require("../common/db")();


// 专栏的model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }

     /**
     * 点赞.
     * @param {object} data - praiseObject 点赞的信息结构.
     * @returns {object}. 点赞的结果
     */
     async setPraise(data){
        try{
           if(!data.articleId)
           {
               throw new Error("articlePraise.mode setPraise,articleId 不能为空");
           }
           //console.log(this.dataModels);
           return await this.dataModels.articlePraise.upsert(data);
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 获取专栏的列表.
     * @param {number} page - 页数.
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getArticles(page,psize){
        try{
            page = page?page:$config.pagination.page;
            psize = psize?psize:$config.pagination.psize;
            var pagination = $common.getPageForSql(page,psize);
            console.log(pagination,"pagess");
            return await this.dataModels.article.findAndCountAll({
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
    async setArticle(data){
        try{
            if(data.id)
            {
                let cacheKey = this.getArticleCacheKey(data.id);
                await $cache.delete(cacheKey);
            }
            return await this.dataModels.article.upsert(data);
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
     * 根据id 获取文章详细信息.
     * @param {number} id - 专栏id.
     * @returns {object}. 专栏详情
     */
    async getArticleById(id){
        try{
            if(!id)
            {
                return null;
            }
            var cacheKey = this.getArticleCacheKey(id);
            if($config.debug != 1)
            {
                let cache = await $cache.get(cacheKey);
                if(cache)
                {
                    return cache;
                }
            }
            let res =  await this.dataModels.article.findOne({
                where:{
                    id:id
                }
            });
            await $cache.set(cacheKey,res);
            return res;
        }
        catch(err){
            throw err;
        }  
    }


}
module.exports = (option)=>{
    return new c(option);
}