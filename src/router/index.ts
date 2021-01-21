import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: () =>
      /* webpackChunkName: 'login' */ import("@/views/login/index.vue")
  },
  {
    path: "*",
    name: "404",
    component: () =>
      /* webpackChunkName: '404' */ import("@/views/error-page/404.vue")
  },
  {
    path: "/",
    component: Layout,
    meta: {
      // 自定义数据，需要验证用户信息（token）
      requiresAuth: true
    },
    children: [
      {
        path: "",
        name: "home",
        component: () =>
          /* webpackChunkName: 'home' */ import("@/views/home/index.vue")
      },
      {
        path: "/role",
        name: "role",
        component: () =>
          /* webpackChunkName: 'role' */ import("@/views/role/index.vue")
      },
      {
        path: "/role/:roleId/alloc-menu",
        name: "alloc-menu",
        component: () =>
          /* webpackChunkName: 'alloc-menu' */ import(
            "@/views/role/components/alloc-menu.vue"
          ),
        // 将路由路径参数映射到组件的 props 中
        // 这样成功将组件与路由解耦，组件可以从父级组件中获取 props 也可以从路由中获取
        props: true
      },
      {
        path: "/menu",
        name: "menu",
        component: () =>
          /* webpackChunkName: 'menu' */ import("@/views/menu/index.vue")
      },
      {
        path: "/resource",
        name: "resource",
        component: () =>
          /* webpackChunkName: 'resource' */ import(
            "@/views/resource/index.vue"
          )
      },
      {
        path: "/course",
        name: "course",
        component: () =>
          /* webpackChunkName: 'course' */ import("@/views/course/index.vue")
      },
      {
        path: "/course/create",
        name: "course-create",
        component: () =>
          import(
            /* webpackChunkName: 'course-create' */ "@/views/course/create.vue"
          )
      },
      {
        path: "/course/:courseId/edit",
        name: "course-edit",
        component: () =>
          import(
            /* webpackChunkName: 'course-edit' */ "@/views/course/edit.vue"
          ),
        props: true
      },
      {
        path: "/course/:courseId/section",
        name: "course-section",
        component: () =>
          import(
            /* webpackChunkName: 'course-section' */ "@/views/course/section.vue"
          ),
        props: true
      },
      {
        path: "/course/:courseId/video",
        name: "course-video",
        component: () =>
          import(
            /* webpackChunkName: 'course-video' */ "@/views/course/video.vue"
          ),
        props: true
      },
      {
        path: "/user",
        name: "user",
        component: () =>
          /* webpackChunkName: 'user' */ import("@/views/user/index.vue")
      },
      {
        path: "/advert",
        name: "advert",
        component: () =>
          /* webpackChunkName: 'advert' */ import("@/views/advert/index.vue")
      },
      {
        path: "/advert-space",
        name: "advert-space",
        component: () =>
          /* webpackChunkName: 'advert-space' */ import(
            "@/views/advert-space/index.vue"
          )
      },
      {
        path: "/menu/create",
        name: "menu-create",
        component: () =>
          /* webpackChunkName: 'menu-create-edit' */ import(
            "@/views/menu/create.vue"
          )
      },
      {
        path: "/menu/:id/edit",
        name: "menu-edit",
        component: () =>
          /* webpackChunkName: 'menu-create-edit' */ import(
            "@/views/menu/edit.vue"
          )
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

// 全局前置路由守卫，任何页面的访问都要经过这里
// to: 要去哪里的路由信息
// from：从哪里来的路由信息
// next：同行的标志
router.beforeEach((to, from, next) => {
  // to.matched 是一个数组（匹配到的路由记录）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // 跳转到登录页面
      return next({
        name: "login",
        // 通过 url 传递查询字符串参数
        query: {
          // 把登录成功需要返回的页面用 query 的方法告诉 login 登录页面
          redirect: to.fullPath
          // 再在 login 页面获取 $route.query.redirect 参数
          // 每个页面都有一个 $route 对象
        }
      });
    }
  }
  next();
});

export default router;
