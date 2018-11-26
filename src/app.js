module.exports = async () => {
    const fs = require("fs");
    const jsonmini = require("jsonminify");
    const express = require('express');
    const app = express();
    const path = require("path");
    let sysConfig = JSON.parse(jsonmini(fs.readFileSync("./config.json").toString()));
    if (fs.existsSync(path.join(__dirname, "./app.config.json"))) {
        let appConfig = JSON.parse(jsonmini(fs.readFileSync("./app.config.json").toString()));
        for (let c in appConfig) {
            sysConfig[c] = appConfig[c];
        }
    }
    global.$config = sysConfig;
    const template = require('art-template');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const middleware = require("./common/middleWare");
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    const logger = require("./lib/logger");
    const error = require("./lib/error");
    const http = require("http");
    global.$tp = template;
    global.$logger = logger;
    global.$error = error;
    global.$common = require("./common/utils").default;
    global.$db = await require("./common/db")(); // 初始化数据库
    global.$cache = await require("./lib/cache")(); // 初始化缓存
    global.$validate = require("./lib/validate.core");
    global.$logic = require("./lib/validate.core.v1").default; // 新版本的逻辑验证
    global.$rootPath = __dirname; // 系统的根路径
    if ($config.cross == 1) {
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Access-Control-Allow-Methods", "GET,POST");
            next();
            //console.log("跨域处理hahah");
        });
    }
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
    }));
    const cookieKey = 'keyboard 11cat';
    app.use(cookieParser(cookieKey));
    // app.use(require("./lib/session"));
    if ($config.session) {
        //启动session
        app.use(require("./lib/session"));
        console.log("启用session");
    }
    // 挂载response扩展方法
    const responseExtends = require("./common/response");
    app.use((req, res, next) => {
        for (let key in responseExtends) {
            res[key] = responseExtends[key];
        }
        next();
    });
    template.config('base', '');
    template.config('extname', '.html');
    app.engine('html', template.__express);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, $config.viewPath));
    //挂载静态目录
    if ($config.staticPath.length > 0) {
        for (let p of $config.staticPath) {
            app.use("/static", express.static(p));
            app.use(express.static(p));
        }
    }
    //系统中间件
    app.use((req, res, next) => {
        // 将req请求对象挂载到全局
        global.$req = req;
        global.$res = res;
        //启用授权中间件
        require("./middleware/dopAuth.middle").default(req,res,next);
        //next();
    });
    middleware(app); // 调用自定义中间件
    // 挂载路由
    //router(app);
    require("./lib/controller.core")(app, require("./common/router"));
    //读取启动的配置文件
    if ($config.debug == 1) {
        var webpack = require("webpack");
        let browserProject = $config.browserProject;
        if (browserProject.length > 0) {
            console.log("web ui 项目启动", browserProject);
            for (let project of browserProject) {
                if (project.active == "1") {
                   // var webpackConfig = require(`./browserSrc/${project.name}/webpack.dev.config.js`);
                    var webpackConfig = require(`../browserSrc/${project.name}/webpack.dev.config.js`);
                    var compiler = webpack(webpackConfig);
                    var WebpackHotMid = require("webpack-hot-middleware");
                    var WebpackDevMid = require("webpack-dev-middleware");
                    var webpackHotMid = WebpackHotMid(compiler); //=>require("webpack-hot-middleware")(complier)
                    var webpackDevMid = WebpackDevMid(compiler, {
                        publicPath: '/',
                        stats: {
                            colors: true,
                            chunks: false
                        }
                    });
                    app.use(webpackDevMid);
                    app.use(webpackHotMid);
                    break;
                }
            }
        }
    }
    app.use("/404", (req, res, next) => {
        res.send("404 ");
    });
    // 启动调试的webpack
    //if ($config.debug == 1) {
    // var webpack = require("webpack");
    // var webpackConfig = require(`./compileTool/webpack.config.js`);
    // var compiler = webpack(webpackConfig);
    // //var WebpackHotMid = require("webpack-hot-middleware");
    // var WebpackDevMid = require("webpack-dev-middleware");
    // //var webpackHotMid = WebpackHotMid(compiler); //=>require("webpack-hot-middleware")(complier)
    // var webpackDevMid = WebpackDevMid(compiler, {
    //     publicPath: '/',
    //     stats: {
    //         colors: true,
    //         chunks: false
    //     }
    // });
    // app.use(webpackDevMid);
    //app.use(webpackHotMid);
    //}
    //console.log("hahaah ");
    //
    //app.use();
    var server = http.createServer(app).listen($config.port, $config.host);
    // var io = require('socket.io')(server);
    await require("./common/start")(app, server);
    //app.listen($config.port, $config.host);
    console.log(`app is running and listen port ${$config.port}, and server debug is ${$config.debug}`);
    return {
        server
    };
};