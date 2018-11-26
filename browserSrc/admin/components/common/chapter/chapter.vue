<template>
    <div>
         <Tree :data="chapter"
          @on-check-change ="checkedChanged"
          @on-select-change="selectChanged" ref="tree" show-checkbox></Tree>
         <el-dialog
            :close-on-click-modal= "false"
            :title="dialog.title"
            :visible.sync="dialog.show"
            :show-close="false"
            width="30%"
            center>
                <el-form :model="dialog.form" ref="chapterForm" :rules="dialog.rules" label-position="right" label-width="80px">
                    <el-form-item prop="name" label="章节名称">
                        <el-input v-model="dialog.form.name" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item v-show="!dialog.form.id"  prop="parentId" label="父级章节">
                        <span v-if="selectedNodes.length > 0">{{ selectedNodes[0].name }}</span>
                        <span v-else>无</span>
                        <!-- <el-input v-model="dialog.form.parentId" size="mini"></el-input> -->
                    </el-form-item>
                    <el-form-item  prop="sort" label="排序编号">
                        <el-input v-model="dialog.form.sort" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="是否发布" prop="status">
                        <el-switch v-model="dialog.form.status"></el-switch>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDlg">取 消</el-button>
                <el-button type="primary" @click="addChapter('save')">确 定</el-button>
            </span>
            </el-dialog>
    </div>
   
</template>
<script>
import { mapMutations } from "vuex";
import util from "../../libs/utils";
import utils from "../../libs/utils";
export default {
  data() {
    return {
      chapter: [],
      api: null, // 服务实例
      dialog: {
        title: "添加章节",
        form: {
          name: "",
          sort: 1,
          parentId: 0,
          status: true
        },
        show: false,
        rules: {
          name: {
            required: true,
            message: "章节名称不能为空",
            triggle: "blur"
          }
        }
      },
      selectedNodes: [{ name: "无", id: 0 }], // 选中的章节
      checkedNodes: [] //勾选中的章节
    };
  },
  props: ["colId"],
  computed: {},
  async created() {
    if (!this.colId) {
      throw Error("colId 为空,无法实例化章节树形组件");
    }
    //console.log("api is ",this.$api);
    this.api = new this.$api(this, "/api/admin/chapter");
    this.loadChapter();
  },
  methods: {
    ...mapMutations({
      publish: "publish"
    }),

    // 章节选中变动
    selectChanged() {
      this.selectedNodes = this.$refs.tree.getSelectedNodes();
      console.log("节点选中发生变动", this.selectedNodes);
    },

    //章节勾选发生变动
    checkedChanged(checkedNodes) {
      this.checkedNodes = checkedNodes;
      console.log("checked nodes ", this.checkedNodes);
    },

    // 还原所有章节的选中状态

    // 加载章节树
    async loadChapter() {
      try {
        let chapterTree = await this.api.get({ colId: this.colId });
        this.chapter = chapterTree.data.result;

        // 还原章节选中状态
        //util.resetTreeSelected(this.chapter);
        // 设置选中的章节
        // var setSelected = (chapter)=>{
        //     for(let i in chapter)
        //     {
        //         for(let j in this.selectedNodes)
        //         {
        //             if(chapter[i].id == this.selectedNodes[j].id)
        //             {
        //                 chapter[i].selected = true;
        //             }
        //         }
        //         if((chapter[i].children) && (chapter[i].children.length > 0))
        //         {
        //             setSelected(chapter[i].children);
        //         }
        //     }
        // }
        // setSelected(this.chapter);
        //console.log("专栏数据读取", chapterTree.data.result);
      } catch (err) {
        this.publish({
          sysMsg: err
        });
      }
    },

    // 添加章节信息
    async addChapter(flag) {
      try {
        if (flag != "save") {
          this.dialog.show = true;
          if (flag == "add") {
            this.dialog.show = true;
            this.dialog.form = {};
          }
          return;
        }

        this.$refs.chapterForm.validate(async validate => {
          try {
            if (!validate) {
              //console.log("表单验证失败");
              this.publish({
                sysMsg: { status: "warning", msg: "无法添加章节,信息不完整" }
              });
              return;
            }
            if (!this.dialog.form.id) {
              this.dialog.form.parentId = this.selectedNodes[0]
                ? this.selectedNodes[0].id
                : null;
              this.dialog.form.colId = this.colId;
            }
            var res = await this.api.set(this.dialog.form);
            this.publish({
              sysMsg: res
            });

            // 添加模式
            if (!this.dialog.form.id) {

              let newChapter = res.data.result;
              newChapter.title = newChapter.name + ` [${newChapter.sort}]`,
              newChapter.expand = true;
              if(!newChapter.children)
              {
                  newChapter.children = [];
              }
              if (this.selectedNodes[0] && (this.selectedNodes[0].id != 0)) {
                this.selectedNodes[0].children.push(newChapter);
              } else {
                this.chapter.push(newChapter);
              }
            } else {
              // 更新
              this.chapter = utils.updateItemFromTree(this.chapter, [
                this.dialog.form
              ]);
            }
            this.closeDlg();

            //console.log("添加的结果",res);
            //this.loadChapter();
          } catch (err) {
              console.log("selected node ",this.selectedNodes);
            this.publish({
              sysMsg: err
            });
          }
        });
      } catch (err) {
        this.publish({
          sysMsg: err
        });
      }
    },

    // 编辑章节信息
    editChapter() {
      if (this.selectedNodes.length == 0 || this.selectedNodes[0].id == 0) {
        this.publish({
          sysMsg: { status: "warning", msg: "请选择要编辑的章节" }
        });
        return;
      }
      //console.log(this.selectedNodes);
      this.dialog.show = true;
      this.dialog.title = "编辑章节";
      this.dialog.form = this.selectedNodes[0];
    },

    // 删除章节信息
    async delChapter() {
      try {
        if (this.checkedNodes.length == 0) {
          this.publish({
            sysMsg: {
              status: "warning",
              msg: "请选择要删除的章节"
            }
          });
          return;
        }
        var ids = [];
        for (let node of this.checkedNodes) {
          ids.push(node.id);
        }
        let result = await this.api.del({ ids: ids });
        //  this.publish({
        //      sysMsg:result
        //  })
        this.chapter = utils.removeItemFromTree(this.chapter, result.data.result);
        // this.loadChapter();
      } catch (err) {
        this.publish({
          sysMsg: err
        });
      }
    },

    // 关闭对话框
    closeDlg() {
      this.dialog.show = false;
    }
  }
};
</script>