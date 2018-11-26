<style lang="less">
@import "./tagOpenList.less";
</style>

<template>
    <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <transition-group id="tagList" name="taglist-moving-animation">
                <!-- <Tag 
                    :id="item.name + index"
                    type="dot"
                    v-for="(item, index) in pageList" 
                    ref="tagsPageOpened"
                    :key="item.name" 
                    :name="item.name" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ item.name + index }}</Tag> -->
                
            </transition-group>
                <Tag 
                    type="dot"
                    v-for="(item, index) in getOpendTags" 
                    ref="tagsPageOpened"
                    :key="item.title" 
                    :name="item.key" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.title==='主页'?false:true"
                    :color="item.key == currentPageName ?'blue':'default'"
                    >{{ item.title }}</Tag>
            <!-- <h1 v-for="item in pageList"> ss</h1> -->
        </div>
        <div class="close-all-tag-con">
            <!-- <Dropdown transfer @on-click="handleTagsOption">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown> -->
        </div>

    </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "tagsPageOpened",
  data() {
    return {
      //currentPageName: this.$route.name,
      //currentPageName: "",
      tagBodyLeft: 0,
      refsTag: [],
      tagsCount: 1,
      pageList: []
    };
  },
  props: {
    pageTagsList: Array,
    beforePush: {
      type: Function,
      default: item => {
        return true;
      }
    }
  },
  computed: {
    ...mapGetters({
      currentPageName: "menu/getActiveTagName", // 当前激活的tag
      getOpendTags: "menu/getOpendTags", // 获取已经打开的tag
      getTagKeyMap: "menu/getTagKeyMap"
    }),

    title() {
      return this.$store.state.app.currentTitle;
    },
    tagsList() {
      return this.$store.state.app.pageOpenedList;
    }
  },
  mounted() {
    this.refsTag = this.$refs.tagsPageOpened;
    //console.log("refsTag ", this.refsTag);
    var _this = this;
    this.subscribe({
      //统一使用消息队列 关闭tags,方便其他组件调用
      closePage(name) {
        //console.log("关闭yemian", name);
        if (name) {
          _this.closeTag(name);
          var nowActiveTagName = "";
          if (_this.getOpendTags[_this.getOpendTags.length - 1]) {
            nowActiveTagName =
              _this.getOpendTags[_this.getOpendTags.length - 1].key;
          }
          _this.publish({
            activeTagChange: nowActiveTagName
          });
        }
      },

      // 统一调用 打开页面的方法
      openPage(key) {
        if(typeof(key) == "object")
        {
          //key = key.name;
          _this.$router.push(key);
          key = key.name
        }
        _this.publish({
          activeTagChange: key
        });
        let isOpend = false;
        for (let tag of _this.getOpendTags) {
          if (tag.key == key) {
            isOpend = true; // tag 已经打开
            break;
          }
        }
        if (!isOpend) {
          // 如果tag 没打开 则加入打开的队列
          let tag = _this.getTagKeyMap.get(key);
          if (!tag) {
            console.log(
              "无法追加 已打开的tag，因为从TagKeyMap索引中读取失败",
              _this.getTagKeyMap,
              key
            );
            return;
          }
          _this.pushOpendTags(tag);
        }
        
      }
    });
    // setTimeout(() => {
    //     this.refsTag.forEach((item, index) => {
    //         if (this.$route.name === item.name) {
    //             let tag = this.refsTag[index].$el;
    //             this.moveToView(tag);
    //         }
    //     });
    // }, 1); // 这里不设定时器就会有偏移bug
    // this.tagsCount = this.tagsList.length;
    //this.tagsCount = this.refsTag.length;
  },
  methods: {
    ...mapMutations({
      publish: "publish",
      subscribe: "subscribe",
      closeTag: "menu/closeTag",
      pushOpendTags: "menu/pushOpendTags"
    }),
    itemTitle(item) {
      if (typeof item.title === "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    },
    closePage(event, name) {
      if (!name) {
        console.log("标签获取失败,无法关闭");
        return;
      }
      this.publish({
        closePage: name
      });
      //console.log("关闭标签", nowActiveTagName);
    },
    linkTo(item) {
      // let routerObj = {};
      // routerObj.name = item.name;
      // if (item.argu) {
      //     routerObj.params = item.argu;
      // }
      // if (item.query) {
      //     routerObj.query = item.query;
      // }
      // if (this.beforePush(item)) {
      //     this.$router.push(routerObj);
      // }
      //console.log("click ",item);
      this.publish({
        activeTagChange: item.key
      });
    },
    handlescroll(e) {
      //return;
      //console.log("handle。。。");
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      let left = 0;
      if (delta > 0) {
        left = Math.min(0, this.tagBodyLeft + delta);
      } else {
        if (
          this.$refs.scrollCon.offsetWidth - 100 <
          this.$refs.scrollBody.offsetWidth
        ) {
          if (
            this.tagBodyLeft <
            -(
              this.$refs.scrollBody.offsetWidth -
              this.$refs.scrollCon.offsetWidth +
              100
            )
          ) {
            left = this.tagBodyLeft;
          } else {
            left = Math.max(
              this.tagBodyLeft + delta,
              this.$refs.scrollCon.offsetWidth -
                this.$refs.scrollBody.offsetWidth -
                100
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
      this.tagBodyLeft = left;
    },
    handleTagsOption(type) {
      if (type === "clearAll") {
        this.$store.commit("clearAllTags");
        this.$router.push({
          name: "home_index"
        });
      } else {
        //$("#tagList").scrollLeft() += 100
        //console.log($("#tagList").scrollLeft() );
        //$.scrollTo('#tagList',100,200);

        // let oriLeft =  $("#tagList").offset().left + 10;
        // $("#tagList").offset({left:oriLeft});
        // document.getElementById('tagList').offsetLeft += 10 ;//= document.getElementById('tagList').scrollWidth
        //this.$store.commit('clearOtherTags', this);
        // this.$router.push({
        //     name: 'article5'
        // });
        this.moveToView(this.refsTag[13].$el);
        //this.tagBodyLeft -= 30;
      }
      //this.tagBodyLeft = 0;
    },
    moveToView(tag) {
      if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft - 10;
        //console.log("left");
      } else if (
        tag.offsetLeft + 10 > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth <
          -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          this.$refs.scrollCon.offsetWidth -
            100 -
            tag.offsetWidth -
            tag.offsetLeft -
            20
        );
        //console.log("in");
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
          104
        );
        //console.log("right");
      }
      // console.log("move tags ",tag.offsetLeft,this.tagBodyLeft);
      // console.log(" tags offset width  ",tag.offsetWidth);
    }
  },

  watch: {
    $route(to) {
      //   this.publish({
      //     activeTagChange: to.name
      //   });
      //console.log("路由监听变动");
      // var to = { name :"article13"}
      // console.log("router change");
      //   this.currentPageName = to.name;
      //   this.$nextTick(() => {
      //     this.refsTag.forEach((item, index) => {
      //       if (to.name === item.name) {
      //         let tag = this.refsTag[index].$el;
      //         this.moveToView(tag);
      //       }
      //     });
      //   });
      //   this.tagsCount = this.refsTag.length;
      //this.tagsCount = this.tagsList.length;
    }
  }
};
</script>

<style>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 1px;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
}
</style>