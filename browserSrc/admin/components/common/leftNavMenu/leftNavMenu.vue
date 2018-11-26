<template>
        <Menu ref="menu" @on-select = "onSelect" class="navMenu" theme="dark" width="auto" active-name="1-2" :open-names="[0]">
                    <Submenu :key="index + 1" v-for="(item,index) in menu" :name="index">
                        <template slot="title">
                            <Icon v-if="item.icon" :type="item.icon"></Icon>
                            {{ item.title }}
                        </template>
                        <MenuItem  v-if="sub.show" :key="sub.key" v-for="sub in item.children" :name="sub.key">
                             <Icon v-if="sub.icon" :type="sub.icon"></Icon>
                            {{ sub.title }}
                        </MenuItem>
                    </Submenu>
        </Menu>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      menu: "menu/getMenu",
      opendTags: "menu/getOpendTags",
      getTagKeyMap: "menu/getTagKeyMap",
      getActiveTagName: "menu/getActiveTagName",
      getCache: "getCache"
    })
  },
  created() {
    //console.log("menu", this.menu);

    // 设置 tag 的key为索引，方便根据key 获取对应的tag
    for (let item of this.menu) {
      //console.log(item,"item");
      if (item.children && item.children.length > 0) {
        for (let m of item.children) {
          this.setTagKeyMap(m);
        }
      }
    }
    //console.log("导航菜单索引",this.getTagKeyMap);
  },
  mounted() {
    //console.log("menu mounted", this.$refs);
    this.setCache({
      leftMenu: this.$refs.menu,
      $lock:"leftNavMenu",// 锁定 缓存对象,防止不小心被改动
    });
    var _this = this;
    this.subscribe({
      activeTagChange(data) {
        //console.log("activeTagChange in left menu", _this.getCache("leftMenu"));

        try {
          if (_this.$refs.menu) {
            _this.$refs.menu.currentActiveName = data;
          } else {
            _this.getCache("leftMenu").currentActiveName = data;
          }
          _this.setActiveTagName(data);
          _this.$router.push({
            name: data
          });
        } catch (err) {
          console.log("leftNavMenu 订阅 activeTagChange事件失败", err, _this);
        }
      }
    });

    // 初始页面,发布当前激活tag 的消息，
    // if (this.getActiveTagName) {
    //   this.publish({
    //     activeTagChange: this.getActiveTagName
    // });
    //console.log("init active tag ");
    //}
  },
  methods: {
    ...mapMutations({
      publish: "publish",
      subscribe: "subscribe",
      setActiveTagName: "menu/setActiveTagName",
      setTagKeyMap: "menu/setTagKeyMap",
      pushOpendTags: "menu/pushOpendTags",
      setCache: "setCache"
    }),
    onSelect(key) {
      //console.log(key);
      if (!key) return;

      // 统一 让tagOpenList 来处理页面的打开和关闭
      this.publish({
        openPage: key
      });

      // let isOpend = false;
      // for (let tag of this.opendTags) {
      //   if (tag.key == key) {
      //     isOpend = true; // tag 已经打开
      //     break;
      //   }
      // }
      // if (!isOpend) {
      //   // 如果tag 没打开 则加入打开的队列
      //   let tag = this.getTagKeyMap.get(key);
      //   if (!tag) {
      //     console.log(
      //       "无法追加 已打开的tag，因为从TagKeyMap索引中读取失败",
      //       this.getTagKeyMap,
      //       key
      //     );
      //     return;
      //   }
      //   this.pushOpendTags(tag);
      // }

      //console.log("发布 ",key);
      switch (key) {
        case "column":
          this.columnMgt();
          break;
      }
    },
    // 栏目管理
    columnMgt(key) {}
  }
};
</script>
<style scoped>
@import url("./leftNavMenu.less");
</style>


