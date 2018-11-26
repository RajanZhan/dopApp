<template>
    <div>
        
        <!--  系统控制面板 -->
        <div class="controll">
            <el-card v-if="!controllClose" class="box-card controll-board">
                <div slot="header" class="clearfix">
                    <span >系统设置</span>
                    <el-button @click="closeControll" style="float: right; padding: 5px 5px" size="small" type="danger">
                        <span >收起</span>
                        
                    </el-button> 
                </div>
                 <el-collapse class="setting" >
                        <el-collapse-item>
                            <template slot="title">
                            <i class="header-icon el-icon-info"></i> 
                             系统参数
                            </template>
                            <el-form ref="setting" :model="setting" label-width="100px">
                                <el-form-item label="视频墙规格">
                                    <el-select size="mini" v-model="setting.wallType" placeholder="请选择活动区域">
                                    <el-option :key="g.value" v-for="g in vGrid" :label="g.name" :value="g.value"></el-option>
                                    
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            
                        </el-collapse-item>
                        <el-collapse-item title="">
                            <div slot="title">
                                <span><i class="el-icon-tickets"></i> 摄像机管理</span>
                                <span style="float:right;margin-right:20px;">
                                    <!-- <i @click.stop="mgtCamera('add')" class="el-icon-circle-plus cop"></i>
                                    <i  @click.stop="mgtCamera('sub')" class="el-icon-remove cop"></i> -->
                                    <!-- <el-button size="mini" type="primary"><i class="el-icon-plus"></i> </el-button>
                                    <el-button size="mini" type="danger"><i class="el-icon-minus"></i> </el-button> -->
                                </span>
                                
                            </div>
                            <div class="clist">
                                <div :key="item.id" v-for="item in clist">
                                    <el-checkbox @click="initPlayer" v-model="item.isPlay">{{item.name}}</el-checkbox>
                                </div>
                            </div>
                            
                        </el-collapse-item>

                        <el-collapse-item  >
                            <div slot="title">
                                <span> <i class="el-icon-caret-top"></i> 直播推流管理</span>
                                <span style="float:right;margin-right:20px;">
                                    <!-- <i @click.stop="mgtCamera('add')" class="el-icon-circle-check cop"></i> -->
                                   
                                    <!-- <el-button size="mini" type="primary"><i class="el-icon-plus"></i> </el-button>
                                    <el-button size="mini" type="danger"><i class="el-icon-minus"></i> </el-button> -->
                                </span>
                                
                            </div>
                            <div class="clist">
                                <div :key="item.id" v-for="item in liveList"><el-checkbox v-model="item.isPlay">{{item.name}} 
                                    <i @click.stop="mgtCamera('add')" class="el-icon-caret-top cop"></i>
                                    </el-checkbox>
                                </div>
                            </div>
                            
                            
                        </el-collapse-item>
                    </el-collapse>
            </el-card>
            <el-button @click="closeControll" size="mini" v-else type="primary">
                <i class="el-icon-setting"></i>
            </el-button>
        </div>

        
        <!-- 视频墙  -->
        <div class="wall">
            <el-row :key="item"  v-for="item in  showVlist">
                  
                  <el-tooltip v-for="_item in item" :key="_item.id"  class="item" effect="dark" :content="_item.name" placement="right-end">
                      <el-col :span="(24/getCurrentGridInfo.col).toFixed(0)">
                            <el-card :style="{height:getVwindowHeight()+'px'}" style="position:;" class="box-card">
                               <div class="video" :id="'v_'+_item.id" :data-url="_item.url" :style="{height:getVwindowHeight()+'px',width:getVwindowWidth()+'px'}" style=""></div>
                               
                            </el-card>
                        </el-col>
                   </el-tooltip>   
            </el-row>
            
            <div class="pagination">
                <el-pagination
                background

                layout="prev, pager, next"
                :current-page="pagination.page"
                :page-size="getPsize"
                @current-change="pageChange"
                :total="pagination.total">
                </el-pagination>
                <!-- <el-button  @click="initPlayer">init</el-button> -->
            </div>
        
        </div>
    </div>
</template>
<script>
import util from "../../libs/utils.js";

