import Vue from 'vue';
import Vuex from 'Vuex';
Vue.use(Vuex)

const state = {
    showInfoLoading: false //loading状态
}

const mutations = {
    SHOW_LOADING: state => state.showInfoLoading = true,
    HIDE_LOADING: state => state.showInfoLoading = false
}

export default new Vuex.Store({
    state,
    mutations
})