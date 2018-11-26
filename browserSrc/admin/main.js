// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import iView from 'iview';
//import './node_modules/iview/dist/styles/iview.css';
//import VueResource from 'vue-resource'
import store from "./store/index.store"
//import Cookies from "js-cookie";
import http from "./libs/http"
// import ElementUI from 'element-ui';
import api from "./extends/api.extends"
//import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(iView);
// Vue.use(ElementUI);
//Vue.use(VueResource)
Vue.config.productionTip = false
//Vue.prototype.host = "http://192.168.43.189:3000"
Vue.prototype.host = ""
Vue.prototype.$http = http;
// Vue.http.interceptors.push((request, next) => {  
//   　//console.log(this)//此处this为请求所在页面的Vue实例  
//     // modify request  
//     //request.method = 'POST';//在请求之前可以进行一些预处理和配置  
    
//     // continue to next interceptor  
//   　　next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法  
//           //console.log("请求拦截",request,response);
//           if(response.status == 401)// 服务端 调用res.deny 方法时表示登录信息失效
//           {
//             Cookies.set("login",0); // 清除登录认证
//             //console.log("clear login info ");
//             //store.commit({sysMsg:response});
//             router.push({
//               name:"login"
//             })
            
//           }
//   　　　　return response;  
//     });  
//   }); 
Vue.use(api);

// import 'vx-easyui/dist/themes/default/easyui.css';
// import 'vx-easyui/dist/themes/icon.css';
// import 'vx-easyui/dist/themes/vue.css';
// import EasyUI from 'vx-easyui';
// Vue.use(EasyUI);



// element ui
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

// cube-ui
// import Cube from 'cube-ui'
// import "cube-ui/lib/cube.min.css"
// Vue.use(Cube)

new Vue({
  el: '#vueCom',
  router,
  store,
  components: { App },
  template: '<App/>'
})
