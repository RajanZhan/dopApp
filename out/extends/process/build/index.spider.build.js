!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.i=function(e){return e},r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=26)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("sequelize")},function(e,t,r){const n=r(1);r(25)(n);var o=null,i=[];i.push(r(8)),i.push(r(7)),e.exports=async function(){try{if(o)return o;var e=$config.db;if(!e||!e.db||!e.uname)throw new Error("数据库尚未初始化");o=new n(e.db,e.uname,e.pwd,{host:e.host,dialect:"mysql",timezone:"+08:00",freezeTableName:!1,logging:!1,pool:{max:5,min:0,idle:3e4}});for(let e of i)o.define(e.name,e.body,{timestamps:!1,underscored:!0,freezeTableName:!0,tableName:e.tableName});return await o.sync({force:!1}),console.log("init db",(new Date).getTime()),t=o,async function(e){}(),t}catch(e){throw"初始化数据库失败"+e}var t}},function(e,t,r){e.exports=class{constructor(){this.dbInit()}async dbInit(){const e=await r(2)();this.db=e,this.dataModels=e.models}}},function(e,t){e.exports=require("crypto")},function(e,t,r){const n=r(20),o=r(0);global.$taskConfig=JSON.parse(n(o.readFileSync("config.json").toString())),1==$taskConfig.debug?global.$config=JSON.parse(n(o.readFileSync("../../config.json").toString())):global.$config=JSON.parse(n(o.readFileSync("./config.json").toString())),global.$common=r(6),global.$cache=r(10)();const i=r(9)();global.$logger=r(11),async function(){try{i.cgSpideer()}catch(e){console.log("程序异常",e)}}()},function(e,t,r){const n=r(17);r(0);e.exports={_error(e){throw`common.lib error: ${e}`},writeLog(e){e&&logModel.create({content:JSON.stringify(e),type:1})},getPageForSql(e,t){return e&&t||this._error("getPageForSql，page 或者psize 不能为空"),e=parseInt(e),--e<0&&(e=1),{limit:parseInt(t),offset:parseInt(e)*parseInt(t)}},getRandomString:()=>n(),formateDate:(e,t)=>n(),isArray:e=>"[object Array]"==Object.prototype.toString.call(e),isAdminLogin:async e=>!!await $req.session("admin")||(e&&e.deny("管理员尚未登录"),!1),dateFormate:(e,t)=>(Date.prototype.Format=function(e){var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var r in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),t)new RegExp("("+r+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?t[r]:("00"+t[r]).substr((""+t[r]).length)));return e},e?new Date(e).Format(t):(new Date).Format(t)),sleep:e=>new Promise(t=>{setTimeout(()=>{t()},e)}),arrMerge(e){let t=[];for(let r of e)for(let e of r)t.push(e);return t},md5(e){const t=r(4).createHash("md5");return t.update(e),t.digest("hex")}}},function(e,t,r){const n=r(1);e.exports={name:"proxyip",tableName:"proxyip",body:{id:{type:n.INTEGER,primaryKey:!0,autoIncrement:!0},ip:n.STRING(128),port:n.STRING(512),type:n.STRING(128),city:n.STRING(128),province:n.STRING(128),country:n.STRING(128),isp:n.STRING(128),anonymity:n.STRING(128),connectTimeMs:n.INTEGER}}},function(e,t,r){const n=r(1);e.exports={name:"spiderArticle",tableName:"spider_article",body:{id:{type:n.INTEGER,primaryKey:!0,autoIncrement:!0},title:n.STRING(512),resource:n.STRING(512),intro:n.TEXT,url:n.TEXT,content:n.TEXT("long"),area:n.STRING(128),class:n.STRING(128),atime:n.DATE,catchTime:n.DATE}}},function(e,t,r){const n=r(14)(),o=r(18),i=r(13)(),a=r(24),s=r(19),c=r(0);var l=0,u=(new Map,19);async function p(e){return new Promise((t,r)=>{try{a({url:e,encoding:null},function(e,n,o){if(e)return r(e);if(!e&&200==n.statusCode){let e=s.decode(o,"gb2312");t(e)}}).on("error",function(e){r(e)})}catch(e){r(e)}})}async function d(e){let t=e.url;var r=!1;if(e.useProxy){(await function(e){var t="";if(!e)throw new Error("读取代理ip data 为空");e.url?t=e.url:e.key&&e.type&&"normal"==e.type&&(t=`http://api.ip.data5u.com/dynamic/get.html?order=${e.key}&sep=3`);return new Promise((e,r)=>{var n={method:"GET",url:t,gzip:!0,encoding:null,headers:{}};a(n,function(t,n,o){try{if(t)throw t;let n=JSON.parse(o.toString());i.add(n.data),e(n)}catch(e){return r(e)}})})}({url:"http://api.ip.data5u.com/api/get.shtml?order=318a742f5f30a0bea3134d9d5bc28f40&num=100&carrier=0&protocol=0&an1=1&an2=2&an3=3&sp1=1&sp2=2&sp3=3&sort=1&system=1&distinct=0&rettype=0&seprator=%0D%0A"})).data;r=" http://104.248.223.5:8080"}var n={url:t,encoding:null,headers:{"content-type":"*/*","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,zh;q=0.8",Connection:"keep-alive","Content-Length":"151","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",Cookie:"yunsuo_session_verify=85b586114d427177d4b13e7688644fa9; JSESSIONID=pLZybHqVlz5Q9g9sTWTlQwQk6pWBcP77W34blV8cdd0GSQS23Bxl!519234059; xincaigou=49737.2929.22.0000",Host:"www.yngp.com",Origin:"http://www.yngp.com",Referer:"http://www.yngp.com/bulletin.do?method=moreList&menuSelect=nav2","User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4094.1 Safari/537.36","X-Requested-With":"XMLHttpRequest"},form:{current:e.page?e.page:1,rowCount:e.psize?e.psize:100,searchPhrase:"",query_bulletintitle:"",query_startTime:"2000-01-01",query_endTime:"2018-10-18",query_sign:1,query_codeName:"",query_gglxdm:"bxlx005"}};return r&&(n.proxy=r),new Promise((e,t)=>{try{a.post(n,function(r,n,o){try{if(r||200!=n.statusCode)t(r);else{let t=s.decode(o,"gb2312");e(JSON.parse(t))}}catch(e){t(e)}}).on("error",function(e){t(e)})}catch(e){t(e)}})}e.exports=(e=>new class{constructor(e){this.option=e}async cgSpideer(){try{await $common.sleep(3e3),console.log("start @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");var e=async function(){let e=await n.getAllTitle();for(let t of e)await $cache.set("title_cache"+t.title,1);console.log("初始化title 缓存")};await e();var t="http://www.yngp.com/bulletin.do?method=moreListQuery";let a=await d({url:t,useProxy:!1,page:1,psize:10});var r=[];let s=Number(a.totlePageCount),g=a.total,f=await $cache.get("spider-page"),h=f?Number(f):Number(u),y=0;for(;h<=s;){if(console.log("采集页数++++++++++++++++++++++++++++++",h),(a=await d({url:t,page:h,psize:100})).rows.length>0){var i=await $cache.get(`page_${h}_index`)?Number(await $cache.get(`page_${h}_index`)):0;for(console.log(`第${h}页从下标为${i}开始读取`);i<a.rows.length;i++){let t=a.rows[i];if(await $cache.set(`page_${h}_index`,i),t){if(await $cache.get("title_cache"+t.bulletintitle)){console.log(`第${l+1}次采集，检测到重复数据，无需入库，`,t.bulletintitle.slice(0,60));continue}let i=`http://www.yngp.com/newbulletin_zz.do?method=preinsertgomodify&operator_state=1&flag=view&bulletin_id=${t.bulletin_id}`,a=await p(i);console.log("读取内容休眠"),await $common.sleep(1200);let s=o.load(a)("#searchPanel").html(),u="./articleContent/"+t.bulletin_id+".txt";c.writeFileSync(u,s);let d={title:t.bulletintitle,area:t.codeName,atime:t.finishday,intro:"",class:t.bulletinclass,catchTime:new Date,resource:"中国政府采购网云南分网",content:u,url:i};r.push(d),console.log("该条数据可以入库"),r.length>=40&&await n.setArticles(r)&&(console.log(`第${l+1}次采集，插入${r.length}条，`),r=[],await e())}}await $cache.delete(`page_${h}_index`)}h++,await $cache.set("spider-page",h),await $common.sleep(5e3)}let m=(new Date).getTime(),w=`第${++l}次采集，采集完成时间：${$common.dateFormate(new Date,"yyyy-MM-dd hh:mm:ss")}，\n            耗时：${((m-starttime)/6e4).toFixed(0)}分钟，共采集${g}条，入库${y}条，`;console.log(w),$logger.createLogger(__dirname+"cgCache.log").info(w)}catch(e){console.log("采购网读取数据发生异常",e),$cache.get(`page_${h}_index`).then(t=>{$logger.error({err:e,currentPage:h,index:t})}),this.cgSpideer()}}}(e))},function(e,t,r){const n=r(12)();e.exports=(()=>{if(1!=$config.redis.use)throw"无法启用缓存，请先开启redis功能";if(!n)throw"redis 实例获取失败";return{async get(e){try{let t=await n.getSync(e);return JSON.parse(t)}catch(e){throw e}},async set(e,t,r){try{return e&&t?(t=JSON.stringify(t),r?await n.setexSync(e,r,t):await n.setSync(e,t)):null}catch(e){throw e}},async expire(e,t){try{return e&&t?await n.expire(e,t):null}catch(e){throw e}},async delete(e){try{return e?await n.deleteSync(e):null}catch(e){throw e}}}})},function(e,t,r){const n=r(21);r(22);n.configure({appenders:{everything:{type:"dateFile",filename:process.cwd()+"/logs/all-the-logs.log",maxLogSize:1048576,backups:3,compress:!0}},categories:{default:{appenders:["everything"],level:"debug"}}});const o=n.getLogger("log4jslog");e.exports={error:e=>{o.error(e)},trace:e=>{o.trace(e)},info:e=>{o.info(e)},trace:e=>{o.trace(e)},debug:e=>{o.debug(e)},warn:e=>{o.warn(e)},fatal:e=>{o.fatal(e)}}},function(e,t,r){const n=r(23);var o=null;e.exports=(()=>{var e=$config.redis;if(!e||1!=e.use)return null;if(!e||!e.host||!e.port)throw"redis 配置信息为空，无法配置";if(o)return o;let t=n.createClient(e.port,e.host,{auth_pass:e.pass});return t.on("ready",e=>{console.log("redis cache init ok ")}),t.keysSync=(e=>(e||(e="*"),new Promise((r,n)=>{t.keys(e,(e,t)=>{e&&n(e),r(t)})}))),t.expireSync=((e,r)=>new Promise((n,o)=>{e||o("redis.js expireSync errir:key can not be empty "),t.expire(e,r,(e,t)=>{e&&o(e),n(t)})})),t.getSync=(e=>new Promise((r,n)=>{t.get(e,(e,t)=>{e?n({position:"cache.get",err:e}):r(JSON.parse(t))})})),t.setexSync=((e,r,n)=>new Promise((o,i)=>{n=JSON.stringify(n),t.setex(e,r,n,(e,t)=>{e?i({position:"redis.setexSync",err:e}):o(t)})})),t.setSync=((e,r)=>new Promise((n,o)=>{r=JSON.stringify(r),t.set(e,r,(e,t)=>{e?o({position:"redis.setSync",err:e}):n(t)})})),t.deleteSync=(e=>new Promise((r,n)=>{e?t.del(e,(e,t)=>{e?n({position:"redis.deleteSync",err:e}):r(JSON.stringify(t))}):n({position:"redis.deleteSync",err:"key can not be empty"})})),o=t})},function(e,t,r){const n=r(3);e.exports=(e=>new class extends n{constructor(e){super(),this.option=e}async add(e){try{for(let t of e)await this.checkIp(t.ip,t.port)||await this.dataModels.proxyip.create(t);return!0}catch(e){throw e}}async checkIp(e,t){try{return await this.dataModels.proxyip.findOne({where:{ip:e,port:t}})}catch(e){throw e}}}(e))},function(e,t,r){const n=r(3);r(2)();e.exports=(e=>new class extends n{constructor(){super()}async getAllTitle(){try{return await this.dataModels.spiderArticle.findAll({attr:["title"]})}catch(e){throw e}}async setArticle(e){try{return await this.dataModels.spiderArticle.create(e)}catch(e){throw e}}async setArticles(e){try{return await this.dataModels.spiderArticle.bulkCreate(e)}catch(e){throw e}}async getArticleByTitle(e){try{return await this.dataModels.spiderArticle.findOne({where:{title:e}})}catch(e){throw e}}}(e))},function(e,t){for(var r=[],n=0;n<256;++n)r[n]=(n+256).toString(16).substr(1);e.exports=function(e,t){var n=t||0,o=r;return o[e[n++]]+o[e[n++]]+o[e[n++]]+o[e[n++]]+"-"+o[e[n++]]+o[e[n++]]+"-"+o[e[n++]]+o[e[n++]]+"-"+o[e[n++]]+o[e[n++]]+"-"+o[e[n++]]+o[e[n++]]+o[e[n++]]+o[e[n++]]+o[e[n++]]+o[e[n++]]}},function(e,t,r){var n=r(4);e.exports=function(){return n.randomBytes(16)}},function(e,t,r){var n,o,i=r(16),a=r(15),s=0,c=0;e.exports=function(e,t,r){var l=t&&r||0,u=t||[],p=(e=e||{}).node||n,d=void 0!==e.clockseq?e.clockseq:o;if(null==p||null==d){var g=i();null==p&&(p=n=[1|g[0],g[1],g[2],g[3],g[4],g[5]]),null==d&&(d=o=16383&(g[6]<<8|g[7]))}var f=void 0!==e.msecs?e.msecs:(new Date).getTime(),h=void 0!==e.nsecs?e.nsecs:c+1,y=f-s+(h-c)/1e4;if(y<0&&void 0===e.clockseq&&(d=d+1&16383),(y<0||f>s)&&void 0===e.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");s=f,c=h,o=d;var m=(1e4*(268435455&(f+=122192928e5))+h)%4294967296;u[l++]=m>>>24&255,u[l++]=m>>>16&255,u[l++]=m>>>8&255,u[l++]=255&m;var w=f/4294967296*1e4&268435455;u[l++]=w>>>8&255,u[l++]=255&w,u[l++]=w>>>24&15|16,u[l++]=w>>>16&255,u[l++]=d>>>8|128,u[l++]=255&d;for(var x=0;x<6;++x)u[l+x]=p[x];return t||a(u)}},function(e,t){e.exports=require("cheerio")},function(e,t){e.exports=require("iconv-lite")},function(e,t){e.exports=require("jsonminify")},function(e,t){e.exports=require("log4js")},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("redis")},function(e,t){e.exports=require("request")},function(e,t){e.exports=require("sequelize-values")},function(e,t,r){e.exports=r(5)}]);