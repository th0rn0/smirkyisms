import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    title: 'Smirkyisms',
    component: Home
  },
  {
    path: '/images',
    name: 'Images',
    title: 'Smirkyisms',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/images/Index.vue')
  },
  {
    path: '/images/:id',
    name: 'Images',
    title: 'Smirkyisms',
    component: () => import(/* webpackChunkName: "about" */ '../views/images/Show.vue')
  },
  {
    path: '/quotes',
    name: 'Quotes',
    title: 'Smirkyisms',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/quotes/Index.vue')
  },
  {
    path: '/quotes/:id',
    name: 'Quote',
    title: 'Smirkyisms',
    component: () => import(/* webpackChunkName: "about" */ '../views/quotes/Show.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    title: 'Smirkyisms',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
