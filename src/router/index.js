import Vue from 'vue'
import VueRouter from 'vue-router'

//导入组件
import login from '@/views/login/'
import layout from '@/views/layout/'
import home from '@/views/home/'
import video from '@/views/video/'
import question from '@/views/question/'
import mine from '@/views/mine/'






Vue.use(VueRouter)

const routes = [
    {path:"/",component:login},
    {path:"/login",component:login},
    {path:"/layout",component:layout,
    children:[ 
      { path:"/home",component:home } ,
      { path:"/video",component:video},
      { path:"/mine",component:mine } ,
      { path:"/question",component:question } ,
    ]},


]

const router = new VueRouter({
  routes
})

export default router
