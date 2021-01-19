<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
        <!-- 查询表单 -->
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchForm"
          style="float: right; padding: 3px 0; position: relative; top: -13px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input
              size="small"
              clearable
              v-model="searchForm.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearchFormSubmit"
              :disabled="isLoading"
              size="small"
            >
              查询
            </el-button>
            <el-button
              @click="onSearchFormReset"
              :disabled="isLoading"
              size="small"
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 列表内容 -->
      <el-button @click="handleAdd" size="small">添加角色</el-button>
      <el-divider></el-divider>
      <el-table :data="roleData" style="width: 100%">
        <el-table-column type="index" label="编号"> </el-table-column>
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template></el-table-column
        >
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-sizes="[5, 10, 20]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
        style="marginTop: 20px"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <create-or-edit-role
        v-if="dialogVisible"
        :roleId="roleId"
        :isEdit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getRoles, deleteRole } from "@/services/role";
import CreateOrEditRole from "./CreateOrEdit.vue";
import { Form } from "element-ui";

export default Vue.extend({
  name: "RoleList",
  components: {
    CreateOrEditRole
  },
  data() {
    return {
      roleData: [],
      searchForm: {
        name: "",
        size: 5,
        current: 1
      },
      totalCount: 0,
      isLoading: false,
      // 显示/隐藏 modal
      dialogVisible: false,
      isEdit: false,
      roleId: null
    };
  },
  created() {
    this.loadRoles();
  },
  methods: {
    async loadRoles() {
      this.isLoading = true;
      const { data } = await getRoles(this.searchForm);
      this.roleData = data.data.records;
      this.totalCount = data.data.total;
      this.searchForm.current = 1;
      this.isLoading = false;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.roleId = null;
      this.isEdit = false;
    },
    handleEdit(row: any) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.roleId = row.id;
    },
    handleDelete(row: any) {
      this.$confirm("确认删除吗？", "删除提示", {})
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          // 确认
          const { data } = await deleteRole(row.id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            // 更新数据列表
            this.loadRoles();
          }
        })
        .catch(() => {
          // 取消
          this.$message.info("取消删除");
        });
    },
    onSearchFormSubmit() {
      this.loadRoles();
    },
    onSearchFormReset() {
      (this.$refs.searchForm as Form).resetFields();
      this.loadRoles();
    },
    handleSizeChange(val: number) {
      this.searchForm.size = val;
      this.loadRoles();
    },
    handleCurrentChange(val: number) {
      this.searchForm.current = val;
      this.loadRoles();
    },
    onSuccess() {
      this.dialogVisible = false;
      this.loadRoles();
    }
  }
});
</script>

<style lang="scss" scoped></style>
