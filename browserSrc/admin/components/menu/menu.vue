<template>
    <div>
        <div class="menu">
            <div class="item" v-for="(menu ,index) in menu" :key="index">
                <MenuButton v-if="menu.menu" :text="menu.name" :plain="true" :iconCls="menu.icon">
                    <Menu @itemClick="onItemClick($event)">
                        <MenuItem   v-for="(mitem,index1 ) in menu.menu" :key="index1"
                         :iconCls="mitem.icon" :value="mitem.value" :text="mitem.name">
                            <SubMenu v-if="mitem.menu">
                                <MenuItem  v-for="(sitem,index2 ) in mitem.menu" :key="index2" :value="sitem.value" :text="sitem.name">
                                </MenuItem>
                            </SubMenu>
                        </MenuItem>
                    </Menu>
                </MenuButton>
                <LinkButton v-else @click="onItemClick(menu.value)"  :iconCls="menu.icon" :plain="true">{{ menu.name }}</LinkButton>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      
    };
  },
  props:["menu"],
 
  methods: {
    onItemClick(event) {
        console.log(event,"item click");
        this.$emit("menuClick",event);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./menu.less");
</style>
