<template>
    <div>
        <div style="text-align:center">
                <iframe id="preMobi" frameborder='1' scrolling='yes' :src="`/app#/?mid=${id}`" class="mobi"> </iframe>
            </div>

            <div style="text-align:right">
                <el-button @click="reloadMobi " size="mini">刷新</el-button>
                <el-button @click="qrcode " size="mini">二维码</el-button>
            </div>
            <el-dialog
            title="二维码"
            top="1vh"
            :model="true"
            :visible.sync="showQR"
            width="375"
            >
            <img v-if="showQR" :src="qrURL">
            </el-dialog>
    </div>
</template>
<script>

export default {
    data(){
        return {
            showQR:false,
            qrURL:""
        }
    },
    props:["id"],
    methods:{
        // 刷新预览
        reloadMobi()
        {
            if(document.getElementById('preMobi'))
            {
                document.getElementById('preMobi').contentWindow.location.reload(true);  

            }
            
        },
        qrcode(){
            this.showQR = true;
            this.qrURL = `/public/qr?text=http://${window.location.host}/app$/?mid=${this.id}`
            //console.log(this.qrURL);

        }
    }
}
</script>
<style scoped>
.mobi
{
    width: 375px;
    height: 667px;
    background: gray;
    
}
</style>


