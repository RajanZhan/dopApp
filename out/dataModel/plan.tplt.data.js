const Sequelize = require("sequelize");
module.exports = {
    name: "planTmp",
    tableName: "planTmp",
    body: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title:Sequelize.STRING(128),
        content:Sequelize.TEXT,
        startTime:Sequelize.DATE,
        endTime:Sequelize.DATE,
        userId:Sequelize.INTEGER,
        status:Sequelize.INTEGER,
    },
    // 创建索引
    indexes: [{
        fields: ['status'] 
    }, 
    {
        fields: ['userId'] 
    }
    // {
    //     type:"FULLTEXT",// 全文索引
    //     fields:["remark"]
    // },
    // {
    //     fields:["tagid_list"] // 普通索引
    // },
 ]
}