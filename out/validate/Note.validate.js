const  userModel = require("../model/User.model")();
const  noteModel = require("../model/Note.model")();
module.exports = {
    
    
    async checkNoteForUser(noteId,userId)
    {
        if(!noteId || !userId)
        {
            return [false,"noteid or userid is empty in checkNoteForUser"]
        }
        let userInfo = await userModel.getUserInfoById(userId);
        if(!userInfo)
        {
            return [false,"用户不存在"]
        }
        let noteInfo = await noteModel.getNoteDetail(noteId);
        if(!noteInfo)
        {
            return [false,"随笔数据获取失败"]
        }
        if(noteInfo.userId != userId)
        {
            return [false,"随笔与用户不匹配"]
        }
        return [true]
    }
}