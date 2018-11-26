const Sequelize = require("sequelize");
//常用语模型
module.exports = {
    name:"words",
    tableName:"fa_wechat_words",
    body:{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userId: Sequelize.INTEGER,//用户id
        words:Sequelize.TEXT,//为谁咨询
        status:Sequelize.INTEGER,// 
    }
}

