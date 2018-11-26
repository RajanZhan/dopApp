<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-row>
                <el-col :span="16">
                    文章标题：<el-input v-model="form.title"></el-input>
                </el-col>
                <el-col :span="8">
                    期号:<el-input type="number" v-model="form.sort"></el-input>
                </el-col>
            </el-row>

            <el-row style="margin-top:10px;">
                <el-col :span="8">
                    图片:
                   <el-input v-model="form.imgs"></el-input>
                </el-col>
                <el-col :span="8">
                    音乐：<el-input v-model="form.music"></el-input>
                </el-col>
                <el-col :span="8">
                    背景色：<span :style="{background:form.background,color:form.background}">颜色</span>
                    <el-input v-model="form.background"></el-input>
                </el-col>
            </el-row>
            
            <el-row style="margin-top:10px;">
                <el-col :span="8">
                    标签:
                   <el-input v-model="form.tags"></el-input>
                </el-col>
                <el-col :span="8">
                    简介：<el-input v-model="form.brief"></el-input>
                </el-col>
                <el-col :span="8">
                    是否发布：
                    <div>
                         <el-switch v-model="form.status"></el-switch>
                         
                         <el-button v-if="form.id" @click="showPreview= true" size="mini" type="primary"><Icon type="eye"></Icon>预览</el-button>
                    </div>
                    
                </el-col>
            </el-row>

            <el-row style="margin-top:5px;">
                <editor ref="ue" @changed="updateContent" :content="form.content" :sty="ueStyle" id="articleEditor"></editor>
            </el-row>
            
        </el-form>

        <!--预览弹窗-->
        <el-dialog
            title="预览"
            top="1vh"
            :model="true"
            :visible.sync="showPreview"
            width="375"
            :before-close="handleClose">
            <preview v-if="showPreview" :id="form.id"></preview>
            </el-dialog>
    </div>
</template>

<script>
import editor from "../ueditor"
import preview from "../articlePreview"
import { mapGetters, mapMutations } from "vuex";
export default {
    data()
    {
        return {
            // 自定义编辑器的样式
            ueStyle:{
                editorBg:"#a2a0a0"
            },

            // 预览控制
            showPreview:false,
            previewURL:null,
        }
    },
    props:["form"],
    components:{
        editor,
        preview,
    },
    created(){
        //this.previewURL = `/app#/?mid=${this.form.id}`
        // this.previewURL = `/app#/?mid=${this.form.id}`
        // this.reloadMobi();
        // var _this = this;
        // this.subscribe({
        //     showPreview(mid){
        //         _this.showPreview = true;
        //         _this.previewURL = `/app#/?mid=${mid}`
        //         console.log("显示预览");
        //     }
        // })
        //console.log(this.form.content,"content");
    },
    mounted()
    {

       // this.$refs.ue.setContent("ccccc");
    },
    methods:{
        ...mapMutations({
            subscribe:"subscribe"
        }),
        getContent()
        {
            this.form.content = this.$refs.ue.getContent();
            return this.form;
        },
        updateContent(content){
            this.form.content = content;
        },
        
    }
}
</script>

<style lang="less" scoped>
@import url("./articleEditor.less");
</style>
