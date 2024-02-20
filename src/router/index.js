import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    children: [
      {
        path: 'ProductList',
        component: () => import('../views/ProductListView.vue')
      },
      {
        path: 'ArticleList',
        component: () => import('../views/ArticleListView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
