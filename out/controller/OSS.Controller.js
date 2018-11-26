var express = require('express'),router = express.Router();
var db = require("../common/db")();

const OSSModel =  require("../model/oss.model")({bucket:"chenstory"});

function middle(req,res,next){
    //console.log("home 拦截1111");
    next();
}


router.get("/",async(req,res)=>{
    try {
        let bucket = req.query.bucket;
        let key = req.query.key;
        if(!key)
        {
            res.stop("资源key不能为空");
            return;
        }
        let url = await OSSModel.getSourceURL(key,bucket);
        if(!url)
        {
            res.stop("生成oss资源URL失败");
            return;
        }
        res.redirect(url);
    }
    catch(err)
    {
        $logger.error({err:err,msg:"oss/:bucket/:source_key,错误"});
        res.error("服务器错误");
    }
});


module.exports = {
	router,
	middle
};