const  userModel = require("../model/User.model")();
const  planModel = require("../model/Plan.model")();
module.exports = {
    
    
    async checkPlanForUser(planId,userId)
    {
        if(!planId || !userId)
        {
            return [false,"planId or userid is empty in checkNoteForUser"]
        }
        let userInfo = await userModel.getUserInfoById(userId);
        if(!userInfo)
        {
            return [false,"用户不存在"]
        }
        let noteInfo = await planModel.getPlanDetail(planId);
        if(!noteInfo)
        {
            return [false,"计划数据获取失败"]
        }
        if(noteInfo.userId != userId)
        {
            return [false,"计划与用户不匹配"]
        }
        return [true]
    }
}