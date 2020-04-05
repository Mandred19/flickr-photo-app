
export default {
  modules: {},
  state: {
    appIsLoad: false,
    mobile: {
      isMobile: false,
      windowWidth: null,
    },
  },
  getters: {
    getIsMobile(state) {
      return state.mobile.isMobile;
    },
    getWindowWidth(state) {
      return state.mobile.windowWidth;
    },
    getAppIsLoad(state) {
      return state.appIsLoad;
    },
  },
  mutations: {
    setIsMobile(state, val) {
      state.mobile.isMobile = val;
    },
    setWindowWidth(state, val) {
      state.mobile.windowWidth = val;
    },
    setAppIsLoad(state, val) {
      state.appIsLoad = val;
    },
  },
  actions: {
    detectIsMobile({ commit }) {
      commit('setIsMobile', ((window.clientWidth || window.innerWidth) < 768));
      commit('setWindowWidth', (window.clientWidth || window.innerWidth));
    },
  },
};
