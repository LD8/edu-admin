<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程：</span><br />
        <span>阶段：</span><br />
        <span>课时：</span>
      </div>
      <el-form>
        <el-form-item label="视频上传"
          ><input ref="video-file" type="file"
        /></el-form-item>
        <el-form-item label="封面上传"
          ><input ref="image-file" type="file"
        /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
          <el-form-item>
            <p>视频上传中:{{ uploadePercent }}%</p>
            <p v-if="isUploadSuccess">
              视频转码中:{{ isTransCodeSuccess ? "转码完成" : "正在转码..." }}%
            </p>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getAliyunImageUploadAddressAndAuth,
  getAliyunVideoUploadAddressAndAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from "@/services/aliyun-upload";

export default Vue.extend({
  name: "CourseVideo",
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      uploader: null,
      imageURL: "",
      videoId: null,
      uploadPercent: 0,
      isUploadedSuccess: false,
      isTransCodeSuccess: false,
      form: {}
    };
  },
  computed: {
    video(): any {
      return this.$refs["video-file"];
    },
    image(): any {
      return this.$refs["image-file"];
    }
  },
  created() {
    this.loadCourse();
    // 初始化【上传器】
    this.initUploader();
  },
  methods: {
    async loadCourse() {
      return null;
    },
    initUploader() {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值，负责开发的后端同事给到你
        userId: "1618139964448548",
        // 上传到视频点播的地域，默认值为'cn-shanghai'，// eu-central-1，ap-southeast-1
        region: "",
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          // 1. 通过我们的后端获取文件上传凭证
          let uploadAddressAndAuth: any;
          if (uploadInfo.isImage) {
            // 获取【图片】上传凭证，为【视频】上传接口的 imageUrl 服务
            const { data } = await getAliyunImageUploadAddressAndAuth();
            this.imageURL = data.data.imageURL;
            uploadAddressAndAuth = data.data;
          } else {
            // 获取【视频】上传凭证
            const { data } = await getAliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              // 这里拿到的就是已经上传的【图片】url
              imageUrl: this.imageURL
            });
            uploadAddressAndAuth = data.data;
            this.videoId = uploadAddressAndAuth.videoId;
          }
          // 2. 设置上传凭证: uploader.setUploaderAuthAndAddress(uploadFileInfo, uploadAuth, uploadAddress,videoId)
          (this.uploader as any).setUploaderAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          );
          // 3. 设置好上传凭证并确认无误，则上传进度开始
        },
        // 文件上传成功
        // onUploadSucceed: function(uploadInfo: any) {},
        // 文件上传失败
        // onUploadFailed: function(uploadInfo: any, code: any, message: any) {},
        // 文件上传进度，单位：字节
        onUploadProgress: (
          uploadInfo: any,
          totalSize: any,
          loadedPercent: any
        ) => {
          if (!uploadInfo.isImage) {
            // 是视频
            this.uploadPercent = Math.floor(loadedPercent * 100);
          }
        },
        // 上传凭证超时
        // onUploadTokenExpired: function(uploadInfo: any) {},
        // 全部文件上传结束（多个文件）
        onUploadEnd: async () => {
          this.isUploadedSuccess = true;
          // 全部上传好了以后开始请求转码
          await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: (this.video as any).files[0].name,
            fileId: this.videoId
          });

          // 轮寻转码进度：每 3 秒
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(
              this.$route.query.lessonId
            );
            if (data.data === 100) {
              this.isTransCodeSuccess = true;
              // 转码成功
              window.clearInterval(timer);
            }
          }, 3000);
        }
      });
    },
    handleUpload() {
      // 初始化上传状态
      this.isUploadedSuccess = false;
      this.isTransCodeSuccess = false;
      this.uploadPercent = 0;
      // 获取上传文件
      const videoFile = this.video.files[0];
      const imageFile = this.image.files[0];
      const uploader = this.uploader as any;

      // 将用户选择的文件【添加】到【上传列表】中：调用 uploader 实例方法 addFile
      uploader.addFile(imageFile, null, null, null, "{'Vod':{}}");
      // 【注意】因为要先获取到封面图片，才能为视频增加封面，所以一定要先上传上面的 imageFile
      uploader.addFile(videoFile, null, null, null, "{'Vod':{}}");

      // 开始上传：一旦开始上传，会按照上面的声明顺序开始进行上传工作，即，触发 onUploadstarted 事件
      uploader.startUpload();
    }
  }
});
</script>

<style scoped></style>
