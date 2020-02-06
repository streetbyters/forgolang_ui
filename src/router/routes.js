
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/Admin/Index.vue'), meta: { requiresAuth: true } },
      // Category routes
      { path: 'category', component: () => import('pages/Admin/Category/All.vue'), meta: { requiresAuth: true } },
      { path: 'category/new', component: () => import('pages/Admin/Category/New.vue'), meta: { requiresAuth: true } },
      { path: 'category/:id', component: () => import('pages/Admin/Category/Show.vue'), meta: { requiresAuth: true } },
      // User routes
      { path: 'user', component: () => import('pages/Admin/User/All.vue'), meta: { requiresAuth: true } }
      // { path: 'user/new', component: () => import('pages/Admin/User/New.vue'), meta: { requiresAuth: true } },
      // { path: 'user/:id', component: () => import('pages/Admin/User/Show.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Base.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth/login', component: () => import('pages/Auth/Login.vue') },
      { path: '/auth/register', component: () => import('pages/Auth/Register.vue') },
      { path: '/auth/confirmation/:userId/:code', component: () => import('pages/Auth/Confirmation.vue') },
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
