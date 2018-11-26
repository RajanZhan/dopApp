const  userModel = require("../model/User.model")();
module.exports = {
    
    // 用户名
    async name(value){
        if((!value) || (value != "name")){
            console.log(value);
            return [false,'name不合法']
        }
        return [true]
    },

    async checkUserId(value)
    {
        let userInfo = await userModel.getUserInfoById(value);
        if(!userInfo)
        {
            return [false,"用户不存在"]
        }
        return [true]
    }
}