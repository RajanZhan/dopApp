/*此插件作为vue 统一api服务实例化的插件,只要服务的接口遵循统一规范，即 get set,del,方法，则可以通过本插件快速实例化*/
var $http = null;
class api {
    constructor(_this,path) {
        if (!path) {
            console.log("无法实例化api对象,因为path服务路劲为空");
            return null;
        }
        this.$http = _this.$http
        this.path = path;
    }

    async get(opt) { 
        
        return await this.$http.get(this.path + "/get", {params:opt});
    }

    async set(opt) {
        //console.log("http is ",$http)
        return await this.$http.post(this.path + "/set", {
            params: opt
        });
    }

    async del(opt) {
        return await this.$http.post(this.path + "/del", {params:opt});
    }
    
}


export default {
    install(Vue, option) {
        //console.log("http is ",Vue.prototype.$http)
        Vue.prototype.$api = api;
    }
}