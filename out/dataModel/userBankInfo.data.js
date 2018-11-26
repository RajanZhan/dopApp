const Sequelize = require("sequelize");
module.exports = {
    name:"userBankInfo",
    body:{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        userId: Sequelize.INTEGER,//用户id
        telNum :Sequelize.STRING(128),
        bankName:Sequelize.STRING(128),
        userName:Sequelize.STRING(128),
        account:Sequelize.TEXT,
    }
}
 