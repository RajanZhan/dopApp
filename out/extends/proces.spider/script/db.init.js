module.exports = async () => {
    console.log("数据库初始化中....");
    var models = [];
    models.push(require("../db/med.article.data"));

    function relationship(db) {
        // db.models.user.hasOne(db.models.userInfoAdd, {
        //     as: "userInfo",
        //     foreignKey: "mainTableId", //wuid mainTableId
        //     targetKey: "wuid"
        // })
        return db;
    }



    global.$db = await require("rajan-datamodel")({
        config: {
            "host": $config.db.host,
            "db":  $config.db.db,
            "uname":  $config.db.uname,
            "pwd":  $config.db.pwd
        },
        models: models,
        relationship: relationship,
        //modelTest: modelTest,
    });


    console.log("数据库初始化完成");
}