export default {
  data() {
    return {
      controllClose: true,
      setting: {
        wallType: "4" // 表示当前是4宫格 还是其他
      },
      pagination: {
        total: 100,
        psize: 4,
        page: 1
      },
      //vlist: [],// 上墙监控列表
      clist: [], // 所有摄像机列表
      liveList: [], // 直播摄像机列表
      showVlist: [], // 当前页面显示的监控列表
      // 宫格信息
      vGrid: [
        {
          name: "4宫格",
          value: "4",
          col: 2,
          row: 2
        },
        {
          name: "6宫格",
          value: "6",
          col: 3,
          row: 2
        }
      ]
    };
  },
  created() {
    this.loadVlist();
    this.loadVLiveList();
  },
  mounted() {
    console.log("psize info ", this.getPsize);
    this.updateShowVlist();
  },
  computed: {
    // 根据宫格获取每页视频窗口数量 即psize
    getPsize() {
      let grid = this.getCurrentGridInfo;
      if (!grid) {
        return 1;
      }
      return grid.col * grid.row;
    },

    // 获取当前宫格信息
    getCurrentGridInfo() {
      for (let g of this.vGrid) {
        if (g.value == this.setting.wallType) {
          return g;
        }
      }
      return null;
    },

    // 上墙的摄像机
    vlist() {
      let vlist = [];
      for (let c of this.clist) {
        if (c.isPlay) {
          vlist.push(c);
        }
      }
      console.log("get vlist ", vlist);
      return vlist;
    }
  },
  methods: {
    initPlayer() {
      setTimeout(() => {
        $(".video").html("");
        $(".video").each(function() {
          //console.log(,$(this));
          let url = $(this).attr("data-url");
          let id = $(this).attr("id");
          if (url && id) {
            var videoObject = {
              container: "#" + id, //“#”代表容器的ID，“.”或“”代表容器的class
              variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
              autoplay: true, //自动播放
              live: true, //直播视频形式
              video: url
            };
            var player = new ckplayer(videoObject);
          }
        });
      }, 500);
    },

    pageChange(value) {
      this.pagination.page = value;
      //this.updateShowVlist();
    },

    // 页数改变，监控的列表也改变
    updateShowVlist() {
      let grid = this.getCurrentGridInfo;
      if (!grid) {
        throw Error("读取宫格信息失败");
      }
      let dividedVlist = util.divideArr(this.vlist, grid.col);

      // 根据当前页 计算
      let startIndex = this.pagination.page * grid.row - grid.row;
      let endIndex = this.pagination.page * grid.row - 1;
      let showVlist = dividedVlist.slice(startIndex, endIndex + 1);
      this.showVlist = showVlist;
      console.log(
        "监控列表分割",
        dividedVlist,
        startIndex,
        endIndex,
        showVlist
      );
    },
    // 加载视频监控列表
    async loadVlist() {
      let data = await this.$http.get(this.host + "/api/common/camera/");
      console.log("clist ", data.data);
      let clist = [];
      for (let i in data.data.rows) {
        data.data.rows[i].isPlay = false;
      }

      this.clist = data.data.rows;
      this.pagination.total = data.data.count;
    },

    // 加载直播摄像机列表
    async loadVLiveList() {
      let data = await this.$http.get(this.host + "/api/common/camera/getLive");
      //   for (let i in data.data.rows) {
      //     data.data.rows[i].isPlay = true;
      //   }

      this.liveList = data.data.rows;
    },

    // 根据宫格数 获取窗口高度
    getVwindowHeight() {
      let row = this.getCurrentGridInfo.row;
      if (!row) {
        return;
      }
      var clientHeight =
        document.body.clientHeight < document.documentElement.clientHeight
          ? document.body.clientHeight
          : document.documentElement.clientHeight;
      return (clientHeight / row * 0.95).toFixed(2);
    },

    // 根据宫格数 获取窗口宽度
    getVwindowWidth() {
      let row = this.getCurrentGridInfo.col;
      if (!row) {
        return;
      }
      var clientWidth =
        document.body.clientWidth < document.documentElement.clientWidth
          ? document.body.clientWidth
          : document.documentElement.clientWidth;
      return (clientWidth / row).toFixed(2);
    },

    //控制设置面板的操作
    closeControll() {
      this.controllClose = !this.controllClose;
    },

    // 控制添加或者删除视频
    mgtCamera(flag) {
      if (flag) {
        if (flag == "add") {
          console.log("add");
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
        } else if (flag == "sub") {
          console.log("sub");
        } else {
          this.$notify({
            title: "警告",
            message: "位置操作类型",
            type: "warning"
          });
        }
      }
    }
  },
  watch: {
    // 监听页数变化
    "pagination.page": function(value) {
      this.updateShowVlist();
       this.initPlayer();
    },

    // 监听宫格信息变化
    "setting.wallType": function() {
      // 页数归为
      this.pagination.page = 1;
      this.updateShowVlist();
       this.initPlayer();
    },

    // 上墙摄像机发生变动
    vlist: function() {
      this.updateShowVlist();
      this.initPlayer();
    },

    clist: {
      deep: true,
      handler: function() {
        console.log("clist changed", this.clist);
        this.vlist;
      }
    }
  }
};
</script>

<style>
.wall .el-card__body {
  padding: 0px !important;
}
</style>

<style lang="less" scoped>
@import url("./vmonitor.less");
</style>


