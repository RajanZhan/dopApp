const baseModel = require("../lib/baseModel");

const utils = require("../extends/spider/lib/utils");
let IpCachkey = `ips in cache`;

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     *  新增ip 多条输入
     * @param {Array} data - ip数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async adds(data) {
        try {

            await $cache.delete(IpCachkey);

            let ips = []
            for (let d of data) {
                let check = await this.checkIpExist(d.ip, d.port);
                if (check) {
                    continue;
                }
                ips.push(d);
            }
            await this.dataModels.proxyip.bulkCreate(ips)
            console.log("批量 ip 入库", ips.length);
            return true;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  新增ip 单条输入
     * @param {Array} data - ip数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async add(data) {
        try {

            await $cache.delete(IpCachkey);
            let check = await this.checkIpExist(data.ip, data.port);
            if (check) {
                return null;
            }
            //console.log(" 单条 ip 入库");
            return await this.dataModels.proxyip.create(data)
        } catch (err) {
            throw err;
        }
    }

    /**
     *  检测ip 是否存在
     * @param {Array} data - ip数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async checkIpExist(ip, port) {
        try {
            if (!ip || !port) {
                return null;
            }
            return await this.dataModels.proxyip.findOne({
                where: {
                    ip: ip,
                    port: port
                }
            })
        } catch (err) {
            throw err;
        }
    }

    /**
     *  读取ip库
     * @param {Array} data - ip数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async getIps() {
        try {
            return await this.dataModels.proxyip.findAll()
        } catch (err) {
            throw err;
        }
    }

    /**
     *  向代理服务器读取普通代理ip
     * @param {url}  数据接口
     * @returns {unknown}. 返回添加的结果 
     */
    async loadNormalProxyIp(url) {
        try {
            if (!url) {
                throw new Error("url is empty in ProxyIp.model.loadNormalProxyIp");
            }
            let ips = await utils.httpGet({
                url: url
            });
            let iplist = JSON.parse(ips.toString());
            iplist = iplist.data;
            let checkIps = [];
            let valida = [];
            //console.log(ips);
            for (let ip of iplist) {
                if (!ip) {
                    continue;
                }

                valida.push(ip);
                // let pip = `${ip.type}://${ip.ip}:${ip.port}`
                // let res = await utils.checkValidProxyIp(pip);
                // if (res) {

                //     console.log("[*****]有效ip",pip);
                //     await this.add(ip);
                // }
                // else
                // {
                //     console.log("无效ip",pip);
                // }
            }
            await this.adds(valida);
            // if(valida.length > 0)
            // {
            //     await this.adds();
            // }
            // else
            // {
            //     console.log("ip 都 无效");
            // }


        } catch (err) {
            throw err
        }

    }

    /**
     *  向代理服务器读取普通代理ip
     * @param {url}  数据接口
     * @returns {unknown}. 返回添加的结果 
     */
    async loadSpiderProxyIp(url) {
        try {
            if (!url) {
                throw new Error("url is empty in ProxyIp.model.loadSpiderProxyIp");
            }
            let proxyurl = ""

            async function getProxyUrl(url) {
                //console.log("向代理服务商提取代理ip");
                let ip = await utils.httpGet({
                    url: url,
                    timeout: 3000,
                });
                return ip.toString();
            }
            let ip = await getProxyUrl(url);
            //console.log("ip",ip);
            // if (!ip) {
            //     ip = await getProxyUrl();
            // }
            proxyurl = `http://${ip}`
            //let check = await utils.checkValidProxyIp(proxyurl);
            let arr = ip.split(":");
            await this.add({
                type: "http",
                ip: arr[0],
                port: arr[1]
            })

            // if (ip) {
            //     // 检测ip可用
            // }
            // await this.add(valida);
            // console.log("代理ip读取成功",proxyurl);
            // return proxyurl;
            return proxyurl

        } catch (err) {
            throw err
        }

    }

    /**
     *  读取可用的ip库
     * @param {Array} data - ip数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async getValidIps(oriProxy) {
        try {



            // let cache = await $cache.get(IpCachkey);
            // if(!cache)
            // {
            //     cache = await this.dataModels.proxyip.findAll();
            //     await $cache.set(IpCachkey,cache,60* 5);
            // }
            // for(let ip of cache)
            // {
            //     let type = ip.type?ip.type:"http";
            //     let url = `${type}://${ip.ip}:${ip.port}`
            //     let check = await utils.checkValidProxyIp(url);
            //     if (!check) {
            //         continue;
            //     }
            //     return url;
            // }
            // return null;
            var proxy = null;
            let url = "http://ip.16yun.cn:817/myip/pl/daa02231-a016-4556-909b-1f0f780ecfca/?s=yrmqixfxzr&u=rajan&format=json";
            let ipdata = await utils.httpGet({
                url: url
            });
            let json = JSON.parse(ipdata.toString());
            let data = null;
            var canSave = false;
            if (!json.status) {
                // 读取缓存 
                data = await $cache.get(IpCachkey);
                if (!data) {
                    data = await this.getIps();
                    console.log("未采集到IP数据，从库中读取");
                }
            } else {
                //console.log(typeof json.proxy,json);
                data = json.proxy;
                canSave = true; // 采集到的数据才入库
                console.log("已采集到IP数据");
            }

            if (data.length > 0) {
                let save = [];
                if (canSave) {
                    await $cache.set(IpCachkey, data, 60)
                    for (let ip of data) {
                        let type = ip.type ? ip.type : "http"
                        save.push({
                            ip: ip.ip,
                            port: ip.port,
                            type: type
                        })
                    }
                    await this.adds(save);
                }

                for (let ip of data) {
                    let type = ip.type ? ip.type : "http"
                    let proxyTmp = `${type}://${ip.ip}:${ip.port}`

                    //let type = ip.type ? ip.type : "http";
                    let check = await utils.checkValidProxyIp(proxyTmp);
                    if (!check) {
                        continue
                    } else {
                        if (!oriProxy) {
                            proxy = proxyTmp;
                            break;
                        }
                        else if(oriProxy  !=  proxyTmp)
                        {
                            proxy = proxyTmp;
                            break;
                        }
                    }
                }
                console.log("读取有效ip为，",proxy);
                return proxy
            } else {
                throw new Error("ProxyIp.model.getValidIps, 没有可用ip");
            }

            //console.log("读取ip三生三世",json);
            //return data.toString();
            return proxy;

        } catch (err) {
            throw err;
        }
    }



}
module.exports = (option) => {
    return new c(option)
};