module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: "@import \"~@/styles/variables.scss\";"
      }
    }
  },
  // 配置代理跨域（后端和前端不是 host 在一台主机上的）
  devServer: {
    proxy: {
      // 后端代理：所有以 /boss 开头的请求都会被指向 target/boss
      "/boss": {
        target: "http://eduboss.lagou.com",
        // 把请求头中的 host 配置为 target
        changeOrigin: true
      },
      // 前端代理：所有以 /front 开头的请求都会被指向 target/front
      "/front": {
        target: "http://edufront.lagou.com",
        changeOrigin: true
      }
    }
  }
};
