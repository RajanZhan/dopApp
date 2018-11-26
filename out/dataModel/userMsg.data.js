const Sequelize = require("sequelize");
module.exports = {
    name:"userMsg",
    body:{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userId: Sequelize.INTEGER,//用户id
        title:Sequelize.STRING(128),// 红包名字
        content:Sequelize.TEXT,// 红包名字
        typeId:Sequelize.INTEGER,//类型id
        status:Sequelize.BOOLEAN,// 是否已读
        time:Sequelize.DATE,//时间
    }
}
 