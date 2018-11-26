
//ueditor 图片上传插件欧
const ueditor = require("ueditor"); 
const ueLib = require("../lib/ueditor.js");
const postXml = require("../middleware/postXml");
const getRealIp = require("../middleware/getRealIp.middle");
const post = require("../middleware/post.middle");
const path = require("path");

module.exports = (app)=>{

    app.use("/ueditor/ue", ueditor(path.join(__dirname, 'static'), ueLib)); 
    app.use(postXml.middleware); 
    app.use(getRealIp);
    app.use(post);
}