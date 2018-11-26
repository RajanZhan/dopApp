import Vue from "vue"
import vuex from "vuex"
Vue.use(vuex);

import menu from "./modules/menu"
import auth from "./modules/auth"


export default new vuex.Store({
    state: {
        $msg: new Map(),
        $cache:new Map(),
        $cacheLock:new Map(),//缓存锁，防止缓存被二次覆盖
        cachePages: "article,column",
    },
    getters: {
        subscribe: (state) => (option) => {
            return state.$msg;
        },

        getCachePages(state) {
            return state.cachePages;
        },
        getCache:state=>(key)=>{
            if(!key) return null;
            return state.$cache.get(key);
        }

    },
    mutations: {

        subscribe(state, option) {

            for (let key in option) {
                let funcList = state.$msg.get(key); // 触发函数队列
                if (!funcList) {
                    funcList = [];
                }
                funcList.push(option[key]);
                state.$msg.set(key, funcList);
            }
            //console.log("订阅的函数列表",state.$msg);
        },
        publish(state, msg) {
            for (let key in msg) {
                let func = state.$msg.get(key);
                if (func) {
                    for (let i in func) {
                        if (func[i]) {
                            func[i](msg[key]);
                        }
                    }
                }
            }
        },

        // 存储对象的仓库
        setCache(state,cache){
            var islock = false;
            var lockPass  = null;
            if(cache.$lock){
                islock = true;
                lockPass = cache["$lock"]
            }
            for(let key in cache){

                if(key == "$lock"){
                    continue;
                }
                //检测当前的对象是否已经被锁
                if(state.$cacheLock.get(key)){
                    if(!cache.$lock)
                    {
                        throw `${key}已经被锁，请传入解锁密码`;
                    }
                    else
                    {
                        if(cache.$lock != state.$cacheLock.get(key)){
                            throw `${key}解锁密码不对`;
                        }
                    }
                }
                
                if(islock)
                {
                    state.$cacheLock.set(key,lockPass)
                    //console.log("is locked",key);
                }
                state.$cache.set(key,cache[key])
            }
        },

        setUserMenu(state, userMenu) {
            state.userMenu = userMenu;
            if (typeof (sessionStorage) != "undefined") {
                let menuArr = [];
                for (let m of userMenu) {
                    menuArr.push(m);
                }
                sessionStorage.setItem("userMenu", JSON.stringify(menuArr));
            }
        },

    },
    modules: {
        menu,
        auth
    },
    actions: {

    },

})