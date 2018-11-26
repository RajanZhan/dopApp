<template>

<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>专栏列表</span>
    <el-button @click="handleColumn('add')" style="float: right; padding: 7px;" type="success">新建专栏</el-button>
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
      prop="name"
      label="专栏名称"
       width="140"
      >
    </el-table-column>
    <el-table-column
      prop="coldesc"
      label="专栏简介"
      width="">
    </el-table-column>
    <el-table-column
      prop="tags"
       width="180"
      label="专栏标签">
    </el-table-column>
    <el-table-column
      prop="img"
      width="60"
      label="图片">
    </el-table-column>
     <el-table-column
      width="50"
      label="状态">
      <template slot-scope="scope">
          <Icon style="color:green" v-if="scope.row.status" type="checkmark-circled"></Icon>
          <Icon style="color:red" v-else type="close-circled"></Icon>
      </template>
    </el-table-column>

     <el-table-column
        width="220"
      label="操作">
        <template slot-scope="scope" >
            <div style="display:flex;">
                <el-button @click="handleColumn('edit',scope.row)" class="table-editor-btn" size="mini"> 编辑</el-button>
                <el-button @click="editContent(scope.row)"  class="table-editor-btn" size="mini" type="primary">内容</el-button>
                <el-button class="table-editor-btn" size="mini" type="danger">删除</el-button>
            </div>
        </template>
    </el-table-column>
  </el-table>
    <el-pagination
        class="column-pagination"
        background
        layout="prev, pager, next"
        :page-size="pagination.psize"
        :page-sizes = "psizes"
        :total="pagination.total">
    </el-pagination>
 <!-- 专栏编辑 对话框-->
<el-dialog
  :close-on-click-modal= "false"
  :title="dialog.title"
  :visible.sync="dialog.show"
  :show-close="false"
  width="30%"
  center>
    <el-form :model="dialog.form" ref="colunmForm" :rules="colFormRule" label-position="right" label-width="80px">
        <el-form-item prop="name" label="专栏名称">
            <el-input v-model="dialog.form.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item  prop="tags" label="专栏标签">
            <el-input v-model="dialog.form.tags" size="mini"></el-input>
        </el-form-item>
        <el-form-item  prop="img" label="专栏图片">
            <el-input v-model="dialog.form.img" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="是否发布" prop="delivery">
            <el-switch v-model="dialog.form.status"></el-switch>
        </el-form-item>
        <el-form-item prop="coldesc" label="专栏简介">
            <el-input type="textarea" v-model="dialog.form.coldesc"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="saveColunm">确 定</el-button>
  </span>
</el-dialog>


</el-card>

</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      // column 分页
      pagination: {
        total: 100,
        psize: 30,
        psizes: [30, 50, 100],
        page: 1
      },
      // 对话框数据
      dialog: {
        title: "",
        show: false,
        form: {
          id: "",
          name: "",
          coldesc: "",
          tags: "",
          img: "",
          status: false
        }
      },

      //专栏数据表达验证规则
      colFormRule: {
        name: {
          required: true,
          message: "请输入专栏名称",
          triggle: "blur"
        },
        coldesc: {
          required: true,
          message: "请输入专栏简介",
          triggle: "blur"
        },
        img: {
          required: true,
          message: "请输入专栏图片",
          triggle: "blur"
        },
        tags: {
          required: true,
          message: "请输入专栏标签",
          triggle: "blur"
        }
      }
    };
  },
  filters: {},
  created() {
    this.loadColumnList();
  },
  methods: {
    ...mapMutations({
      publish: "publish"
    }),
    //专栏处理
    handleColumn(flag, data) {
      //编辑专栏
      if (flag == "edit") {
        this.dialog.title = "编辑";
        this.dialog.show = true;
        this.dialog.form = JSON.parse(JSON.stringify(data));
      } else if (flag == "add") {
        this.dialog.title = "新增";
        this.dialog.show = true;
      }
    },

    // 加载专栏列表
    loadColumnList() {
      this.$http
        .get("/api/admin/column/get", {
          page: this.pagination.page,
          psize: this.pagination.psize
        })
        .then(data => {
          //console.log("column list ",data);
          this.tableData = data.data.result.rows;
          this.pagination.total = data.data.result.count;
        });
    },
    //保存专栏数据
    async saveColunm() {
      try {
        this.$refs.colunmForm.validate(async result => {
          console.log(result, "验证结果");
          if (!result) {
            return;
          }
          var data = await this.$http.post("/api/admin/column/set", {
            params: this.dialog.form
          });
          //console.log("data",data);
          this.closeDialog();
          this.publish({
            sysMsg: data
          });
          this.loadColumnList();
        });
      } catch (err) {
        this.publish({
          sysMsg: err
        });
      }
    },

    // 删除专栏
    async delColumn(col) {
      this.$confirm(`确定删除专栏:${col.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.$http
          .post("/api/admin/column/del", { params: { id: col.id } })
          .then(data => {
            try {
              this.publish({
                sysMsg: data
              });
            } catch (err) {
              this.publish({
                sysMsg: err
              });
            }
          });
      });
    },

    // 编辑专栏内容
    editContent(col) {
      console.log("编辑专栏内容", col);
    //   this.$router.push({
    //     name: "article",
    //     params: {
    //       column: col
    //     }
    //   });
      this.publish({
        openPage: {
          name: "article",
          params: {
            column: col
          }
        }
      });
    },

    //关闭编辑/新增对话框
    closeDialog() {
      this.dialog.show = false;
    }
  }
};
</script>
<style scoped>
@import url("./column.less");
</style>
