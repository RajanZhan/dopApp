var webpcak = require('webpack');
const fs = require("fs");
const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function(x) {
	return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

nodeModules["sequelize"] = "commonjs sequelize";
nodeModules["redis"] = "commonjs redis";
nodeModules["webpack"] = "commonjs webpack";
nodeModules["html-webpack-plugin"] = "commonjs html-webpack-plugin";
nodeModules["webpack-hot-middleware"] = "commonjs webpack-hot-middleware";
nodeModules["webpack-dev-middleware"] = "commonjs webpack-dev-middleware";
nodeModules["ali-oss"] = "commonjs ali-oss";
nodeModules["art-template"] = "commonjs art-template";
nodeModules["think-wx"] = "commonjs think-wx";


let ignoreMudles = {
    "ali-oss": "^5.2.0",
    "art-template": "^3.0.3",
    "body-parser": "^1.18.2",
    "cookie-parser": "^1.4.3",
    "ejs": "^2.5.9",
    "express": "^4.16.3",
    "jsonminify": "^0.4.1",
    "log4js": "^2.7.0",
    "moment": "^2.22.1",
    "mysql": "^2.15.0",
    "mysql2": "^1.5.3",
    "redis": "^2.8.0",
    "sequelize": "^4.37.6",
    "svg-captcha": "^1.3.11",
    "ueditor": "^1.2.3",
    "uuid": "^3.2.1",
    "vant": "^1.1.7",
    "cheerio": "^1.0.0-rc.2",
    "iconv-lite": "^0.4.24",
    "jsonminify": "^0.4.1",
    "mysql": "^2.15.0",
    "mysql2": "^1.5.3",
    "node-watch": "^0.5.8",
    "request": "^2.88.0",
    "sequelize": "^4.39.1",
    "sequelize-values": "^1.1.0",
    "supervisor": "^0.12.0",
    "vue-resource": "^1.5.1"
  }
  for(let i in ignoreMudles)
  {
	nodeModules[i] = "commonjs "+ i;
  }
//var srcConfig = JSON.parse(fs.readFileSync("../config.json").toString());
// if(srcConfig.debug == 1){
//     //throw "无法编译发布版代码，请先将config.json中的debug置为 0";
// }

module.exports = {
    entry: [
        './index.spider.js'
    ],
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'index.spider.build.js'
    },
	target: 'node',
    externals: nodeModules,
	context: __dirname,
	node: {
		__filename: false,
		__dirname: false
	},
	plugins:[
		new UglifyJSPlugin()
	]
}