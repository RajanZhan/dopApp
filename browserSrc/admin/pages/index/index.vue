<template>
    <div class="main">
      <!-- <cube-button :light="true">Light Button</cube-button>
<cube-button :inline="true">Inline Button</cube-button>
<cube-button :outline="true">Outline Button</cube-button>
<cube-button :primary="true">Primary Button</cube-button> -->
        <div class="menu">
            <rmenu @menuClick="menuClick" :menu="menuList"></rmenu>
        </div>
        <div :class="{'menu-exist': menuList &&  menuList.length > 0}" class="content">
            <rlayout :menus="pages"></rlayout>
        </div>
        <!-- <Dialog ref="d1" :title="'Draggable And Resizable'" :dialogStyle="{width:'900px',height:'600px'}" :modal="true" :draggable="true" :resizable="true">
            <iframe src="http://127.0.0.1:81/static/admin.html#/login"></iframe>

        </Dialog> -->

    </div>

</template>

<script>
import app from "../../app.config";
import rmenu from "../../components/menu/menu.vue";
import rlayout from "../../components/layout/layout.vue";
export default {
  name: "login",
  data() {
    return {
      menuList: [],
      title: "AppLayout",
      width: 200,
      collapsed: false,
      selectedMenu: null
    };
  },
  components: {
    rmenu,
    rlayout
  },
  created() {
    this.menuList = app.menu;
    (this.pages = app.pages), console.log(this.menuList);
  },

  mounted() {
    console.log("app is init is ",this.$http);
    this.$http.post("http://localhost:81/api/test/index?userId=1&email=email",{name:"rajan"})
    
  },
  methods: {
    menuClick(event) {
      console.log("hahaah", event);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
