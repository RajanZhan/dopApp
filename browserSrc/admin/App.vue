<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {
      heartTimer:null,
    };
  },
  created() {
    var _this = this;
    this.subscribe({
      
      // 统一系统消息
      sysMsg(data) {
        var msg = "";
        if(typeof(data.data) == "string"){
          msg = data.data;
        }
        else if (typeof(data.data) == "object")
        {
          msg = data.data.msg;
        }
        else if(typeof(data) == "string"){
          msg  = data
        }
        else 
        {
          if(data.msg){
            msg = data.msg
          }
          else
          {
             msg = "解析消息失败"
          }
          console.log(data);
        }
        
        switch (data.status) {
          case 200 || 'info':
            // _this.$Notice.success({
            //   title: "信息",
            //   desc:msg
            // });
            _this.$message({
              message: msg,
              type: 'success'
            });
            break;
          case 402 || 'warning':
            // _this.$Notice.warning({
            //   title: "警告",
            //   desc: msg
            // });
            _this.$message({
              message: msg,
              type: 'warning'
            });
            break;
          case 401 || 'deny':
            // _this.$Notice.warning({
            //   title: "拒绝",
            //   desc: msg
            // });
             _this.$message({
              message: msg,
              type: 'warning'
            });
            break;
          case 403 || 'noauth':
            // _this.$Notice.warning({
            //   title: "认证异常",
            //   desc: msg
            // });
             _this.$message({
              message: msg,
              type: 'warning'
            });
            break;
          case 500 || 'error':
            // _this.$Notice.error({
            //   title: "错误",
            //   desc: msg
            // });
            _this.$message.error(msg);
            break;
          default:
            // _this.$Notice.info({
            //   title: "信息",
            //   desc: msg
            // });
             _this.$message({
              message: msg,
              type: 'info'
            });
        }
      }
    });
    this.heart();
    console.log("App.vue created");
  },
  methods: {
    ...mapMutations({
      publish: "publish",
      subscribe: "subscribe"
    }),

    // 保证session 心跳
    heart(){
      if(this.heartTimer)
      {
        clearInterval(this.heartTimer);
      }
      var _this = this;
      this.heartTimer = setInterval(()=>{
        _this.$http.post("/public/heart",{})     
      },1000 * 60 * 5) // 五分钟的心跳
    }
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}

/*配合ueditot 重置 element 的css*/
.el-dialog__wrapper
{
  z-index: 1001 !important;
}
.v-modal {
   z-index: 1000 !important;
}
</style>
