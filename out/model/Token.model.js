const baseModel = require("../lib/baseModel");



// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     * 生成token key
     * @param {object} {token,ua,ip}
     * @returns {string}.token key
     */
    getTokenKey(data) {
        try {
            if ((!data) || (!data.ip)) {
                throw new Error("getTokenKey 数据不完整");
            }
            return $common.md5(`${data.ip}-${data.ua}`);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 验证token的合法性
     * @param {number} userid
     * @returns {object}. goods
     */
    async checkToken(data) {
        try {
            if ((!data) || (!data.token) ||(!data.ip)) {
                throw new Error("checkToken 数据不完整");
            }
            // let key = this.getTokenKey(data);
            
            // if(!key)
            // {
            //     throw new Error("checkToken 生成token key 失败");
            // }
            let ip = await $cache.get(data.token);
            //console.log("check token",token,"-----",key);

            if((ip != data.ip))
            {
                return false;
            }
            //await this.setToken();
            await this.expireToken(data.token);
           
            return true
            
        } catch (err) {
            throw err;
        }
    }


    /**
     * 添加token
     * @param {object}  {ua,ip}
     * @returns {object}. goods
     */
    async setToken(data) {
        try {
            if ((!data) || (!data.ip)) {
                throw new Error("setToken 数据不完整");
            }
            // let key = this.getTokenKey(data);
            
            // if(!key)
            // {
            //     throw new Error("setToken 生成token key 失败");
            // }
            let token = $common.md5(`${new Date().getTime()} - token`)
            await $cache.set(token,data.ip,$config.cacheDefaultExpire);
            return token
            
        } catch (err) {
            throw err;
        }
    }


     /**
     * 添加token
     * @param {string}  key ,token key
     * @param {number}  time ,过期时间
     * @returns {boolean}. 
     */
    async expireToken(key) {
        try {
            if ((!key) ) {
                throw new Error("expireToken 数据不完整");
            }
            //console.log("expire token");
            let res = await $cache.expire(key,$config.cacheDefaultExpire);
            return res
            
        } catch (err) {
            throw err;
        }
    }



    /**
     * 销毁token
     * @param {object}  {ua,ip}
     * @returns {object}. goods
     */
    async delToken(data) {
        try {
            if ((!data) || (!data.ip)) {
                throw new Error("delToken 数据不完整");
            }
            let key = this.getTokenKey(data);
            
            if(!key)
            {
                throw new Error("delToken 生成token key 失败");
            }
           
            let res = await $cache.delete(key);
            return res
            
        } catch (err) {
            throw err;
        }
    }
}
module.exports = (option) => {
    return new c(option)
};