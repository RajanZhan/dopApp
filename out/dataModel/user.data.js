const Sequelize = require("sequelize");
module.exports = {
    name: "user",
    tableName: "user",
    body: {
        wuid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: Sequelize.STRING(128), //
        remark: Sequelize.STRING(128), //
        headimgurl: Sequelize.STRING(128),
        openid: Sequelize.STRING(128),
        unionid: Sequelize.STRING(128),
        Idattribute: Sequelize.STRING(512),
        roleId: Sequelize.INTEGER,
        remark:Sequelize.TEXT,// 备注
        tagid_list: Sequelize.STRING(512),
        createTime:Sequelize.DATE,// 注册时间
    },
    // 创建索引
    indexes: [{
        unique:true,
        fields: ['openid'] // 唯一索引
    }, 
    {
        type:"FULLTEXT",// 全文索引
        fields:["remark"]
    },
    {
        fields:["tagid_list"] // 普通索引
    }, ]
}