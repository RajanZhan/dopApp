
class base {
    constructor(){
        if(!$db)
        {
            throw new Error("base.model.constructor  数据库尚未初始化完成");
        }
        this.dataModels = $db.models;
    }
}
module.exports = base;