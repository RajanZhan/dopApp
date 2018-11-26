// admin 类 接口登录验证 /api/admin/*
module.exports = async (req,res,next)=>{
    //console.log("session admin middle ");
    // if(!await req.session("admin")){
    //     res.deny("请先登录后台系统");
    //     return;
    // }
    next();
}