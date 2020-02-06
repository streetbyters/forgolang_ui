<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Forgolang.com | Admin
        </q-toolbar-title>

        <div>Forgolang {{ $axios.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-btn to="/" unelevated class="full-width">
        <img src="~assets/forgolang-short.png" alt="Forgolang.com">
      </q-btn>
      <q-list>
        <q-item-label header>Hi, {{user.username}}</q-item-label>
        <q-expansion-item
          :label="$t('categories')"
          :value="$route.path.search('category') > -1"
        >
          <q-item v-ripple exact :inset-level=".5" clickable tag="a" to="/admin/category">
            <q-item-section>
              <q-item-label class="text-black">{{ $t('all') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple exact :inset-level=".5" clickable tag="a" to="/admin/category/new">
            <q-item-section>
              <q-item-label class="text-black">{{ $t('new') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item
          :label="$t('users')"
          :value="$route.path.search('user') > -1"
        >
          <q-item v-ripple exact :inset-level=".5" clickable tag="a" to="/admin/user">
            <q-item-section>
              <q-item-label class="text-black">{{ $t('all') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple exact :inset-level=".5" clickable tag="a" to="/admin/user/new">
            <q-item-section>
              <q-item-label class="text-black">{{ $t('new') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
      <q-separator/>
      <q-list>
        <q-item clickable tag="a" @click="logout">
          <q-item-section>
            <q-item-label class="text-black">{{ $t('logout') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Admin',
  computed: {
    loggedIn () {
      return this.$store.getters.LOGGED_IN
    },
    user () {
      return this.$store.getters.USER
    }
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    logout (e) {
      e.preventDefault()
      this.$q.loading.show()
      const self = this
      const pID = this.$axios.getCookie('passphraseId')
      const userID = this.$axios.getCookie('userId')
      this.$axios.post(`/user/${userID}/sign_out/${pID}`).then(() => {
        self.setLogout()
      }).catch(() => {
        self.setLogout()
      })
    },
    setLogout () {
      this.$axios.removeCookie('passphraseId')
      this.$axios.removeCookie('passphrase')
      this.$axios.removeCookie('userId')
      this.$axios.removeCookie('token')
      this.$axios.removeCookie('role')
      this.$axios.token = ''
      this.$store.commit('SET_AUTH', {
        loggedIn: false,
        userId: 0,
        role: ''
      })
      this.$store.commit('SET_USER', {})
      this.$router.push('/')
      this.$q.loading.hide()
    }
  }
}
</script>
<style scoped>
</style>
