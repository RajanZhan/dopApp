<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                        <FormItem prop="vcode">
                            <Input type="text" v-model="form.vcode" placeholder="请输入验证码">
                                <span slot="prepend">
                                    <Icon :size="14" type="ios-paw"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        
                        <FormItem>
                            <img @click="updateVcode"  :src="vcodeUrl">
                        </FormItem>

                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import util from "../../libs/utils";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      vcodeUrl: "/public/getVcodeImg?" + Math.random(),
      form: {
        userName: "admin",
        password: "",
        vcode: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        vcode: [{ required: true, message: "验证码不能为空", trigger: "blur" }]
      }
    };
  },
  components: {},
  created() {
    document.title = "登录";
    this.form.password = localStorage.getItem("pwd")
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapMutations({
      publish: "publish"
    }),

    // 更新验证码
    updateVcode() {
      this.vcodeUrl = "/public/getVcodeImg?" + Math.random();
    },
    handleSubmit() {
      var _this = this;
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          Cookies.set("user", this.form.userName);
          Cookies.set("password", this.form.password);
          try {
            let res = await this.$http.post("/public/login", {
              uname: _this.form.userName,
              pwd: _this.form.password,
              vcode: _this.form.vcode
            });
            this.publish({ sysMsg: res });
            Cookies.set("login", 1);
            localStorage.setItem("pwd",this.form.password)
            this.$router.push({
                name:"index"
            })
          } catch (err) {
            this.updateVcode();
            this.publish({ sysMsg: err });
            // this.$Notice.warning({
            //   title: "提示",
            //   desc: err.data
            // });
          }
          // this.$router.push({
          //     name: 'home_index'
          // });
        }
      });
    }
  }
};
</script>

<style>
</style>
