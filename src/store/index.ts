import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // 容器的状态实现了数据共享，在组件内部访问很方便
  // 但是没有持久化的功能（刷新就没有了）
  state: {
    // 当前登录用户状态
    user: JSON.parse(window.localStorage.getItem("user") || "null")
  },
  mutations: {
    // 修改容器数据
    setUser(state, payload) {
      // state：本身
      // payload：用户传入数据
      state.user = JSON.parse(payload);

      // 为了防止页面刷新数据丢失，需要把 user 数据持久化
      // 注意：本地存储只能存储字符串
      window.localStorage.setItem("user", payload);
    }
  },
  actions: {},
  modules: {}
});
