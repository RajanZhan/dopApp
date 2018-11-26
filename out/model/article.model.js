const baseModel = require("../lib/baseModel");
const db = require("../common/db")();


// 专栏的model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }

     /**
     * 获取文章缓存key.
     * @param {number} id - 文章id.
     * @returns {string}. 返回key
     */
     getArticleCacheKey(id){
        try{
           if(!id)
           {
               throw new Error("无法获取文章缓存的key，因为文章id为空");
           }
           return `article-${id}`;
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
                offset:pagination.offset,
                order:[['sort','desc']]
            });
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 添加或者更新文章.
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async setArticle(data){
        try{
            if(data.id)
            {
                let cacheKey = this.getArticleCacheKey(data.id);
                await $cache.delete(cacheKey);
                return await this.dataModels.article.update(data,{
                    where:{
                        id:data.id
                    }
                });
            }
            let res = await this.dataModels.article.create(data);
            //console.log("create article ",res);
            return res;
        }
        catch(err){
            throw err;
        }  
    }


     /**
     * 获取最新文章,包含未发布的文章
     * @returns {object}. 返回添加的结果 
     */
    async getLastestArticle(){
        try{
            
            let res = await this.dataModels.article.findOne({
                where:{
                    status:1
                },
                order:[["sort","desc"]],
                limit:1
            });
            //console.log("create article ",res);
            return res;
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 获取最新已发布文章
     * @returns {object}. 返回添加的结果 
     */
    async getLastestPublishedArticle(){
        try{
            
            let res = await this.dataModels.article.findOne({
                order:[["sort","desc"]],
                where:{
                    status:1
                },
                limit:1
            });
            //console.log("create article ",res);
            return res;
        }
        catch(err){
            throw err;
        }  
    }
    
     /**
     * 删除文章.
     * @param {number} id - 文章id
     * @returns {unknown}. 返回添加的结果 
     */
    async delArticle(id){
        try{
            if(!id)
            {
                throw new Error("article.model delArticle,无法删除文章，因为文章id为空");
            }

            let cacheKey = this.getArticleCacheKey(id);
            await $cache.delete(cacheKey);
            return await this.dataModels.article.destroy({
                where:{
                    id:id
                }
            });
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
            await $cache.set(cacheKey,res,$config.cacheDefaultExpire);
            return res;
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据期号 获取文章详细信息.
     * @param {number} sort - 期号.
     * @returns {object}. 文章详情
     */
    async getArticleBySort(sort){
        try{
            
            let res =  await this.dataModels.article.findOne({
                where:{
                    sort:sort
                }
            });
            return res;
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据id 获取上一条 文章.
     * @param {number} id - 专栏id.
     * @returns {object}. 专栏详情
     */
    async getLast(id){
        try{
            if(!id)
            {
                return null;
            }
            let current = await this.getArticleById(id);
            
            if(!current)
            {
                return null;
            }

            let res =  await this.dataModels.article.findOne({
                where:{
                    sort:{
                        $lt:current.sort
                    },
                    status:1,
                },
                limit:1,
                order:[["sort","desc"]]
            });

            return res;
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据id 获取下一条 文章.
     * @param {number} id - 专栏id.
     * @returns {object}. 专栏详情
     */
    async getNext(id){
        try{
            if(!id)
            {
                return null;
            }
            let current = await this.getArticleById(id);
            if(!current)
            {
                return null;
            }
            let res =  await this.dataModels.article.findOne({
                where:{
                    sort:{
                        $gt:current.sort
                    },
                    status:1,
                },
                order:[["sort"]],
                limit:1,
            });

            return res;
        }
        catch(err){
            throw err;
        }  
    }
}
module.exports = (option)=>{
    return new c(option)
};