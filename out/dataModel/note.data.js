const Sequelize = require("sequelize");
module.exports = {
    name: "note",
    tableName: "note",
    body: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: Sequelize.INTEGER, //
        createTime:Sequelize.DATE,// 日期 
        tags:Sequelize.STRING(512),// 备注
        content:Sequelize.TEXT,// 备注
        status: Sequelize.INTEGER,
    },
    // 创建索引
    indexes: [{
        fields: ['tags'] 
    }, 
    {
        fields: ['userId'] 
    },
    {
        type:"FULLTEXT",// 全文索引
        fields: ['content'] 
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