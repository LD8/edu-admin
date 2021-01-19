<template>
  <el-card>
    <div slot="header">
      <span>用户管理</span>
    </div>
    <user-list />
  </el-card>
</template>

<script>
import Vue from "vue";
import UserList from "./components/UserList.vue";

export default Vue.extend({
  name: "UserIndex",
  components: {
    UserList
  }
});
</script>

<style scoped></style>
