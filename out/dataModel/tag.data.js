const Sequelize = require("sequelize");
module.exports = {
    name: "tags",
    tableName: "tags",
    body: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: Sequelize.INTEGER, //
        createTime:Sequelize.DATE,// 日期 
        name:Sequelize.STRING(128),// 备注
    },
    // 创建索引
    indexes: [{
        fields: ['name'] 
    }, 
    {
        fields: ['userId'] 
    },
    // {
    //     type:"FULLTEXT",// 全文索引
    //     fields:["remark"]
    // },
    // {
    //     fields:["tagid_list"] // 普通索引
    // },
 ]
}