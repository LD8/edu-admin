import store from "@/store";
import axios from "axios";

const request = axios.create({
  // 配置选项
});

// 请求拦截器
request.interceptors.request.use(
  // 接口请求通过
  function(config) {
    // Do something before request is sent
    const { user } = store.state;
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token;
    }
    return config;
  },
  // 接口请求有误
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 相应拦截器
request.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;
