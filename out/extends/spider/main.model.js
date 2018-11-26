const spiderArticleModel = require("../../model/spiderArticle.model")();
const cheerio = require('cheerio');
const proxyModel = require("../../model/ProxyIp.model")();
const request = require("request");
const iconv = require("iconv-lite");
const fs = require("fs");

//const Thead = require("./lib/thread")();
const utils = require("./lib/utils");
var cgCatchCount = 0;
var cgmap = new Map(); //记录每页文章列表读取什么地方
var cgcurrentPage = 1;
class c {
    constructor(opt) {
        //super();
        this.option = opt
    }
    // 爬取采购网
    async cgSpideer() {
        try {


            await $common.sleep(1000 * 3);
            console.log("start @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //await proxyModel.loadNormalProxyIp($config.spider.getNormalProxyUrl);
            // await proxyModel.loadSpiderProxyIp($config.spider.getProxyUrl);
            // return

            // 初始化title 缓存
            var initTitleCache = async function () {
                let titles = await spiderArticleModel.getAllTitle();
                for (let t of titles) {
                    await $cache.set("title_cache" + t.title, 1); // 存100 分钟
                    //console.log("set ",t.title,);
                }
                console.log("初始化title 缓存");
            }

            // 将已有的数据缓存起来，方便匹配
            await initTitleCache()

            var proxy = null;
            while (!proxy) {
                console.log("读取可用ip...");
                proxy = await proxyModel.getValidIps();
            }
            console.log("可用ip...", proxy);
            //console.log("all");return;
            var cacheurl = "http://www.yngp.com/bulletin.do?method=moreListQuery";
            let data = await post({
                url: cacheurl,
                page: 1,
                psize: 100,
                proxy: proxy,
                headers: {
                    ua: utils.getUa()
                }
            });

            var pushData = []; // 即将存储的文章，当达到1000条时存入一次
            // 采集具体内容
            let totalPage = Number(data.totlePageCount);
            let allDataCount = data.total
            let cpage = await $cache.get("spider-page");
            let currentPage = cpage ? Number(cpage) : Number(cgcurrentPage);
            let insertCount = 0;

            while (currentPage <= totalPage) {
                console.log("采集页数++++++++++++++++++++++++++++++", currentPage);

                // if (proxy) {
                //     let check = await utils.checkValidProxyIp(proxy);
                //     if (!check) {
                //         proxy = null

                //     }
                // }
                var newProxy = null
                while (!newProxy) {
                    newProxy = await proxyModel.getValidIps(proxy); // 读取代理ip
                    if (newProxy) {
                        proxy = newProxy;
                    }
                }

                data = await post({
                    proxy: proxy,
                    url: cacheurl,
                    page: currentPage,
                    psize: 100,
                    headers: {
                        ua: utils.getUa()
                    }
                })
                //console.log("读取页数", currentPage)
                if (data.rows.length > 0) {
                    var i = await $cache.get(`page_${currentPage}_index`) ? Number(await $cache.get(`page_${currentPage}_index`)) : 0;

                    console.log(`第${currentPage}页从下标为${i}开始读取`);
                    for (; i < data.rows.length; i++) {
                        let d = data.rows[i];
                        await $cache.set(`page_${currentPage}_index`, i);
                        if (d) {

                            // 检测内容是否重复
                            //let ori = await spiderArticleModel.getArticleByTitle(d.bulletintitle);
                            let ori = await $cache.get("title_cache" + d.bulletintitle);
                            if (ori) {
                                console.log(`第${cgCatchCount + 1}次采集，检测到重复数据，无需入库，`, d.bulletintitle.slice(0, 60));
                                continue;
                            }

                            //let getproxyurl = $config.getProxyUrl
                            // let ip = await utils.get({
                            //     url: getproxyurl,
                            //     timeout: 3000,
                            // });

                            //let proxy = null;
                            // if (proxy) {
                            //     let check = await utils.checkValidProxyIp(proxy);
                            //     if (!check) {
                            //         proxy = null
                            //         while (!proxy) {
                            //             proxy = await proxyModel.getValidIps(); // 读取代理ip
                            //         }
                            //     }
                            // }
                            var newProxy = null
                            while (!newProxy) {
                                newProxy = await proxyModel.getValidIps(proxy); // 读取代理ip
                                if (newProxy) {
                                    proxy = newProxy;
                                }
                            }
                            
                            // 读取内容
                            let url = `http://www.yngp.com/newbulletin_zz.do?method=preinsertgomodify&operator_state=1&flag=view&bulletin_id=${d.bulletin_id}`;
                            let adetail = await utils.httpGet({
                                url: url,
                                proxy: proxy,
                                headers: {
                                    ua: utils.getUa()
                                }
                            });
                            console.log("读取内容休眠");
                            await $common.sleep(1200);
                            const $ = cheerio.load(adetail);
                            let content = $("#searchPanel").html();
                            // console.log("内容",);
                            // break;
                            let path = "./articleContent/" + d.bulletin_id + ".txt"
                            fs.writeFileSync(path, content)
                            let article = {
                                title: d.bulletintitle,
                                area: d.codeName,
                                atime: d.finishday,
                                intro: "",
                                class: d.bulletinclass,
                                catchTime: new Date(),
                                resource: "中国政府采购网云南分网",
                                content: path,
                                url: url,
                            };
                            pushData.push(article);
                            console.log("该条数据可以入库");
                            if (pushData.length > 10) {
                                let saveres = await save(pushData);
                                if (saveres) {
                                    await initTitleCache();
                                    pushData = [];
                                }
                            }


                        }
                    }
                    await $cache.delete(`page_${currentPage}_index`);
                }
                currentPage++;
                cgcurrentPage = currentPage;
                await $cache.set("spider-page", currentPage);
                await $common.sleep(5000);
            }
            let endTime = new Date().getTime();
            cgCatchCount++;

            let log =
                `第${cgCatchCount}次采集，采集完成时间：${ $common.dateFormate(new Date(),"yyyy-MM-dd hh:mm:ss") }，
            耗时：${ ((endTime - starttime) / (1000 * 60)).toFixed(0) }分钟，共采集${allDataCount}条，入库${insertCount}条，`

            console.log(log);
            $logger.createLogger(__dirname + "cgCache.log").info(log);
        } catch (err) {
            console.log("采购网读取数据发生异常", err);
            //fs.writeFileSync("./error.html", err)
            $logger.error({
                err: err,
                currentPage: cgcurrentPage,
            });

            let saveres = await save(pushData);
            if (saveres) {
                pushData = [];
                console.log("程序异常数据存储补救措施.....");
            }

            this.cgSpideer();
            //throw err;
        }
    }

    // 读取代理爬虫ip
    async getSpiderProxy() {
        try {
            let url = "http://api.ip.data5u.com/dynamic/get.html?order=318a742f5f30a0bea3134d9d5bc28f40&sep=3"

            let ip = await utils.get({
                url: url,
                timeout: 3000,
            });
            let validat = [];
            while (validat.length <= 10) {
                if (ip) {
                    // 检测ip可用
                    let check = await utils.checkValidProxyIp(`http://${ip}`);
                    if (check) {
                        let arr = ip.split(":");
                        validat.push({
                            type: "http",
                            ip: arr[0],
                            port: arr[1]
                        });
                        console.log("ip 可用", ip);
                    } else {
                        console.log("ip 不可用", ip);
                    }
                }
            }
            await proxyModel.adds(validat);

        } catch (err) {
            throw err
        }
    }

}




// 统一存储 采集的文章，防止异常退出，数据丢失
async function save(data) {
    try {
        if (data && (data.length > 0)) {
            let res = await spiderArticleModel.setArticles(data);
            if (res) {
                console.log(`第${cgCatchCount + 1}次采集，插入${data.length}条，`, );
                data = [];
            }
            return true
        }
        return false;
    } catch (err) {
        console.log("存储采集数据失败");
        throw err;
    }
}

async function get(url) {
    return new Promise((resolve, reject) => {
        try {
            request({
                url: url,
                encoding: null
            }, function (error, response, body) {
                if (error) {
                    return reject(error)
                }
                if (!error && response.statusCode == 200) {
                    //console.log("get",body) // Show the HTML for the baidu homepage.
                    let body1 = iconv.decode(body, "gb2312");
                    resolve(body1);
                }
            }).on('error', function (err) {
                reject(err)
            })
        } catch (err) {
            reject(err);
        }

    })
}

// 采集数据
async function post(data) {
    let url = data.url;
    //var proxy = false;
    // if (data.useProxy) {
    //     let list = await getProxyList({
    //         url: "http://api.ip.data5u.com/api/get.shtml?order=318a742f5f30a0bea3134d9d5bc28f40&num=100&carrier=0&protocol=0&an1=1&an2=2&an3=3&sp1=1&sp2=2&sp3=3&sort=1&system=1&distinct=0&rettype=0&seprator=%0D%0A",
    //         // key: "318a742f5f30a0bea3134d9d5bc28f40",
    //         // type: "normal"
    //     });
    //     let ips = list.data;
    //     //let proxy = `${ips[0].type}://${ips[0].ip}:${ips[0].port}`
    //     proxy = ` http://104.248.223.5:8080`;
    // }
    if (!data.headers) {
        data.headers = {};
    }
    var opt = {
        url: url,
        encoding: null,
        headers: {
            "content-type": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Connection": "keep-alive",
            "Content-Length": "151",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "yunsuo_session_verify=85b586114d427177d4b13e7688644fa9; JSESSIONID=pLZybHqVlz5Q9g9sTWTlQwQk6pWBcP77W34blV8cdd0GSQS23Bxl!519234059; xincaigou=49737.2929.22.0000",
            "Host": "www.yngp.com",
            "Origin": "http://www.yngp.com",
            "Referer": "http://www.yngp.com/bulletin.do?method=moreList&menuSelect=nav2",
            "User-Agent": utils.getUa(),
            "X-Requested-With": "XMLHttpRequest",
        },
        form: {
            current: data.page ? data.page : 1,
            rowCount: data.psize ? data.psize : 100,
            searchPhrase: "",
            query_bulletintitle: "",
            query_startTime: "2000-01-01",
            query_endTime: "2018-10-18",
            query_sign: 1,
            query_codeName: "",
            query_gglxdm: "bxlx005"

        }
    }
    if (data.proxy) {
        opt.proxy = data.proxy;
    }

    return new Promise((resolve, reject) => {
        try {
            request.post(opt, function (error, response, body) {
                try {
                    if (!error && response.statusCode == 200) {
                        let body1 = iconv.decode(body, "gb2312");
                        resolve(JSON.parse(body1));
                    } else {
                        reject(error)
                    }
                } catch (err) {
                    reject(err)
                }
            }).on('error', function (err) {
                reject(err)
            })
        } catch (err) {
            reject(err)
        }


    })
}


// 读取爬虫代理ip {key:无忧代理的可以，type:代理的类型}
function getProxyList(data) {
    var url = "";
    if (!data) {
        throw new Error("读取代理ip data 为空");
    }

    if (data.url) {
        url = data.url;
    } else if (data.key && data.type) {
        if (data.type == "normal") {
            url = `http://api.ip.data5u.com/dynamic/get.html?order=${data.key}&sep=3`
        }
    }

    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            gzip: true,
            encoding: null,
            headers: {},
        };
        request(options, function (error, response, body) {
            try {

                //console.log(body.toString());
                if (error) throw error;

                let iplist = JSON.parse(body.toString());
                // ip入库 
                proxyModel.add(iplist.data)

                resolve(iplist);
            } catch (e) {
                return reject(e);
            }
        });
    });
}

module.exports = (opt) => {
    return new c(opt);
}