<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? "编辑菜单" : "添加菜单" }}</span>
      </div>
      <!-- 表单：添加菜单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createOrUpdateMenu, getEditMenuInfo } from "@/services/menu";
import { Form } from "element-ui";

export default Vue.extend({
  name: "MenuCreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      // 默认添加：不是编辑
      default: false,
    },
  },
  data() {
    return {
      form: {
        // -1 表示没有上级菜单
        parentId: -1,
        name: "",
        href: "",
        icon: "",
        description: "",
        show: false,
        orderNum: 0,
      },
      parentMenuList: [],
    };
  },
  created() {
    this.loadMenuInfo();
  },
  methods: {
    async loadMenuInfo() {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1);
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo;
      }
      if (data.code === "000000") {
        this.parentMenuList = data.data.parentMenuList;
      }
    },
    async onSubmit() {
      // 1. 表单验证
      await (this.$refs.form as Form).validate();

      // 2. 验证通过，提交表单
      const { data } = await createOrUpdateMenu(this.form);
      if (data.code === "000000") {
        this.$router.push({ name: "menu" });
        this.$message.success("成功新建菜单");
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
