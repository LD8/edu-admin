<template>
  <div class="login">
    <h1>系 统 登 录</h1>
    <el-form
      label-position="top"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { login } from "@/services/user";
import Vue from "vue";
import { Form } from "element-ui";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    return {
      form: {
        phone: "18201288771",
        password: "111111"
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "密码长度6~18个字符", trigger: "blur" }
        ]
      },
      isLoginLoading: false
    };
  },
  methods: {
    async onSubmit() {
      // 登录按钮 loading
      this.isLoginLoading = true;

      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate();
        // 因为上面 validate 返回一个 Promise，如果验证失败 reject 则下面的代码都不会执行

        // 2. 验证通过 - 提交表单
        const { data } = await login(this.form);
        // 3. 处理请求结果
        if (data.state !== 1) {
          // 登录失败：给出提示
          this.$message.error(data.message);
        } else {
          // 登陆成功后记录登录状态，状态需要能够全局使用
          // 1. 将登录状态记录到 Vuex 容器中
          this.$store.commit("setUser", data.content);
          // 2. 然后再访问需要登录的页面时判断登录状态（使用路由拦截器）
          // 登录成功：跳转到首页
          // 如果有 query 项，则获取 redirect 路由
          this.$router.push(this.$route.query.redirect as string || "/");
          this.$message.success("登陆成功");
        }
      } catch (err) {
        console.log("登录失败", err);
      }

      this.isLoginLoading = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    text-align: center;
    margin-bottom: 40px;
    color: grey;
    text-shadow: 0 0 5px rgb(211, 211, 211);
  }
  .el-form {
    background: white;
    padding: 20px 80px;
    border-radius: 10px;
    width: 350px;
    box-shadow: 0 0 20px rgb(198, 198, 198);
    margin-bottom: 200px;
    .el-button {
      width: 100%;
      margin-top: 30px;
    }
  }
}
</style>
