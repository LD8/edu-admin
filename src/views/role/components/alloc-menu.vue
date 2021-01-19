<template>
  <el-card>
    <div slot="header">
      <span>分配菜单权限</span>
      <div></div>
    </div>
    <el-tree
      ref="menuTree"
      :data="menus"
      :props="defaultProps"
      node-key="id"
      :default-checked-keys="checkedKeys"
      show-checkbox
      default-expand-all
    ></el-tree>
    <div style="text-align: center">
      <el-button @click="resetChecked">清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getMenuNodeList,
  allocateRoleMenus,
  getRoleMenus
} from "@/services/menu";
import { Tree } from "element-ui";

export default Vue.extend({
  name: "AllocMenu",
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      menus: [],
      defaultProps: {
        // data 中哪个 key 是指 children
        children: "subMenuList",
        label: "name"
      },
      checkedKeys: []
    };
  },
  created() {
    this.loadMenus();
    this.loadRoleMenus();
  },
  methods: {
    async loadMenus() {
      const { data } = await getMenuNodeList();
      this.menus = data.data;
    },
    async loadRoleMenus() {
      const { data } = await getRoleMenus(this.roleId);
      this.getCheckedKeys(data.data);
    },
    getCheckedKeys(menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id] as any;
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList);
        }
      });
    },
    async onSave() {
      // 拿到选中节点的数据 id 列表
      // getCheckedKeys 拿到的就是 el-tree 标签中定义的 node-key
      const menuIdList = (this.$refs.menuTree as Tree).getCheckedKeys();
      // 请求提交保存
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      });
      this.$message.success("修改菜单权限成功");
      this.$router.back();
    },
    resetChecked() {
      (this.$refs.menuTree as Tree).setCheckedKeys([]);
    }
  }
});
</script>

<style scoped></style>
