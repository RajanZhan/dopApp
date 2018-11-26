const fs = require("fs");
const path = require("path");
const utils = require("../lib/utils");
const base = require("./base.spider.model");
const logger = require("../lib/logger");
class c extends base {

	// 综合 信息采集
	async zonghe() {
		try {

			// let request1 = {
			// 	url: "http://med.sina.com",
			// 	headers: {
			// 		host: "med.sina.com",
			// 		origin: "http://med.sina.com",
			// 		referer: "http://med.sina.com/",
			// 	},
			// }

			// let res = await this.httpGet(request1);
			// let page1 = res.body;
			// let dom = this.getDom(page1);

			// console.log("page1", dom(".clickmore").attr("sign"));

			// 读取前4页的数据
			var baseurl = "http://med.sina.com"
			var nextPage = "";
			var total = "";
			var totalArticleList = [];
			for (let i = 0; i < 1; i++) {

				let url = "";
				if (total) {
					url = `${baseurl}/article_list_-1_1_${i}_${total}.html`
				} else {
					url = baseurl;
				}

				let request1 = {
					url: url,
					headers: {
						host: "med.sina.com",
						origin: "http://med.sina.com",
						referer: "http://med.sina.com/",
					},
				}

				let res = await this.httpGet(request1);
				let page1 = res.body;
				let dom = this.getDom(page1);
				nextPage = dom(".clickmore").attr("sign")
				if (nextPage) {
					total = nextPage.split("_")[3];
				}

				// 读取文章列表
				let articlelist = dom(".indextitle-text a");
				//console.log(articlelist);
				for (let j in articlelist) {

					if (articlelist[j] && articlelist[j].attribs && articlelist[j].children && articlelist[j].children[0]) {
						totalArticleList.push({
							url: articlelist[j].attribs.href,
							title: articlelist[j].children[0].data
						})
						//console.log("page", articlelist[j].attribs);
					}
					//console.log("page",pagelist[j].find(".indextext-title").text() );
				}

				console.log(`请求url  ${url},${total}`);
				await utils.sleep(5 * 1000);
			}

			console.log("采集的总文章数 ：", totalArticleList.length);


			// 读取 文章的内容，并且入库
			for (let a of totalArticleList) {
				if (!a.url) {
					continue;
				}
				let httpreq = {
					url: a.url,
					headers: {
						host: "med.sina.com",
						origin: "http://med.sina.com",
						referer: "http://med.sina.com/",
					},
				}
				//console.log(a);
				var filename = utils.md5(a.url);
				let filePath = path.join(__dirname, "../static/med.content/" + filename + ".txt");
				if (fs.existsSync(filePath)) {
					console.log("文章已经存在@@");
					continue;
				}
				let content = await this.httpGet(httpreq);
				if (content.body) {
					let body = this.getDom(content.body);
					let cxt = body(".textbox").html();
					let author = body(".wz-zuthorname a").text();
					let publishTime = body(".wz-fbtime").text();
					fs.writeFileSync(filePath, cxt)
					await this.zongheSave({
						title: a.title,
						rsc: "新浪医疗",
						typeId: 1,
						author: author,
						url: a.url,
						publishTime: publishTime,
						spiderTime: new Date(),
						content: `static/med.content/${filename}.txt`

					});

				}
				console.log("内容读取休眠...");

				await utils.sleep(2000);
			}

			//let saveres = await this.zongheSave(saveData);


			// for (let i in listDom(".title")) {
			// 	if (listDom(".title")[i].children && listDom(".title")[i].children[0] && listDom(".title")[i].children[0].type == "text") {
			// 		console.log(listDom(".title")[i].children[0].data, )
			// 		console.log("@@@@@@@@@@@@@@@@@@@  p1 ")
			// 	}

			// }

			// let request2 = {
			// 	url: "http://med.sina.cn/index.action?m=list",
			// 	headers: {
			// 		host: "med.sina.cn",
			// 		origin: "http://med.sina.cn",
			// 		referer: "http://med.sina.cn/",
			// 		cookie:'vt=4; genTime=1532430400; ustat=__183.225.3.40_1532430400_0.21684000; SINAGLOBAL=8142771342687.143.1540471639263; ULV=1540471639267:1:1:1:8142771342687.143.1540471639263:; historyRecord={"href":"https://sina.cn/","refer":""}; dfz_loc=yn-default; SINAVID=4500c8150c0c1000; route=11835cc86ebadfb8e2e35e8cc45cd820; Hm_lvt_684c66782ce3b5c1b8f3726bf510ad79=1540462207,1540525592; JSESSIONID=4336825BDA2770D80CE86D7A7C371383-n1.wap_2; Hm_lpvt_684c66782ce3b5c1b8f3726bf510ad79=1540541540',
			// 	},
			// 	formData: {
			// 		currentPage: 3,
			// 		totalPage: 2856,
			// 	},
			// }

			//  res = await this.httpPost(request2);
			//  pageList1 = JSON.parse(res.body);
			// if (pageList1.succ != "1") {
			// 	return false;
			// }
			// //let cookie = res.res.header["set-cookie"];
			//  listDom = this.getDom(pageList1.data);
			// for (let i in listDom(".title")) {
			// 	if (listDom(".title")[i].children && listDom(".title")[i].children[0].type == "text") {
			// 		console.log(listDom(".title")[i].children[0].data, )
			// 		console.log("@@@@@@@@@@@@@@@@@@@  p2 ")
			// 	}

			// }

			// console.log("cookie ",);


			// listDom(".title").each((item)=>{
			// 	console.log(item);
			// })

			//console.log("读取到第一页的数据", listDom(".title"));

			// let reqGet = {
			// 	url: "http://med.sina.cn/article_detail_109_2_54854.html",
			// 	headers: {
			// 		host: "med.sina.cn",
			// 		origin: "http://med.sina.cn",
			// 		referer: "http://med.sina.cn/",
			// 	},
			// }
			// let article = await this.httpGet(reqGet);
			// if(article)
			// {
			// 	let dom = this.getDom(article);
			// 	if(!dom)
			// 	{
			// 		throw new Error("dom is empty");
			// 	}
			// 	let title =  dom(".wz-titletext").text();
			// 	let publishTime = dom(".wz-fbtime").text();
			// 	if(publishTime)
			// 	{
			// 		publishTime = utils.dateFormate(publishTime,"yyyy-MM-dd hh:mm:ss");
			// 	}
			// 	console.log(new Date(publishTime).getFullYear());
			// 	let content = dom(".wz-textbox").html();
			// 	console.log("title is ",publishTime);
			// }
			//console.log("采集的结果是", res);
			console.log("采集结束");

		} catch (err) {
			console.log("综合蜘蛛采集异常", err);
			//throw err;
			logger.error(JSON.stringify({
				err: err,
				remark: "mdcSpider.model.zonghe"
			}))
		}
	}

