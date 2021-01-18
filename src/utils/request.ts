import router from "@/router";
import store from "@/store";
import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";

const request = axios.create({
  // 配置选项
});
// 请求拦截器
request.interceptors.request.use(
  function(config) {
    // 接口请求通过
    // Do something before request is sent
    const { user } = store.state;
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token;
    }
    return config;
  },
  function(error) {
    // 接口请求有误
    // Do something with request error
    return Promise.reject(error);
  }
);

function redirectLogin() {
  router.push({
    name: "login",
    query: { redirect: router.currentRoute.fullPath }
  });
}

function refreshToken() {
  // 单独创建 axios 请求实例，没有配置拦截器，避免死循环
  return axios.create()({
    method: "POST",
    url: "/front/user/refresh_token",
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  });
}

// 控制 refreshToken 的状态，防止多个请求同时刷新
let isRefreshing = false;
// 存储 refreshToken 期间过来的 401 请求
let requests: Array<() => void> = [];
// 响应拦截器
request.interceptors.response.use(
  function(response) {
    // 如果是自定义【状态码】错误处理就直接写在这
    return response;
  },
  async function(error) {
    // 如果使用 HTTP 状态码，错误处理就写在这
    // axios 文档：https://github.com/axios/axios#interceptors
    if (error.response) {
      // 有请求结果，但请求并不成功，HTTP 状态码 >= 400
      const { status } = error.response;
      switch (status) {
        case 400:
          Message.error("请求参数错误");
          break;
        case 401: {
          // token 无效（没有提供 token 或 token 无效/过期)
          // 获取不到 user
          if (!store.state.user) {
            redirectLogin();
            return Promise.reject(error);
          }
          // 如果没有正在刷新
          if (!isRefreshing) {
            // 开启刷新状态
            isRefreshing = true;
            // 尝试 refresh_token
            return refreshToken()
              .then(res => {
                // 判断刷新是否成功
                if (!res.data.success) {
                  throw new Error("刷新 Token 失败");
                  // 进入 catch
                }
                // 刷新成功 ->
                // 把新拿到的 access_token 更新到 store 容器和本地存储中
                store.commit("setUser", res.data.content);
                // 用户有了新的 token -> 重新发出 requests 队列中的所有请求
                requests.forEach(cb => cb());
                // 重置 requests 数组，否则每次刷新会反复积压请求
                requests = [];
                // 再把本次失败的请求重新发出去，`error.config` 就是失败请求的配置信息
                return request(error.config);
                // 完成【无痛刷新】
              })
              .catch(err => {
                // 刷新失败 ->
                // 把当前用户信息登录状态清除
                store.commit("setUser", null);
                // 跳转登录页，重新登录获取新 token
                redirectLogin();
                return Promise.reject(err);
              })
              .finally(() => {
                // 重置刷新状态，方便发送下一个请求（多个请求时）
                isRefreshing = false;
              });
          }

          // 如果其他请求正在刷新 token，则把请求转化成 Promise 挂起，放入 requests，直到用户有了新的 token
          return new Promise(resolve => {
            requests.push(() => {
              resolve(request(error.config));
            });
          });
        }
        case 403:
          Message.error("没有权限，请联系管理员");
          break;
        case 404:
          Message.error("请求的资源不存在");
          break;
        default:
          Message.error("服务端错误，请联系管理员");
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
      Message.error("请求超时，请刷新重试");
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log("Error", error.message);
      Message.error(`请求失败：${error.message}`);
    }
    // console.log(error.config);
    // 把请求失败的错误对象继续抛出，扔给下一个调用
    return Promise.reject(error);
  }
);

export default request;
