<template>
  <div>
    hello_1  {{count }}
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "000",
      count:0,
    };
  },
  created(){
      var _this = this;
      setInterval(()=>{
          _this.count ++
      },1000)
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
