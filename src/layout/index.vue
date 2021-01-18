<template>
  <el-container>
    <el-aside width="200px"><app-aside /></el-aside>
    <el-container>
      <el-header><app-header /></el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Vue from "vue";
import AppAside from "./components/app-aside";
import AppHeader from "./components/app-header";

export default Vue.extend({
  name: "Layout",
  components: {
    AppAside,
    AppHeader
  }
});
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}
.el-aside {
  background: rgb(227, 227, 227);
}
.el-header {
  background: rgb(218, 218, 218);
}
.el-main {
  background: rgb(233, 233, 233);
}
</style>
