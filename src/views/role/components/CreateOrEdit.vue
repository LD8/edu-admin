<template>
  <div>
    <el-form ref="form" :model="role">
      <el-form-item label="角色名称" prop="name">
        <el-input clearable v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input clearable v-model="role.code" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input
          type="textarea"
          clearable
          v-model="role.description"
          placeholder="请输入角色描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createOrUpdate, getRoleById } from "@/services/role";

export default Vue.extend({
  name: "CreateOrEditRole",
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      role: {
        name: "",
        code: "",
        description: ""
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.loadRole();
    }
  },
  methods: {
    async onSubmit() {
      const { data } = await createOrUpdate(this.role);
      if (data.code === "000000") {
        this.$message.success("成功创建角色");
        this.$emit("success");
      }
    },
    async loadRole() {
      const { data } = await getRoleById(this.roleId);
      // 这里的 role 会有 id 等多个属性，在调用 createOrUpdate 接口时会传入 id
      // 以此方式决定是 create 还是 update
      this.role = data.data;
    }
  }
});
</script>

<style lang="scss" scoped></style>
