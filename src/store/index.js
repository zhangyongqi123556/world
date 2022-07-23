import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* 用于在登录成功后保存用户信息 */
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    /* 存储用户数据 */
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 通过本地存储对 user 进⾏数据持久化
      // - 注意，本地存储只能保存字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
