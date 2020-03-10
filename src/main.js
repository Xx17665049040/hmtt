import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//导入vant所有组件
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);

//导入font字体图标
import '@/style/font.css'

//导入基础样式
import '@/style/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
