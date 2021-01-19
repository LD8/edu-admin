/**
 * 用户相关请求模块
 */
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import qs from "qs";

interface User {
  phone: string
  password: string
}

export const login = (
  data: User
): AxiosPromise<{ state: number; message: string; content: string }> => {
  return request({
    method: "POST",
    url: "/front/user/login",
    // 声明请求头【内容类型】
    // headers: { "content-type": "application/x-www-form-urlencoded" },
    // 需使用 qs 模块转换 data 类型：因为
    // 普通对象 data 默认请求头传入 Content-Type: application/json
    // qs.stringify(data)转换后的数据：key=value&key=value...，
    // 这时传入请求头的 Content-Type: x-www-form-urlencoded
    // 所以上面的 headers 不需要再进行设置
    data: qs.stringify(data)
    // axios 默认发送的是 application/json 格式的数据

    // 还有一种情况：表单上传文件，data 是 HTML5 里新增的 FormData 对象，则
    // Content-Type: 默认为 form-data
  });
};

export const getUserInfo = () => {
  return request({
    method: "GET",
    url: "/front/user/getInfo"
  });
};

export const getUserPages = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/user/getUserPages",
    data
  });
};

export const forbidUser = (userId: string | number) => {
  return request({
    method: "POST",
    url: "/boss/user/forbidUser",
    params: {
      userId
    }
  });
};
