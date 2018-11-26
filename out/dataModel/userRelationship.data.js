const Sequelize = require("sequelize");
module.exports = {
    name:"userRelationship",// 模型名
    tableName:"fa_wechat_user_relationship",// 表名，如果不填，则使用模型名
    body:{

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },

        
        userId:{
            type: Sequelize.INTEGER,
            allowNull:false,
        },

        // 对方id
        toId:{
            type: Sequelize.INTEGER,
            allowNull:false,
        },

        // 关系id
        relationId:{
            type: Sequelize.INTEGER,
            allowNull:false,
        },


    


    }
}