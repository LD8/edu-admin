<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资源管理</span>
      </div>
      <!-- 查询表单 -->
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="资源名称" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入资源名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input
            v-model="searchForm.url"
            placeholder="请输入资源路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择资源分类"
            clearable
          >
            <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearchFormSubmit"
            :disabled="isLoading"
          >
            查询
          </el-button>
          <el-button @click="onSearchFormReset" :disabled="isLoading">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 列表内容 -->
      <el-table
        :data="resources"
        v-loading="isLoading"
        style="width: 100%; marginBottom: 20px"
      >
        <el-table-column type="index" label="编号"> </el-table-column>
        <el-table-column prop="name" label="资源名称"> </el-table-column>
        <el-table-column prop="url" label="资源路径"> </el-table-column>
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
          </template>
        </el-table-column>
      </el-table>
      <!--
        total 总记录数
        page-size 每页大小
        分页组件会自动根据 total 和 page-size 计算出一共多少页
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-sizes="[5, 10, 20]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getResourcePages } from "@/services/resource";
import { getResourceCategories } from "@/services/resource-category";
import { Form } from "element-ui";

export default Vue.extend({
  name: "ResourceList",
  data() {
    return {
      searchForm: {
        name: "",
        url: "",
        // 默认查询第 1 页数据
        current: 1,
        // 每页数据多少
        size: 5,
        // 资源分类
        categoryId: null
      },
      totalCount: 0,
      resources: [],
      resourceCategories: [],
      isLoading: false
    };
  },
  created() {
    this.loadResources();
    this.loadResourceCategories();
  },
  methods: {
    async loadResourceCategories() {
      const { data } = await getResourceCategories();
      this.resourceCategories = data.data;
    },
    async loadResources() {
      this.isLoading = true;
      const { data } = await getResourcePages(this.searchForm);
      // 改变每页数据多少后 + 筛选查询后，显示第一页数据
      this.searchForm.current = 1;
      this.resources = data.data.records;
      this.totalCount = data.data.total;
      this.isLoading = false;
    },
    onSearchFormSubmit() {
      // 筛选查询从第一页开始
      this.searchForm.current = 1;
      this.loadResources();
    },
    onSearchFormReset() {
      (this.$refs.searchForm as Form).resetFields();
      this.loadResources();
    },
    handleEdit(row: any) {
      this.$router.push({ name: "menu-edit", params: { id: row.id } });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleDelete(row: any) {
      this.$confirm("确认删除吗？", "删除提示", {})
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          // 确认
          // const { data } = await deleteMenu(row.id);
          // if (data.code === "000000") {
          //   this.$message.success("删除成功");
          //   // 更新数据列表
          //   this.loadAllMenu();
          // }
        })
        .catch(() => {
          // 取消
          this.$message.info("取消删除");
        });
    },
    handleSizeChange(val: number) {
      // console.log(`每页 ${val} 条`);
      this.searchForm.size = val;
      this.loadResources();
    },
    handleCurrentChange(val: number) {
      // console.log(`当前页: ${val}`);
      this.searchForm.current = val;
      this.loadResources();
    }
  }
});
</script>

<style lang="scss" scoped></style>
