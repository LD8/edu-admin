/**
 * 阿里云上传相关请求模块
 */

import request from "@/utils/request";

// 获取上传【图片】的凭证
export const getAliyunImageUploadAddressAndAuth = () => {
  return request({
    method: "GET",
    url: "/boss/course/upload/getAliyunImageUploadAddressAdnAuth"
  });
};

// 获取上传【视频】的凭证
export const getAliyunVideoUploadAddressAndAuth = (params: any) => {
  return request({
    method: "GET",
    url: "/boss/course/upload/getAliyunVideoUploadAddressAdnAuth",
    params
  });
};

// 获取【视频】转码
export const aliyunTransCode = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/upload/aliyunTransCode",
    data
  });
};

// 获取【视频】转码进度
export const getAliyunTransCodePercent = (lessonId: any) => {
  return request({
    method: "GET",
    url: "/boss/course/upload/aliyunTransCodePercent",
    params: {
      lessonId
    }
  });
};
