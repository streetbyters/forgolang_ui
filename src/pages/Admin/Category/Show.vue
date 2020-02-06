<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h4">{{ category.title }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form
          @submit="submit"
          class="q-gutter-md"
          style="max-width: 500px"
        >
          <q-input
            filled
            v-model="category.title"
            label="Title"
            lazy-rules
            :rules="[ val => val && val.length > 3 || 'Please type something']"
          />
          <q-input
            filled
            type="textarea"
            v-model="category.description"
            label="Description"
          />
          <q-input
            filled
            disable
            v-model="category.slug"
            label="Slug"
          />
          <div>
            <p class="text-warning">
              *** {{ $t('slugErrorText') }}
            </p>
          </div>
          <div>
            <q-btn label="Update" type="submit" color="primary"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ErrorDialog from '@/components/ErrorDialog'
export default {
  name: 'Show',
  data () {
    return {
      category: {
        title: '',
        description: '',
        slug: ''
      }
    }
  },
  mounted () {
    this.getCategory()
  },
  methods: {
    getCategory () {
      const self = this
      this.$axios.get(`/category/${this.$route.params.id}`).then(({ data }) => {
        self.category = data.data
      }).catch(() => {
        self.$router.push('/404')
      })
    },
    submit (e) {
      e.preventDefault()
      const self = this
      this.$axios.put(`/category/${this.$route.params.id}`, {
        title: this.category.title,
        description: this.category.description
      }).then(({ data }) => {
        self.$q.notify({
          message: self.$t('updateOperationSuccess')
        })
      }).catch((err) => {
        err = self.$axios.errorHandler(err)
        self.$q.dialog({
          component: ErrorDialog,
          parent: this,
          errors: err.errors
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
