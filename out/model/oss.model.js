const baseModel = require("../lib/baseModel");
const db = require("../common/db")();
const OSS = require('ali-oss');

/*****私有方法begin ******/
function getURLCacheKey (bucket,key)
{
    if((!bucket) || (!key))
    {
        throw new Error("无法URL生成缓存key in getURLCacheKey");
    }
    return `URL-CACHE-KEU-${bucket}-${key}`
}
/*****私有方法 end ******/

class OSSModel extends baseModel {
    constructor(option)
    {
        super();
        this.option = option
    }

    getOOSClient(bucket)
    {
        if(!bucket)
        {
            throw new Error("oss.model getOOSClient bucket 不能为空");
        }
        return new OSS({
            region: $config.oss.region,
            accessKeyId: $config.oss.accessKeyId,
            accessKeySecret: $config.oss.accessKeySecret,
            bucket:bucket
        });
    }
    

    async getSourceURL(key,bucket)
    {
        
        if(!bucket)
        {
          bucket =  this.option.bucket
        }
        if(!key){
            throw new Error("oss.model getSourceURL key 不能为空");
        }
        // let cacheKey = getURLCacheKey(bucket,key);
        // let cache = await $cache.get(cacheKey);
        // if(cache)
        // {
        //     return  cache;
        // }
        var oss = this.getOOSClient(bucket);
        var url = oss.signatureUrl(key, {expires: $config.oss.expires});
        //await $cache.set(cacheKey,url,$config.oss.expires);
        return url
    }
    
    async test()
    {
        
        let url = await this.getSourceURL("music/pfzl.mp3");
        console.log(url);
        return "test"
    }
}

module.exports = (option)=>{
    return new OSSModel(option);
}