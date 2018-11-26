<template>
    <Row class="main">
         <Col span="6" style="margin-right:20px;">
    
            <Card >
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                     章节管理 
                    <span style="margin-left:20px;">
                        <i @click="addChapter" style="color:green;" class="el-icon-circle-plus chapter-btn"></i>
                        <i  @click="delChapter" style="color:red;" class="el-icon-remove chapter-btn"></i>
                        <i  @click="editChapter" class="el-icon-edit chapter-btn"></i>

                        <!-- <Icon @click="addChapter" class="chapter-btn" style="color:green;" type="plus-circled"></Icon>
                        <Icon class="chapter-btn"  style="color:red;"  type="close-circled"></Icon>
                        <Icon class="chapter-btn"  type="edit"></Icon> -->
                        <!-- <el-button @click="addChapter" size="mini">添加</el-button>
                        <el-button @click="addChapter" size="mini">添加</el-button>
                        <el-button @click="addChapter"  type="danger" size="mini">删除</el-button> -->
                    </span>
                     
                </p>
               <chapter :colId="column.id" ref="chapter" class="chapter-list"></chapter>
                
            </Card>
            <Card style="margin: 10px 0 10px;">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                     文章管理
                </p>
                <Tabs type="card">
                
                    <TabPane label="章节管理">
                        <aTree class="article-list"></aTree>
                    </TabPane>
                    <TabPane label="评论管理">评论管理</TabPane>
                    
                </Tabs>
                
            </Card>
        </Col>
        <Col span="17" class="editor">

        <Card>
            <p slot="title">
                    <Icon type="edit"></Icon>
                     编辑
            </p>
        <Row >
            <Col span="8">
                <div class="input-item">
                 章节名称 <Input v-model="form.author" placeholder="请输入章节名称"></Input>
                </div>
            </Col>
            <Col  span="8">
                <div class="input-item">
                文章标题： <Input v-model="form.title"  placeholder="请输入文章标题"></Input>
                </div>
            </Col>
           
            <Col span="8">
                <div class="input-item">
                 作者：<Input v-model="form.author" placeholder="请输入文章作者"></Input>
                </div>
            </Col>
        </Row>

            <div class="input-item">
                简介：<Input v-model="form.desc" type="textarea" placeholder="请输入文章作者"></Input>
            </div>
            <div style="overflow:auto;"  class="input-item">
                 <!-- <div id="editor" style="height:500px;"></div>   -->
                 <editor id="editor" :config="{}"></editor>
            </div>
            
        </Card>
    
        </Col>
    </Row>
</template>

<script>
import editor from "../../common/ueditor";
import aTree from "../../common/articleTree"; //
import chapter from "../../common/chapter"; // 章节信息
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        title: "",
        author: "",
        desc: ""
      },
      column: null,
      editor: null
    };
  },
  created() {
    var _this = this;
    this.subscrib({
      //监听当本页面被关闭时，手动清除column 缓存
      closePage(name) {
        if (name == "article") {
          sessionStorage.removeItem("column");
          console.log("clear column");
        }
      }
    });
    //console.log("文章组件创建",this.$route);
    this.column = this.$route.params.column
      ? this.$route.params.column
      : JSON.parse(sessionStorage.getItem("column"));
    if (!this.column) {
      this.publish({
        sysMsg: { status: 401, msg: "栏目信息获取失败，自动返回主页" }
      });
      //   this.$router.push({
      //       name:"home"
      //   });
      this.publish({
        closePage: "article"
      });
      this.publish({
        openPage: { name: "home" }
      });
    }
    sessionStorage.setItem("column", JSON.stringify(this.column));

  },
  mounted() {},
  methods: {
    ...mapMutations({
      publish: "publish",
      subscrib: "subscribe"
    }),

    // 添加章节
    async addChapter() {
        this.$refs.chapter.addChapter("add");
    },

    //删除章节
    delChapter(){
        this.$refs.chapter.delChapter();
    },

    // 编辑章节
    editChapter()
    {
        this.$refs.chapter.editChapter();
    }
  },
  components: {
    editor,
    aTree,
    chapter
  }
};
</script>

<style scoped>
@import url("./article.less");
</style>