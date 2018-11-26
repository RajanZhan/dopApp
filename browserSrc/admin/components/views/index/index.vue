
<template>
    <div class="layout">
        <Row class="main-row" type="flex">
            <i-col span="4" class="layout-menu-left">
                <div class="layout-logo"> 后台管理系统 </div>
                 <left-nav-menu></left-nav-menu>
            </i-col>
            <i-col span="20">
                <div class="layout-header">

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">  

                            <i-col span="24" style="display:flex;">

                                <!-- <Breadcrumb style="position:absolute;left:20px;" >
                                    <Breadcrumb-item href="#">首页</Breadcrumb-item>
                                    <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                                    <Breadcrumb-item>某应用</Breadcrumb-item>
                                </Breadcrumb> -->

                                <message-tips  class="header-bar-tool" 
                                style="margin:5px 20px 0px;position:absolute;right:120px;"></message-tips>
                                <Dropdown class="header-bar-tool" transfer
                                 trigger="click" style="margin-top:5px;position:absolute;right:60px;"
                                  @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">admin</span>
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <!-- <DropdownItem name="ownSpace">个人中心</DropdownItem> -->
                                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                
                                <Avatar  class="header-bar-tool" src="/static\index\images\headimg.jpg" 
                                style="background: #619fe7;position:absolute;right:10px;"></Avatar>
                            </i-col> 
                        </Row>
                    </div>

                </div>
                <div class="layout-breadcrumb">
                    <!-- <Tag type="dot" closable>文章管理</Tag> -->
                    <tag-open-list></tag-open-list>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                        <keep-alive :include="getCachePages">
                            <router-view/>
                        </keep-alive>
                         
                    </div>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
import messageTips from "../../common/message-tip.vue";
import tagOpenList from "../../common/tagOpenList";
import leftNavMenu from "../../common/leftNavMenu"
import { mapGetters,mapMutations } from "vuex"; 
import Cookies from "js-cookie"
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getCachePages: "getCachePages"
    })
  },
  created() {
    document.title = "后台系统";
  },
  methods: {
      ...mapMutations({
          publish:"publish"
      }),
    //左侧导航菜单点击
    navClick(key) {
      console.log("menu click ", key);
    },

    handleClickUserDropdown(name)
    {
        console.log(name);
        switch(name){
            case "loginout":
            this.logout();
            break;
        }
    },
    // 退出登录
    logout()
    {
        this.$http.post("/public/logout",{}).then((data)=>{
            try{
                Cookies.set("login", 0);
                this.$router.push({
                    name:"login"
                })
                this.publish({
                    sysMsg:"登出成功"
                })
                
            }
            catch(err)
            {
                this.publish({
                    sysMsg:err
                })
            }
        })
    }
  },
  components: {
    messageTips,
    tagOpenList,
    leftNavMenu
  }
};
</script>
<style scoped>
@import url("./index.less");
</style>