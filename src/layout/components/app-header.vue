<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        ></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout"
          >退出</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { getUserInfo } from "@/services/user";
import Vue from "vue";

export default Vue.extend({
  name: "AppHeader",
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      const { data } = await getUserInfo();
      this.userInfo = data.content;
    },
    handleLogout() {
      // 退出提示
      this.$confirm("确认退出吗?", "提示退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 清楚登录状态
          this.$store.commit("setUser", null);
          // 跳转到登录页面
          this.$router.push({ name: "login" });
          this.$message({
            type: "success",
            message: "成功退出"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "退出取消"
          });
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
    .el-avatar {
      box-shadow: 0 0 5px grey;
    }
  }
}
</style>
