module.exports = (req,res,next)=>{
    let ua = req.headers['user-agent'];
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    req.realIp = ip;
    req.ua = ua;
    next();
}