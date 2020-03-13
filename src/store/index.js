import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { getLocal } from '@/utils/local.js'

export default new Vuex.Store({
  state: {
    // 从localStorage里面存的token 来拿 这样就不会刷新就没token数据了   记得将字符串 转为对象
    // token: JSON.parse( window.localStorage.getItem('tokenInfo')).token,
    // refresh_token:JSON.parse( window.localStorage.getItem('tokenInfo')).refresh_token

    //已经封装
    // token:getLocal('tokenInfo').token,   //第一次登陆时 没有tokenInfo 这里会出错(Cannot read property 'token' of null) ,  可以用三元
    // refresh_token:getLocal('tokenInfo').refresh_token,
    // 三元解决
    // token:getLocal('tokenInfo') ? getLocal('tokenInfo').token : ""  ,  //如果有getLocal('tokenInfo') 就取他的token  没有就赋值空
    // refresh_token:getLocal('tokenInfo') ? getLocal('tokenInfo').refresh_token : "",

    //逻辑与 解决   如果有短路,整个逻辑表达式 取的是左边式子结果  , 如果有短路,取得是右边式子结果 . 
    token:getLocal('tokenInfo') && getLocal('tokenInfo').token,
    refresh_token:getLocal('tokenInfo') && getLocal('tokenInfo').refresh_token

  },


  mutations: {

    changeToken(state,token){

      state.token = token;
    },

    changeRefToken(state,token){

      state.refresh_token = token;
    }
  },
  actions: {
  },
  modules: {
  }
})
