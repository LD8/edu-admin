<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from "vue";
import E from "wangeditor";
import { uploadCourseImage } from "@/services/course";

export default Vue.extend({
  name: "TextEditor",
  props: {
    // 拿取父组件传入的 v-model 对象
    value: {
      type: String,
      default: "",
    },
  },
  // 组件已经渲染好，可以初始化操作 DOM 了
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const editor = new E(this.$refs.editor as any);
      // 注意：事件监听必须在 create 之前
      editor.config.onchange = (value: string) => {
        // 将变化的数据同步给父组件 v-model 的对象
        this.$emit("input", value);
      };

      editor.create();

      // 注意：设置初始化必须在 create 之后
      editor.txt.html(this.value);

      // 自己实现上传功能（而不是使用编辑器的配置接口 http://doc.wangeditor.com）
      editor.config.customUploadImg = async function(
        // resultFiles 是 input 中选中的文件列表
        resultFiles: any,
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        insertImgFn: any
      ) {
        // 1. 把用户选择的 resultFiles 上传到服务器，会返回该文件的 url
        // 接口要求必须传入 FormData 格式的文件
        const fd = new FormData();
        // 接口要求必须传入 `file` 为 key 的文件
        fd.append("file", resultFiles[0]);
        // 上传图片，返回结果
        const { data } = await uploadCourseImage(fd);

        // 根据图片生成的 img 标签插入到富文本编辑器中
        insertImgFn(data.data.name);
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
