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
          Forgolang.com
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
        <q-item-label header>{{ $t('categories') }}</q-item-label>
        <template v-for="c in categories">
          <q-item clickable tag="a" :to="`/${c.slug}`" :key="`category${c.id}`">
            <q-item-section>
              <q-item-label class="text-black">{{ c.title }}</q-item-label>
              <q-item-label caption>
                {{ $t('totalDiscussion', {count: 1}) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      <div v-if="!loggedIn" class="left-auth">
        <div class="links">
          <div class="q-pa">
            <div class="row">
              <div class="col-xs-12 col-md-4 col-lg-4 col-xl-4">
                <router-link to="/auth/login">
                  <q-icon name="fa fa-sign-in-alt"/>
                  {{ $t('login') }}
                </router-link>
              </div>
              <div class="col-xs-12 col-md-4 col-lg-4 col-xl-4">
                <router-link to="/auth/register">
                  <q-icon name="fa fa-user-plus"/>
                  {{ $t('register') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <q-separator/>
        <q-list>
          <q-item-label header>Hi, {{user.username}}</q-item-label>
          <template v-if="['superadmin', 'moderator'].indexOf(this.role) > -1">
            <q-item clickable tag="a" to="/admin">
              <q-item-section>
                <q-item-label class="text-black">Administrator Panel</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-item clickable tag="a" to="/auth/profile">
            <q-item-section>
              <q-item-label class="text-black">Profile</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/auth/profile">
            <q-item-section>
              <q-item-label class="text-black">Preferences</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" @click="logout">
            <q-item-section>
              <q-item-label class="text-black">{{ $t('logout') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
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
  name: 'Base',
  computed: {
    loggedIn () {
      return this.$store.getters.LOGGED_IN
    },
    user () {
      return this.$store.getters.USER
    },
    role () {
      return this.$store.getters.ROLE
    }
  },
  data () {
    return {
      categories: [],
      leftDrawerOpen: false,
      isManager: false
    }
  },
  mounted () {
    this.getCategories()
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
      // this.$router.push('/')
      this.$q.loading.hide()
    },
    getCategories () {
      const self = this
      this.$axios.get('/category').then(({ data }) => {
        self.categories = data.data
      })
    }
  },
  watch: {}
}
</script>
<style scoped>
  .left-auth{
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
  .left-auth h4{
    font-weight: bold;
    width: 100%;
    font-size: .875rem;
    display: block;
    line-height: 1.2;
    margin: 15px 0;
  }
  .left-auth .links{
    display: block;
    width: 100%;
  }
  .left-auth .links a{
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    color: #000;
    text-decoration: none;
  }
</style>
