<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card bordered flat style="min-width: 400px">
        <q-card-section class="text-center">
          <h4 class="text-h4 q-gutter-xs">{{ $t('register') }}</h4>
            <q-form
              @submit="onSubmit"
            >
              <q-input
                filled
                v-model="username"
                label="Username"
                lazy-rules
                :rules="[ val => val && val.length > 4 || 'Please enter username']"
              />
              <q-input
                filled
                type="email"
                v-model="email"
                label="email"
                lazy-rules
                :rules="[ val => val && val.length > 4 || 'Please enter email']"
              />
              <q-input
                filled
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 4 || 'Please enter password']"
              />
              <q-input
                filled
                v-model="passwordConfirmation"
                label="Password Confirmation"
                lazy-rules
                :rules="[ val => val && val === password || 'Do not match password']"
              />
              <div style="margin-bottom: 20px">
                <div class="row text-center">
                  <q-btn type="submit" class="">
                    {{ $t('register') }}
                  </q-btn>
                </div>
              </div>
              <div class="row">
                <p>Do you have already account?
                  <router-link to="/auth/login">
                    Sign in
                  </router-link>
                </p>
              </div>
            </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Register',
  meta () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      title: this.$t('register'),
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()
      const self = this
      this.$axios.post(`/auth/register`, {
        username: this.username,
        email: this.email,
        password: this.password
      }).then(({ data }) => {
        console.log(data)
      }).catch(({ response }) => {
        console.log(response)
        self.$q.notify({
          color: 'red',
          html: true,
          message: Object.keys(response.data.errors).map((k) => {
            return `${k}: ${response.data.errors[k]}<br/>`
          }).join(' ')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
