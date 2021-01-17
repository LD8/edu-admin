import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => /* webpackChunkName: 'home' */ import('@/views/home/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => /* webpackChunkName: 'login' */ import('@/views/login/index.vue')
  },
  {
    path: '/role',
    name: 'role',
    component: () => /* webpackChunkName: 'role' */ import('@/views/role/index.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => /* webpackChunkName: 'menu' */ import('@/views/menu/index.vue')
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => /* webpackChunkName: 'resource' */ import('@/views/resource/index.vue')
  },
  {
    path: '/course',
    name: 'course',
    component: () => /* webpackChunkName: 'course' */ import('@/views/course/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => /* webpackChunkName: 'user' */ import('@/views/user/index.vue')
  },
  {
    path: '/advert',
    name: 'advert',
    component: () => /* webpackChunkName: 'advert' */ import('@/views/advert/index.vue')
  },
  {
    path: '/advert-space',
    name: 'advert-space',
    component: () => /* webpackChunkName: 'advert-space' */ import('@/views/advert-space/index.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => /* webpackChunkName: '404' */ import('@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
