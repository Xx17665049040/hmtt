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
    token:getLocal('tokenInfo').token,
    refresh_token:getLocal('tokenInfo').refresh_token
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
