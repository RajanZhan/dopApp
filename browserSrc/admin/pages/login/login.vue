<template>
  <div class="main">
    
    <Dialog ref="d1" :title="'Draggable And Resizable'" :dialogStyle="{width:runingApps[0].width+'px',height:runingApps[0].height+'px'}" :modal="false" :draggable="true" :resizable="true">
       <iframe :style="{width:runingApps[0].width - 30 +'px',height:runingApps[0].height -46 +'px'}"
        :src="runingApps[0].url+'?width='+runingApps[0].width"></iframe>
    </Dialog>
    

  </div>

</template>

<script>
import app from "../../app.config";
// import rmenu from "../../components/menu/menu.vue";
// import rlayout from "../../components/layout/layout.vue";
export default {
  name: "login",
  data() {
    return {
      menuList: [],
      title: "AppLayout",
      width: 200,
      collapsed: false,
      selectedMenu: null,
      runingApps:[
        {
          url:"http://127.0.0.1:82/admin.html#/index/default",
          width:900,
          height:650,
        }
      ]
    };
  },
  components: {},
  created() {
    this.menuList = app.menu;
    (this.pages = app.pages), console.log(this.menuList);
  },

  mounted() {
    console.log("loginlvue mounted ");
  },
  methods: {
    menuClick(event) {
      console.log("hahaah", event);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./login.less");
</style>
