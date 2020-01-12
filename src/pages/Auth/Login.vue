<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card bordered flat style="min-width: 400px">
        <q-card-section class="text-center">
          <h4 class="text-h4 q-gutter-xs">{{ $t('login') }}</h4>
          <template v-if="!thirdParty">
            <q-form
              @submit="onSubmit"
            >
              <q-input
                filled
                v-model="id"
                label="Username or email"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please enter username or email']"
              />

              <q-input
                filled
                type="password"
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[
          val => val && val.length < 8 || 'Please enter password'
        ]"
              />
              <div class="text-right q-qutter-md" style="margin-bottom: 15px">
                <router-link to="/auth/forgotpassword" class="text-black">
                  {{ $t('forgotPassword') }}
                </router-link>
              </div>
              <div style="margin-bottom: 20px">
                <div class="row">
                  <q-btn type="submit" class="left float-left col-4">
                    {{ $t('login') }}
                  </q-btn>
                  <div class="col-4"></div>
                  <a :href="`${$axios.apiUrl}/auth/github`" title="Login with Github" class="col-4">
                    <q-btn class="bg-black text-white ">
                      <q-icon name="fab fa-github"/>
                      Github
                    </q-btn>
                  </a>
                </div>
              </div>
            </q-form>
          </template>
          <template v-else>
            <div class="text-center" style="font-size: 32px">
              <q-icon :name="`fab fa-${type}`"/>
            </div>
            <p class="text-center">
              <template v-if="!error">
                <template v-if="status === 'success'">
                  {{ $t('thirdPartyLoginSuccess') }}
                </template>
                <template v-else>
                  {{ $t('thirdPartyLoginFailed') }}
                </template>
              </template>
              <template v-else>
                {{ errorMessage }}
              </template>
            </p>
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      id: '',
      password: '',
      thirdParty: false,
      type: '',
      status: '',
      passphrase: '',
      error: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.thirdParty = (this.$route.query.action === 'third-party')
    this.type = (typeof this.$route.query.type !== 'undefined' ? this.$route.query.type : '')
    this.status = (typeof this.$route.query.status !== 'undefined' ? this.$route.query.status : '')
    this.passphrase = (typeof this.$route.query.passphrase !== 'undefined' ? atob(this.$route.query.passphrase) : '')
    if (this.passphrase.length > 190) {
      this.loginWithGithub()
    }
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
    },
    loginWithGithub () {
      const self = this
      this.$q.loading.show()
      this.$axios.setCookie('passphrase', this.$route.query.passphrase)
      this.$axios.setCookie('passphraseId', this.$route.query.passphrase_id)
      this.$axios.post(this.$axios.tokenUri, {
        passphrase: this.passphrase
      }).then(({ data }) => {
        self.$axios.token = data.data.jwt
        self.$axios.setCookie('token', data.data.jwt)
        self.$axios.setCookie('userId', data.data.user_id)
        self.$axios.setCookie('role', data.data.role)
        self.$axios.genAuthReq()
        self.$store.commit('SET_AUTH', {
          userId: data.data.user_id,
          role: data.data.role,
          loggedIn: true
        })
        setTimeout(() => {
          self.$router.push('/')
          self.$q.loading.hide()
        }, 2000)
      }).catch(() => {
        self.error = true
        self.errorMessage = 'Something went wrong!!'
      })
    }
  }
}
</script>

<style scoped>

</style>
