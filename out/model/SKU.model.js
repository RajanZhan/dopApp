const baseModel = require("../lib/baseModel");
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
     getSKUCacheKey(id){
        try{
           if(!id)
           {
               throw new Error("无法获取文章缓存的key，因为文章id为空");
           }
           return `sku-${id}`;
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
     * 
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async setSKU(data){
        try{
            if(data.id)
            {
                let cacheKey = this.getSKUCacheKey(data.id);
                await $cache.delete(cacheKey);
                return await this.dataModels.goods.update(data,{
                    where:{
                        id:data.id
                    }
                });
            }
            let res = await this.dataModels.goods.create(data);
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

            let cacheKey = this.getSKUCacheKey(id);
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

    async getSkuById(id){
        try{
            if(!id)
            {
                throw new Error("sku id 不能为空");
            }
            return await this.dataModels.sku.findOne({
                where:{
                    id:id
                }
            });
        }
        catch(err){
            throw err;
        }  
    }

    // 减库存操作
    async subSkuNum(data){
        try{
            if(!data.id)
            {
                throw new Error("sku id 不能为空");
            }
            let sku =  await this.dataModels.sku.findOne({
                where:{
                    id:data.id
                }
            });
            if(!sku)
            {
                throw new Error("规格获取失败");
            }
            let newNum =  Number(sku.num) - Number(data.num);
            if(newNum < 0)
            {
                throw new Error(`${sku.name}库存不足`);
            }
            return await this.dataModels.sku.update({num:newNum},{where:{id:data.id}})
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 添加库存
     * @param {object}   
     * @param {transaction} 事务  
     * @returns {object}. 
     */
     async addSkuNum(data,t){
        try{
            if(!data.id)
            {
                throw new Error("sku id 不能为空");
            }
            let sku =  await this.dataModels.sku.findOne({
                where:{
                    id:data.id
                }
            });
            if(!sku)
            {
                throw new Error("规格获取失败");
            }
            if(Number(sku.num) < 0)
            {
                throw new Error("无法添加库存，因为该商品的可能不计库存");
            }
            let newNum =  Number(sku.num)  + Number(data.num);
            if(newNum < 0)
            {
                throw new Error(`${sku.name}库存不足`);
            }
            if(t)
            {
                return await this.dataModels.sku.update({num:newNum},{where:{id:data.id}},{transaction:t})
            }
            return await this.dataModels.sku.update({num:newNum},{where:{id:data.id}})
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 
     * @param {number} goodsId 
     * @returns {object}. 
     */
    async getSKUByGoodsId(id){
        try{
            if(!id)
            {
                return null;
            }
            var cacheKey = this.getSKUCacheKey(id);
            if($config.debug != 1)
            {
                let cache = await $cache.get(cacheKey);
                if(cache)
                {
                    return cache;
                }
            }
            let res =  await this.dataModels.sku.findAll({
                include:{
                    model:this.dataModels.skuType,
                    as:"skuType"
                },
                where:{
                    goodsId:id
                },
                order:[["sort"]]
            });
            await $cache.set(cacheKey,res,$config.cacheDefaultExpire);
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