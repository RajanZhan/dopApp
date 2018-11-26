const baseModel = require("../lib/baseModel");

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


    /**
    * 读取科室的详细信息
    * @param {int} id - 
    * @returns {unknown}. 返回添加的结果 
    */
    async getDeptInfo(id) {
        try {
            if (!id) {
                throw new Error("getDeptInfo id is empty");
            }

            let res = this.dataModels.dept.findOne({

                where: {
                    id: id
                }
            })
            return res;
        }
        catch (err) {
            throw err;
        }
    }


    /**
   * 读取科室列表
   * 
   * @returns {unknown}. 返回添加的结果 
   */
    async getDeptList() {
        try {
            let key =`deptlist-cache` ;
            let cache = await $cache.get(key);
            if(cache){
                return cache;
            }
            let res = await this.dataModels.dept.findAll();
            await $cache.set(key,res,60);
            return res;
        }
        catch (err) {
            throw err;
        }
    }





}
module.exports = (option) => {
    return new c(option)
};