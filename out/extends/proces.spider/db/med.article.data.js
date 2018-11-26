const Sequelize = require("sequelize");
module.exports = {
    name:"medArticle",
    tableName:"med.article",
    body:{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        title: Sequelize.STRING(512),//
        typeId:Sequelize.INTEGER,// 文章类别
        url:Sequelize.TEXT,
        author:Sequelize.STRING(128),
        publishTime:Sequelize.DATE,
        brief:Sequelize.STRING(512),
        content:Sequelize.STRING(128), // 之存储文件路径
        rsc:Sequelize.STRING(128),// 文章来源
        spiderTime:Sequelize.DATE,
    }
}