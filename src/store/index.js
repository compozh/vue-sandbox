import Vue from 'vue'
import Vuex from 'vuex'
import formio from "../formio/formiostore/store";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    [formio.namespace]: formio
  }
})