	// 保存综合文章
	async zongheSaves(datas) {
		try {

			let savedata = [];
			// 检测文章是否存在
			for (let d of datas) {
				let exist = await this.dataModels.medArticle.findOne({
					where: {
						url: d.url
					}
				})
				if (exist) {
					continue;
				}
				savedata.push(d);
			}
			console.log("文章数据增加了", savedata.length);
			return await this.dataModels.medArticle.bulkCreate(savedata)
		} catch (err) {
			throw err;
		}
	}

	// 保存综合文章
	async zongheSave(data) {
		try {

			let exist = await this.dataModels.medArticle.findOne({
				where: {
					url: data.url
				}
			})
			if (exist) {
				return console.log("文章已经存在", data.title);
			}
			return await this.dataModels.medArticle.create(data)
		} catch (err) {
			throw err;
		}
	}

	// 母婴采集
	async muyingSpider() {
		try {
			let req = {
				//url:"http://feed.mix.sina.com.cn/api/roll/get?",
				url:"http://feed.mix.sina.com.cn/api/roll/get?pageid=380&lid=2473&num=30&versionNumber=1.2.8&page=1&encode=utf-8&callback=feedCardJsonpCallback",
				headers:{
					//host:"baby.sina.com.cn",
					
				},
				// formData:{
				// 	pageid:380,
				// 	lid:2473,
				// 	num:30,
				// 	versionNumber:"1.2.8",
				// 	page:1,
				// 	encode:"utf-8",
				// 	callback:"feedCardJsonpCallback"
				// }
			}
			let res = await this.httpGet(req);
			let str = res.body.substring(res.body.indeOf("Callback("),res.body.indeOf("}]}});}catch(e){}"))
			console.log(str);
			//fs.writeFileSync(path.join(__dirname,"../test.html"),res.body);
			//let dom = this.getDom(res.body);
			//console.log(dom("#feedCardContent").find(".feed-card-item h2 a").children,"dom");
		} catch (err) {
			throw err
		}
	}

}
module.exports = () => {
	return new c();
}