import Vue from 'vue'
import Router from 'vue-router'
import Cookies from "js-cookie";
Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/index',
      name: 'index',
      component: require("@/pages/index/index.vue"),
      children: [{
          name: "user",
          path: "user",
          component: require("@/pages/user/user.vue"),
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          name: "role",
          path: "role",
          component: require("@/pages/role/role.vue"),
          meta: {
            keepAlive: false 
          }
        },
        {
          name: "default",
          path: "default",
          component: require("@/pages/default/default.vue"),
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        // {
        //   name: "home",
        //   path: "home",
        //   component: require("@/components/views/home/home.vue"),
        // },
        // {
        //   name: "orders",
        //   path: "orders",
        //   component: require("@/components/views/articles/articles.vue"),
        // },

      ],
    },
    {
      path: '/login',
      name: 'login',
      component: require("@/pages/login/login")
    },
    // {
    //   name:"vmonitor",
    //   path:"/vmonitor",
    //   component:require("@/components/views/vmonitor/vmonitor.vue"),
    // }
  ]
})

// 无需授权登录
const noAuthPath = new Set(["login", "vmonitor"]);

router.beforeEach((to, from, next) => {
  let isLoign = Cookies.get("login");
  //console.log("islogin",isLoign,to,from);
  // if (((!isLoign) || (isLoign != 1)) && (!noAuthPath.has(to.name))) {
  //   next({
  //     name: 'login'
  //   });
  //   return;
  //   s
  // }
  // if ((isLoign == 1) && (to.name == "login")) {
  //   //console.log("go index");
  //   next({
  //     name: "index"
  //   });
  //   return;
  // }
  next();
})
export default router