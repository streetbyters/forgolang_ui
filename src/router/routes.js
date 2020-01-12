
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/Admin/Index.vue'), meta: { requiresAuth: true } },
      { path: 'category', component: () => import('pages/Admin/Category/All.vue'), meta: { requiresAuth: true } },
      { path: 'category/new', component: () => import('pages/Admin/Category/New.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Base.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth/login', component: () => import('pages/Auth/Login.vue') },
      { path: '/:categorySlug', component: () => import('pages/Category/Show.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
