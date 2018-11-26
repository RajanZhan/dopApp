// 道普授权中间件
const expire = 60 * 10;// token的过期时间
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};


export default async (req, res, next) => {

    req.$ip = getClientIP(req);
    req.createDopAuthInfo =(info)=>{
        let token = $common.getRandomString();
        $cache.set(<string>token,info,expire); // 十分钟的授权 
        return {
            token
        }
    }

    if (!$cache) {
        throw new Error("dopAuth error,$cache is undefined");
    }
    let methods = req.method;
    if (!methods) {
        throw new Error("授权中间件验证失败，methods 读取失败");
    }

    // 免授权的地址
    if (req.path.indexOf("/api/public") != -1) {
        //console.log("免授权");
        return next();
    }
    let noauth = new Set($config.noAuthPath);
    if (noauth.has(<never>req.path)) {
        //console.log("免授权");
        return next();
    }
    //console.log(noauth);

    if (req.path.indexOf('/api') == -1) {
        return next();
    }
    let token = req.headers.token;
    let appId = req.headers.appid;
    //let ip = getClientIP(req);
    //console.log("ip is ",ip);

    if (!token || !appId) {
        console.log(req.headers);
        res.stop("token or appId is empty");
    }
    if (!req.$ip) {
        res.stop("client ip is empty");
    }

    let authInfo = await $cache.get(token);
    if (!authInfo) {
        res.stop("get auth info  error");
    }

    if (!authInfo['ip'] || (authInfo['ip'] != req.$ip) || (authInfo['appId'] != appId )) {
        console.log(authInfo)
        res.stop("auth  error");
    }
    
    req.$dopAuth = authInfo;
    $cache.expire(token,expire);
    console.log("道普授权中间件，methods", methods);
    next();
}