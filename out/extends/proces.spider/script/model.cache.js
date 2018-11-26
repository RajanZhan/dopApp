/*****
 * 初始化model 缓存
 * ** */


module.exports = ()=>{

    global.$models = new Map();
    $models.set("mdcSpider.model",require("../model/mdcSpider.model")());


    console.log("model cache 初始化");
}