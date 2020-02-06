const state = {
    posts: []
  }, mutations = {
    ADD_POST: (state, value) => {
      state.posts.push(value)
    }
  }, actions = {
    CREATE_POST: (context, { app, data }) => {
      return app.$axios.post(`/post`, data).then(({ data }) => {
        state.posts.push(data)
      })
    }
  }, getters = {
    POSTS: (state) => {
      return state.posts
    }
  }

export default {
  state,
  actions,
  mutations,
  getters
}
