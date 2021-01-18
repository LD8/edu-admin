<template>
  <div class="login">
    <h1>系 统 登 录</h1>
    <el-form label-position="top" ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    return {
      form: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
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
