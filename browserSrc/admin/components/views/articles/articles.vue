<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>订单管理</span>
                <!-- <el-button @click="getOrders" style="float: right; padding: 7px;" type="success">
                  刷新
                </el-button> -->
            </div>
            <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            type="index"
            width="50"
            label="序号">
            </el-table-column>

            <el-table-column
            prop=""
            label="用户名"
            width="100"
            >
            <template slot-scope="scope">
                   {{ scope.row.user.bankInfo.userName }}
            </template>
            </el-table-column>

            <el-table-column
            prop=""
            label="电话号码"
            width="150"
            >
            <template slot-scope="scope">
                   {{ scope.row.user.bankInfo.telNum }}
            </template>
            </el-table-column>

            <el-table-column
            prop="orderNum"
            label="订单编号"
            width="200"
            >
            </el-table-column>


            <el-table-column
            prop="total"
            label="订单总额"
            width="100">
            </el-table-column>

            <el-table-column
            prop="_payTime"
            width=""
            label="支付时间">
            </el-table-column>

            <el-table-column
            width=""
            label="状态">
                <template slot-scope="scope">
                    <span style="color:green" v-if="scope.row.status == 1" > 已支付 </span>
                    <span style="color:red" v-else-if="scope.row.status == 0" > 未支付 </span>
                    <span style="color:yellow" v-else-if="scope.row.status == 2" > 已到期 </span>
                </template>
            </el-table-column>

            <el-table-column
                width=""
                label="操作">
                <template slot-scope="scope" >
                    <div style="display:flex;">
                        <el-button v-if="scope.row.status == 0" @click="setToPayed(scope.row.id)" class="table-editor-btn" size="mini"> 
                          置为已支付
                          </el-button>
                          <el-button v-if="scope.row.status == 1" @click="showPreview(scope.row.id)" class="table-editor-btn" size="mini"> 
                          详情
                          </el-button>
                        <!-- <el-button @click="handleColumn('edit',scope.row)" class="table-editor-btn" size="mini"> 编辑</el-button>
                        <el-button @click="delAricle(scope.row)" class="table-editor-btn" size="mini" type="danger">删除</el-button> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
    <el-pagination
        class="column-pagination"
        background
        layout="prev, pager, next"
        :page-size="pagination.psize"
        :current-page ="pagination.page"
        @current-change = "pageChanged"
        :total="pagination.total">
    </el-pagination>
  </el-card>

  <!--编辑/新增 文章对话框-->
    <!-- <el-dialog
    top="2vh"
    :title="articleOperate.title"
    :visible.sync="articleOperate.show"
    :close-on-click-modal="false"

    width="75%"
    center>
    <articleEditor ref="aeditor"  v-if="articleOperate.show" :form="articleOperate.articleInfo"></articleEditor>
    <span slot="footer" class="dialog-footer">
        <div  style="text-align:right;">
            <el-button type="danger" @click="closeDlg">取 消</el-button>
            <el-button type="primary" @click="saveData">确 定</el-button>
        </div>
    </span>
    </el-dialog> -->


    </div>
</template>
<script>
import articleEditor from "../../common/articleEditor";
import preview from "../../common/articlePreview";

import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      // 文章数据
      tableData: [],
      pagination: {
        page: 1,
        psize: 10,
        total: 0
      },

      articleOperate: {
        title: "",
        show: false,
        articleInfo: {}
      },
      // 显示预览
      previewShow: false,
      //preId: null, // 预览id

      //lastestArtitle: null ,// 最新的文章
      //host:"http://pf.52ds.club",
      freshDataTimer:null,// 自动刷新订单数据 定时器
    };
  },
  components: {
    articleEditor,
    preview
  },
  created() {
    this.getOrders();
    var _this = this;
    this.freshDataTimer = setInterval(()=>{
      _this.getOrders();
    },5000)
    console.log("timer")
  },
  destroyed()
  {
    console.log("destroyed ");
    this.destroyTimer();
  },
  methods: {
    ...mapMutations({
      publish: "publish"
    }),

    //页面发生变动 
    pageChanged(page)
    {
      //console.log("page changed ",page);
      if(page)
      {
        this.pagination.page = page;
        this.getOrders();
      }
      
    },
    // 销毁 刷新数据定时器
    destroyTimer(){
      if(this.freshDataTimer)
      {
        clearInterval(this.freshDataTimer);
      }
    },
    // 加载订单数据
    async getOrders() {
      try {
        let orderList = await this.$http.get(this.host + "/admin/getOrders", {
          params: { page: this.pagination.page, psize: this.pagination.psize }
        });
        this.pagination.total = orderList.data.count;
        this.tableData = orderList.data.rows;
      } catch (err) {
        this.publish({
          sysMsg: "读取订单数据失败"
        });
        console.log(err);
      }
    },

    //置为已支付
    async setToPayed(order) {
      try {
        if (!order) {
          return;
        }
        if (confirm("确定要置该订单为已支付吗")) {
          {
            let data = await this.$http.post("/admin/setToPayed", {
              orderId: order
            });
          }
          this.publish({
            sysMsg: "操作成功"
          });

          this.getOrders();
        }
        //console.log("编辑的结果是", this.$refs.aeditor.getContent());

        //this.closeDlg();
      } catch (err) {
        this.publish({
          sysMsg: err
        });
      }
    },

   
  },
  watch: {

    // pagination.page: {
    //   deep: true,
    //   handler: function() {
    //     console.log("page changed ",this.pagination.page);
    //     this.getOrders();
    //   }
    // }

  }
};
</script>

<style lang="less" scoped>
@import url("./articles.less");
</style>

