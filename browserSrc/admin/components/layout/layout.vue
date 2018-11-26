<template>
  <div style="display:flex;">
    <!-- <div class="f-column">
      <div class="f-row f-full">
        <div class="sidebar-body f-animate" :style="{width:width+'px'}">
          <el-menu @select="tabsOpen" :default-active="selectedPage" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-openeds="opendMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-submenu v-for="(menu,index ) in menus" :key="index" :index="index">
              <template slot="title">
                <i v-if="menu.icon" :class="menu.icon"></i>
                <span>{{menu.text}}</span>
              </template>
              <el-menu-item-group v-if="menu.children && menu.children.length > 0">

                <el-menu-item v-for="(submenu,index2) in menu.children" :key="index2" :index="submenu.value">
                  <i v-if="submenu.icon" :class="submenu.icon"></i>
                  {{ submenu.text }}
                </el-menu-item>

              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
        <div :style="{height:outerHeight+'px'}" class="main-body f-full">
          <el-tabs  :value="value" @tab-click="tabClick" v-model="editableTabsValue" type="card" @edit="handleTabsEdit">
            <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :closable="item.closable" :name="item.name">
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive"></router-view>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div> -->
    <div style="width:200px;">
      <el-menu @select="tabsOpen" :default-active="selectedPage" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-openeds="opendMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-submenu v-for="(menu,index ) in menus" :key="index" :index="index">
          <template slot="title">
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span>{{menu.text}}</span>
          </template>
          <el-menu-item-group v-if="menu.children && menu.children.length > 0">

            <el-menu-item v-for="(submenu,index2) in menu.children" :key="index2" :index="submenu.value">
              <i v-if="submenu.icon" :class="submenu.icon"></i>
              {{ submenu.text }}
            </el-menu-item>

          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div style="flex:1">
      <el-tabs :style="{width:appConfig.width - 240 +'px'}" :value="value" @tab-click="tabClick" v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :closable="item.closable" :name="item.name">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      title: "AppLayout",
      width: 200,
      collapsed: false,
      selectedMenu: null,
      opendMenu: [0], // 展开的侧边菜单
      selectedPage: "", // 选中的页面
      pagesMap: new Map(), // 页面缓存
      editableTabsValue: "2",
      editableTabs: [],
      tabIndex: 2,
      outerHeight: 0 ,// windows 窗口的高度
      // app 配置信息
      appConfig:{
        width:0,
      }
    };
  },
  props: ["menus"],

  created() {
    this.initPagesMap();
    //console.log("", window.outerHeight);
    this.outerHeight = window.outerHeight;
    if(this.$route.query.width)
    {
      this.appConfig.width = this.$route.query.width;
      console.log("layout init is ",this.$route);
    }
    
  },
  mounted() {
    console.log("layout mounted ", this.$route);
    var name = JSON.parse(JSON.stringify(this.$route.name));
    this.openTabByPageName("default");
    setTimeout(() => {
      if (name) {
        this.openTabByPageName(name);
      }
    }, 10);
    // if (this.$route && this.$route.name) {
    //   this.openTabByPageName(this.$route.name);
    // }
  },
  methods: {
    // 初始化左侧的页面菜单缓存
    initPagesMap() {
      for (let page of this.menus) {
        if (page && page.value) {
          this.pagesMap.set(page.value, page);
        }
        if (page.children && page.children.length > 0) {
          for (let subpage of page.children) {
            if (subpage && subpage.value) {
              this.pagesMap.set(subpage.value, subpage);
            }
          }
        }
      }
      //console.log("page init finished", this.pagesMap);
    },

    toggle() {
      this.collapsed = !this.collapsed;
      this.width = this.collapsed ? 50 : 200;
    },
    onItemClick(item) {
      this.selectedMenu = item;
      //console.log(item,'hahah');
    },

    // tab 关闭的事件
    handleTabsEdit(targetName, action) {
      if (action === "remove") {
        var nextTab = null;
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        if (nextTab) {
          let page = this.pagesMap.get(nextTab.name);

          if (page && page.page) {
            this.$router.push({
              name: page.page
            });
          }
        } else {
          console.log("nexttab is empty");
          this.$router.push({
            name: "default"
          });
        }
      }
    },

    // 左侧tab点击回调函数
    tabsOpen(pageValue) {
      //console.log("tabs open ", pageValue);
      var item = this.pagesMap.get(pageValue);
      //console.log("item is ",item);
      if (!item.page) {
        return;
      }
      if (!item) {
        return;
      }
      this.selectedPage = item.value;
      this.$router.push({
        name: item.page
      });
      for (let tab of this.editableTabs) {
        if (tab.name == item.value) {
          this.editableTabsValue = item.value;
          return;
        }
      }
      this.editableTabs.push({
        title: item.text,
        closable: item.closable,
        name: item.value,
        content: "content" + item.value
      });
      this.editableTabsValue = item.value;
    },

    // tab 被点击
    tabClick(item) {
      // console.log("tab click",item);
      this.openTabByMenuName(item.name);
    },

    // 通过页面名字打开页面
    openTabByPageName(name) {
      for (let tab of this.menus) {
        //console.log(tab);
        if (tab.children && tab.children.length > 0) {
          for (let c of tab.children) {
            if (c.page && c.page == name) {
              this.tabsOpen(c.value);
              //console.log("openTabByName", name);
              return;
            }
          }
        }
      }
    },

    // 通过菜单名字打开页面
    openTabByMenuName(name) {
      for (let tab of this.menus) {
        //console.log(tab);
        if (tab.children && tab.children.length > 0) {
          for (let c of tab.children) {
            if (c.value && c.value == name) {
              this.tabsOpen(c.value);
              //console.log("openTabByMenuName", name);
              return;
            }
          }
        }
      }
    }
  },
  watch: {
    activeTab() {
      console.log("activeTab", this.activeTab);
    }
  }
};
</script>
<style lang="less">
@import url("./layout.less");
</style>


