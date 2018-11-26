const baseModel = require("../lib/baseModel");

// 常用语model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }

    /**
     * 新增常用语
     * @param {object} {id，words}
     * @returns {object}. goods
     */
    async addWords(data){
        try{
            if(!data || !data.words || !data.userId)
            {
               throw new Error("Words.model.addWords,data or data.words or data.userId is empty");
            }
            return await this.dataModels.words.create({
                userId:data.userId,
                words:data.words,
                status:1
            })
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 更新常用语
     * @param {object} {id，words}
     * @returns {object}. goods
     */
    async updateWords(data){
        try{
            if(!data || !data.words || !data.id)
            {
               throw new Error("Words.model.updateWords,data or data.words is empty");
            }
            return await this.dataModels.words.update({
                words:data.words,
            },{
                where:{
                    id:data.id
                }
            })
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 删除常用语
     * @param {int} id 
     * @returns {object}. 
     */
    async delWords(id){
        try{
            if(!id)
            {
               throw new Error("Words.model.delWords,id is empty");
            }
            return await this.dataModels.words.destroy({
                where:{
                    id:id
                }
            })
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 根据用户id 读取常用语列表
     * @param {number} userId
     * @returns {object}. goods
     */
    async getWordsByUserId(userId){
        try{
            if(!userId)
            {
                throw new Error("Words.model.getWordsByUserId,userId is empty");
            }
           
            let res =   await this.dataModels.words.findAll({
                where:{
                    userId:userId
                },
            });
            
            return res;
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 读取产用语详情
     * @param {number} id
     * @returns {object}. goods
     */
    async getWord(id){
        try{
            if(!id)
            {
                throw new Error("Words.model.getWord,id is empty");
            }
           
            let res =   await this.dataModels.words.findOne({
                where:{
                    id:id
                },
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