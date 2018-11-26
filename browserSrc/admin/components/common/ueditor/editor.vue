<template>
  <div style="height:550px;overflow-y:auto;">
       <script :id="id" style="height:420px;overflow-y:auto;background:#b9b5b5"  type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      content: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
      sty:{
        type:Object,
      }
    },
    //props:["id","config","defaultMsg","sty"],
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id); // 初始化UE
      this.editor.addListener("ready", function () {
        
        if(_this.content)
        {
          _this.editor.setContent(_this.content); // 确保UE加载完成后，放入内容。
        }
        
        // 自定义修改ue编辑器样式
        _this._changeStyle();
        
      });
      this.editor.addListener("contentChange",(value)=>{
        _this.content = value;
        _this.$emit("changed",_this.getContent())
        //console.log("changed");
      })
      //console.log("上传这堆错误不用理会，上传接口需自行开发配置");
    },
    methods: {
      _changeStyle(){
        var _this = this;
        if(!this.sty)
        {
          console.log("style 为空");
          return;
        }
        if(this.sty.editorBg)
        {
          var timer = setInterval(()=>{
            
            //let dom = document.getElementById("ueditor_0");
            let dom =  $("#"+ _this.id).find("iframe").contents().find("body")
            if(dom){
              clearInterval(timer)   
              dom.css({
                background:this.sty.editorBg
              });
              //console.log("修改样式");
            }
            
          },100)
          
        }
        
      },
      getContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      setContent(value){
        this.editor.setContent(value);
      },
    },
    destroyed() {
      if(this.editor)
      {
        this.editor.destroy();
      }
    }
  }
</script>
<style>
</style>
