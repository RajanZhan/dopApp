const Sequelize = require("sequelize");
module.exports = {
    name:"userDialog",
    tableName:"fa_wechat_userdialog",
    body:{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userId:Sequelize.INTEGER,
        dialogId:Sequelize.INTEGER,
    }
}