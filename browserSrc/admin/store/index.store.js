import vue from "vue"
import vuex from "vuex"
vue.use(vuex);

export default new vuex.Store({
  state: {
    $msg: new Map(),
    version: "1.0",
    commonApiModel: null,
    $cache: new Map(), //缓存对象
    $cacheLock: new Map(), //缓存锁，防止缓存被二次覆盖
  },
  getters: {

    getVersion(state) {
      return state.version;
    },
    commonApiModel(state) {
      return state.commonApiModel;
    },
    getCache: state => (key) => {
      if (!key) return null;
      return state.$cache.get(key);
    }
  },
  mutations: {

    setCommonApiModel(state) {
      return state.commonApiModel;
    },
    // 存储对象的仓库
    setCache(state, cache) {
      if (Array.isArray(cache)) {
        //console.log("set cache array");
        if (!cache[0]) {
          throw new Error("键值不能为空");
        }
        else if (cache[0] && !cache[1])
        {
          return state.$cache.delete(cache[0])
        }
        state.$cache.set(cache[0], cache[1])
        return;
      }
      var islock = false;
      var lockPass = null;
      if (cache.$lock) {
        islock = true;
        lockPass = cache["$lock"]
      }
      for (let key in cache) {

        if (key == "$lock") {
          continue;
        }
        //检测当前的对象是否已经被锁
        if (state.$cacheLock.get(key)) {
          if (!cache.$lock) {
            throw new Error(`${key}已经被锁，请传入解锁密码`);
          } else {
            if (cache.$lock != state.$cacheLock.get(key)) {
              throw new Error(`${key}解锁密码不对`);
            }
          }
        }

        if (islock) {
          state.$cacheLock.set(key, lockPass)
          //console.log("is locked",key);
        }
        state.$cache.set(key, cache[key])
      }
    },
    
    // 清除缓存仓库
    clearCache(state) {
      state.$cache.clear();
    },

    subscribe(state, option) {

      for (let key in option) {
        let funcList = state.$msg.get(key); // 触发函数队列
        if (!funcList) {
          funcList = [];
        }
        if (option[key] && (typeof (option[key]) == 'function')) {
          funcList.push(option[key]);
          state.$msg.set(key, funcList);
        }
      }
      //console.log("订阅的函数列表",state.$msg);
    },
    unSubscribe(state, option) {

      for (let key in option) {
        
      state.$msg.delete(key); // 触发函数队列
       
      }
      //console.log("订阅的函数列表",state.$msg);
    },
    publish(state, msg) {
      for (let key in msg) {
        let func = state.$msg.get(key);
        //console.log("func is ",func);
        if (func) {
          for (let i in func) {
            if (func[i] && (typeof (func[i]) == 'function')) {
              func[i](msg[key]);
            }
          }
        }
      }
    },
  },
  modules: {
    //chat
  }
})
