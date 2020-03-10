import Vue from 'vue'
import VueRouter from 'vue-router'

//导入组件
import login from '@/views/login/'
import home from '@/views/home/'


Vue.use(VueRouter)

const routes = [
    {path:"/",component:login},
    {path:"/login",component:login},
    {path:"/home",component:home}

]

const router = new VueRouter({
  routes
})

export default router
