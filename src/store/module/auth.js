const state = {
    loggedIn: false,
    userId: 0,
    role: '',
    user: {}
  },
  mutations = {
    SET_AUTH: (state, auth) => {
      state.loggedIn = auth.loggedIn
      state.userId = auth.userId
      state.role = auth.role
    },
    SET_USER: (state, user) => {
      state.user = user
    }
  }, getters = {
    AUTH: (state) => {
      return {
        loggedIn: state.loggedIn,
        userId: state.userId,
        role: state.role
      }
    },
    LOGGED_IN: (state) => {
      return state.loggedIn
    },
    USER: (state) => {
      return state.user
    },
    ROLE: (state) => {
      return state.role
    }
  }

export default {
  state,
  mutations,
  getters
}
