import Vue from 'vue'
import Router from 'vue-router'
import Cookies from "js-cookie";
import Login from "@/pages/login/login"
import Index from "@/pages/index/index"
import User from "@/pages/user/user"
import Role from "@/pages/role/role"
import Default from "@/pages/default/default"

Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/index',
      name: 'index',
      component: Index,
      children: [{
          name: "user",
          path: "user",
          component: User,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          name: "role",
          path: "role",
          component: Role,
          meta: {
            keepAlive: false 
          }
        },
        {
          name: "default",
          path: "default",
          component: Default,
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
      component: Login
    },
    // {
    //   name:"vmonitor",
    //   path:"/vmonitor",
    //   component:require("@/components/views/vmonitor/vmonitor.vue"),
    // }
  ]
})

// 无需授权登录
//const noAuthPath = new Set(["login", "vmonitor"]);

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