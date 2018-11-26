const fs = require("fs");
const path = require("path");
const utils = require("../lib/utils");
const cheerio = require('cheerio');
const sa = require("superagent");
const baseModel = require("./base.model");
class c  extends baseModel{

	constructor(){
		super();
	}
	//  检测有效ip
	async checkValidProxyIp(url) {
		console.log('验证Ip有效性:')
		try {
			try {
				let res = await this.httpGet({
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
				$logger.error(JSON.stringify({
					err: err,
					msg: msg
				}));
				return false;
			}

		} catch (err) {
			throw err;
		}
	}


	async httpGet(data) {
		let url = data.url;
		if (!data.headers) {
			data.headers = {};
		}
		var opt = {
			uri: url,
			headers: {
				"Host": data.headers.host ? data.headers.host : "",
				"Origin": data.headers.origin ? data.headers.origin : "",
				"Referer": data.headers.referer ? data.headers.referer : "",
				//"User-Agent": data.headers.ua ? data.headers.ua : this.getUa(),
				//"X-Requested-With": "XMLHttpRequest",
			},
			form: data.formData
		}
		if (data.proxy) {
			opt.proxy = data.proxy;
		}
		return new Promise((resolve, reject) => {
			try {
				let req = null;
				if(opt.formData)
				{
					req = sa.get(opt.uri).query(opt.formData)
				}
				else
				{
					req = sa.get(opt.uri)
				}
				// 设置headers
				for (let key in opt.headers) {
					req.set(key, opt.headers[key])
				}
				req.end((err, res) => {
					if (err) {
						return reject(err);
					}
					if (res.statusCode == 200) {
						let body = res.text;
						return resolve({body:body,res:res});
					} else {
						return reject(res)
					}

				})
			} catch (err) {
				reject(err)
			}

		})
	}

	async httpPost(data) {
		let url = data.url;
		if (!data.headers) {
			data.headers = {};
		}
		var opt = {
			uri: url,
			headers: {
				"Host": data.headers.host ? data.headers.host : "",
				"Origin": data.headers.origin ? data.headers.origin : "",
				"Referer": data.headers.referer ? data.headers.referer : "",
				"User-Agent": data.headers.ua ? data.headers.ua : this.getUa(),
				"Cookie":data.headers.cookie ? data.headers.cookie : "",
				//"X-Requested-With": "XMLHttpRequest",
			},
			form: data.formData
		}
		if (data.proxy) {
			opt.proxy = data.proxy;
		}

		//console.log(opt,"opt");
		return new Promise((resolve, reject) => {
			try {
				let req = sa.post(opt.uri).send(opt.formData);
				// 设置headers
				for (let key in opt.headers) {
					
					if(opt.headers[key]){
						console.log(key,opt.headers[key]);
						req.set(key, opt.headers[key])
					}
				}
				req.end((err, res) => {
					if (err) {
						return reject(err);
					}
					if (res.statusCode == 200) {
						//console.log(res,"header");
						let body = res.body;
						if (body) {
							body = body.toString();
						}
						return resolve({body:body,res:res});
					} else {
						return reject(res)
					}

				})
			} catch (err) {
				reject(err)
			}

		})
	}

	getDom(text) {
		try {
			if (!text) {
				throw new Error("text is mepty in getDom");
			}
			return cheerio.load(text);
		} catch (err) {
			throw err
		}
	}

	getUa() {
		if (ua.length == 0) {
			return null;
		}
		let index = utils.randomNum(0, ua.length - 1);
		return ua[index];
	}

}
const ua = [
	"Mozilla/5.0",
	"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 1.0.3705; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36",
	"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 GTB6 (.NET CLR 3.5.30729)",
	"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
	"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0",
	"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ",
	"Chrome/37.0.2062.120 Safari/537.36",
	"Chrome/40.0.2214.115 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) ",
	"Chrome/36.0.1985.125 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) ",
	"Chrome/44.0.2403.125 Safari/537.36",
	"Mozilla/5.0 (Windows NT 5.1; rv:44.0) Gecko/20100101 Firefox/44.0",
	"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) ",
	"Chrome/49.0.2623.87 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/537.4",
	"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.813.0 Safari/535.1",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) "
]

module.exports = c;