<template>
    <div>
        role page
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  created() {
    //console.log("role created");
    this.init();
  },
  methods:{
      init(){
          console.log("role init",new Date());
      }
  }
};
</script>