const state = {
    categories: [],
    posts: {}
  }, mutations = {
    ADD_CATEGORIES: (state, values) => {
      state.categories = values
      values.forEach((v) => {
        state.posts[Number(v.id)] = []
      })
    },
    ADD_CATEGORY: (state, value) => {
      state.categories.push(value)
      state.posts[Number(value.id)] = []
    },
    REMOVE_CATEGORY: (state, id) => {
      state.categories = state.categories.filter((c) => {
        return Number(c.id) !== Number(id)
      })
      delete state.posts[Number(id)]
    },
    ADD_POST: (state, { categoryId, post }) => {
      state.posts[Number(categoryId)].push(post)
    }
  }, actions = {
    GET_CATEGORIES: (context, app) => {
      app.$axios.get(`/category`).then(({ data }) => {
        if (data.total_count > 0) {
          context.commit('ADD_CATEGORIES', data.data)
        }
      })
    },
    REMOVE_CATEGORY: (context, { app, id }) => {
      return app.$axios.delete(`/category/${id}`).then(() => {
        context.commit('REMOVE_CATEGORY', id)
      })
    }
  }, getters = {
    CATEGORIES: (state) => {
      return state.categories
    }
  }

export default {
  state,
  actions,
  mutations,
  getters
}
