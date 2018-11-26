var models = [];
models.push(require("../dataModel/user.data"));
models.push(require("../dataModel/plan.data"));
models.push(require("../dataModel/plan.tplt.data"));
models.push(require("../dataModel/note.data"));
models.push(require("../dataModel/tag.data"));

function relationship(db){
	//  db.models.user.hasOne(db.models.userInfoAdd, {
    //     as: "userInfo",
    //    foreignKey: "mainTableId", //wuid mainTableId
    //    targetKey: "wuid"
	// })
	db.models.plan.belongsTo(db.models.planTmp,{
		as:"planInfo",
		foreignKey:"tmpId",
		targetKey:"id"
	})
	db.models.plan.belongsTo(db.models.user,{
		as:"userInfo",
		foreignKey:"userId",
		targetKey:"wuid"
	})
	return db;
}

async function modelTest(db)
{
	//console.log("model test ",db);
	/*letdb.models.user.create({
		nickname:"rajan",
	})
	
	db.models.userInfoAdd.create({
		realName:"占",
		mainTableId:1
	})
	*/
	// let res = await db.models.user.findOne({
	// 	include:{
	// 		as:"userInfo",
	// 		model:db.models.userInfoAdd
	// 	},
	// 	where:{
	// 		wuid:1,
	// 	}
	// })
	// console.log("查询的结果",res.userInfo.realName);
	//return db;
}

module.exports =  async ()=>{
	return await require("rajan-datamodel")({
		config:{
			"host":$config.db.host,
			"db":$config.db.db,
			"uname":$config.db.uname,
			"pwd":$config.db.pwd,
			"logging":$config.debug == 1?true:false,
		},
		models:models,
		relationship:relationship,
		modelTest:modelTest,
    });
   
	//console.log("db is ",db);
}
