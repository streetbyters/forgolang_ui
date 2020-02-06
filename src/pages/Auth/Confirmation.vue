<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card bordered flat style="min-width: 400px">
        <q-card-section class="text-center">
          <h4 class="text-h4 q-gutter-xs">{{ $t('confirmation') }}</h4>
          <p>{{ message }}</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Confirmation',
  meta () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      title: this.$t('confirmation'),
      message: this.$t('confirmationCheck')
    }
  },
  mounted () {
    this.checkConfirmation()
  },
  methods: {
    checkConfirmation () {
      const self = this
      console.log(this.$route.params.userId)
      console.log(this.$route.params.code)
      this.$axios.post(`/auth/confirmation/${this.$route.params.userId}/${this.$route.params.code}`)
        .then(({ data }) => {
          self.message = self.$t('confirmationSuccess')
          setTimeout(() => {
            self.$router.push('/auth/login')
          }, 2500)
        }).catch(({ response }) => {
          console.log(response.data)
        })
    }
  }
}
</script>

<style scoped>

</style>
