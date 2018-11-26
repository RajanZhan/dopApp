const baseModel = require("../lib/baseModel");

// 商品model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }

    
    /**
     * 获取启用的摄像机列表
     * 
     * @returns {array}. clist
     */
    async getCameras(){
        try{
            
            let list =   await this.dataModels.camera.findAndCountAll({
                where:{
                    status:1
                },
                order:[["id","desc"]],
            });
            return list;
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 获取可直播的摄像机
     * 
     * @returns {array}. clist
     */
    async getLiveCameras(){
        try{
            
            let list =   await this.dataModels.camera.findAndCountAll({
                where:{
                    status:1,
                    isPush:1,
                },
                order:[["id","desc"]],
            });
            return list;
        }
        catch(err){
            throw err;
        }  
    }


     /**
     * 摄像机缓存你的key
     * @param {int} cid 摄像机id
     * @returns {string}. key
     */
    getCameraCacheKey(cid){
         return `camera-live-${cid}`
    }

    /**
     * 根据摄像机id检测该摄像机是否有人观看，此处用于推流程序判断
     * @param {int} cid 摄像机id
     * @returns {bool}. 返回是否有人观看
     */
    async checkIsWatched(cid){
        try{
            
            // let list =   await this.dataModels.camera.findAndCountAll({
            //     where:{
            //         status:1,
            //         isPush:1,
            //     },
            //     order:[["id","desc"]],
            // });

            if(!cid){
                throw new Error("cid 为空，无法检测其观看情况");
            }

            let key = this.getCameraCacheKey(cid);
            let res = await $cache.get(key);
            if(res)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 设置摄像机的观看标志，方便推流程序持续推流
     * @param {int} cid 摄像机id
     * @returns {bool}. 成功与否
     */
    async setCameraWatch(cid){
        try{
            
            
            if(!cid){
                throw new Error("cid 为空，无法检测其观看情况");
            }

            let key = this.getCameraCacheKey(cid);

            let res = await $cache.set(key,1,15);// 五秒自动清除
            return res
        }
        catch(err){
            throw err;
        }  
    }




   
}
module.exports = (option)=>{
    return new c(option)
};