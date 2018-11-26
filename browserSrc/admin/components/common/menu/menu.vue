<template>
  <div>
      <Dropdown @on-click="fileItemClick" >
        <a href="javascript:void(0)">
            文件
            <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem name="logout" key="logout">  登出</DropdownItem>
            <DropdownItem>导出文档</DropdownItem>
            <DropdownItem disabled>豆汁儿</DropdownItem>
            <DropdownItem>关闭文档</DropdownItem>
            <DropdownItem divided>北京烤鸭</DropdownItem>
        </DropdownMenu>
    </Dropdown>

    <Dropdown @on-click="insertClick" class="menu-item">
        <a href="javascript:void(0)">
            插入
            <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu  slot="list">
            <DropdownItem name="addDataGrid" @click="addDataGrid">
                <Icon  class="icon" type="grid"></Icon>
                 添加表格
            </DropdownItem>

            <DropdownItem>添加图表</DropdownItem>
            <DropdownItem>添加管道</DropdownItem>

        </DropdownMenu>
    </Dropdown>
    
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import cookie from "js-cookie";
export default {
  computed: {
    //   ...mapGetters({
    //       subscribe:"subscribe"
    //   })
  },
  methods: {
    ...mapMutations({
      publish: "publish",
      subscribe: "subscribe"
    }),
    insertClick(name) {
      //   switch (name) {
      //     case "addDataGrid":
      //       this.addDataGrid();
      //       break;
      //   }
      //console.log(name);
      this.$http.post("/public/test", {}).then(data => {
        try {
          this.publish({
            sysMsg: data
          });
          //cookie.set("login", 0);
          // this.$router.push({
          //   name: "login"
          // });
          console.log(data);
        } catch (err) {
          this.publish({
            sysMsg: err
          });
        }
      });
    },
    fileItemClick(key) {
      if (confirm("确认要退出登录吗？")) {
        this.$http.post("/public/logout", {}).then(data => {
          try {
            this.publish({
              sysMsg: data
            });
            cookie.set("login", 0);
            this.$router.push({
              name: "login"
            });
          } catch (err) {
            this.publish({
              sysMsg: err
            });
          }
        });
      }
    },
    addDataGrid() {
      this.publish({
        addDataGrid: {
          name: "121214"
        }
      });
    }
  }
};
</script>

<style scoped>
.menu-item {
  margin-left: 20px;
}
.menu-item .icon {
  margin-right: 4px;
}
</style>

