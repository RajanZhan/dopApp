const baseModel = require("../lib/baseModel");


// 商品model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }
    
    
     /**
     * 
     * @param {object} data -  获取配置信息
     * @returns {unknown}. 返回添加的结果 
     */
    async getConfig(data){
        try{
            if(!data)
            {
                throw new Error("参数不正确");
            }
            
            let res = await this.dataModels.config.findAll({
                where:{
                    key:{
                        $in:data
                    }
                }
            });
            //console.log("create article ",res);
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