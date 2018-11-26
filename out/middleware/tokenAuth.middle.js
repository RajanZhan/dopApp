const tokenModel = require("../model/Token.model")();
module.exports = async (req,res,next)=>{
    let clientKey = req.headers["client-key"];// 微信小程序的标志
    if(!clientKey)
    {
        return res.error("授权验证失败");
    }
    if(clientKey && (clientKey == 'wxmini-100'))
    {
        console.log("token check ok mini program");
        return next();
    }
    console.log("clientKey is ",clientKey);
   
    return next();
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    if(ip == '127.0.0.1')
    {
        console.log("inner call");
        return next();
    }
    
    //await tokenModel.setToken({ua:ua,ip:ip})
    console.log("worker station  拦截,real ip ",ip);
    var token = null
    if (req.method == 'GET') {
        token = req.query.token;
    } else if (req.method == 'POST') {
        token = req.body.token;
    }
    if (!token) {
        return res.stop("token can not be empty");
    }
    
    let check = await tokenModel.checkToken({
        token: token,
       // ua: ua,
        ip: ip
    })

    if (!check) {
        return res.stop("token is invalid");
    }

    //console.log("set token ");

    next();
}