<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'App',
  computed: {
    loggedIn () {
      return this.$store.getters.LOGGED_IN
    }
  },
  mounted () {
    if (this.$axios.getCookie('token') !== null) {
      const jwt = jwtDecode(this.$axios.getCookie('token'))
      this.$store.commit('SET_AUTH', {
        loggedIn: true,
        userId: jwt.id,
        role: jwt.role
      })
      this.$axios.token = this.$axios.getCookie('token')
    }
  },
  watch: {
    loggedIn () {
      const self = this
      if (self.loggedIn) {
        this.$axios.get(`/user/${this.$store.getters.AUTH.userId}`).then(({ data }) => {
          self.$store.commit('SET_USER', data.data)
        })
      }
    }
  }
}
</script>
