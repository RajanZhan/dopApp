const Sequelize = require("sequelize");
module.exports = {
    name: "plan",
    tableName: "plan",
    body: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tmpId: Sequelize.INTEGER, 
        userId: Sequelize.INTEGER, //
        time:Sequelize.DATE,// 日期 
        remark:Sequelize.TEXT,// 备注
        status: Sequelize.INTEGER,
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