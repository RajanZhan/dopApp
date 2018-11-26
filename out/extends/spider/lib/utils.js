const request = require("request");
const iconv = require("iconv-lite");
//  检测有效ip
async function checkValidProxyIp(url) {
    console.log('验证Ip有效性:')

    try {
        try {
            let res = await httpGet({
                url: "https://www.baidu.com",
                proxy: url,
                timeout: 2000,
            });
            if (res) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            let msg = "err in checkValidProxyIp"
            console.log(msg);
            $logger.error(JSON.stringify({err:err,msg:msg}));
            return false;
        }

    } catch (err) {
        throw err;
    }
}


async function httpGet(data) {
    //console.log("http get ",data );
    return new Promise((resolve, reject) => {
        try {
            let opt = {
                url: data.url,
                proxy: data.proxy,
                timeout: data.timeout,
                encoding: null,
                headers:{
                    "User-Agent":getUa(),
                }
            }
            //console.log(" get ua is ",opt.headers["User-Agent"]);
            request.get(opt, function (error, response, body) {
                if (error) {
                    return reject(error)
                }
                if (!error && response.statusCode == 200) {
                    //console.log("get",body) // Show the HTML for the baidu homepage.
                    //let body1 = iconv.decode(body, "gb2312");
                    return resolve(body);
                }
                
                // $logger.error(JSON.stringify(body))
                // $logger.error(JSON.stringify(response))
                // //$logger.error(response.toString())
                // console.log(data);
                resolve(body);
            }).on('error', function (err) {
                console.log("get error");
                reject(err)
            })
        } catch (err) {
            reject(err);
        }

    })
}

function getUa() {
    let ua = $ua.data;
    if (ua.length == 0) {
        return null;
    }
    let index = randomNum(0, ua.length - 1);
    return ua[index];
}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

module.exports = {
    checkValidProxyIp,
    httpGet,
    randomNum,
    getUa,
}