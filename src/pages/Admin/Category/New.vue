<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h4">{{ `${$t('new')} ${$t('category')}` }}</div>
      </q-card-section>
      <q-separator dark />
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
          <div>
            <p class="text-warning">
              *** {{ $t('slugErrorText') }}
            </p>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ErrorDialog from '@/components/ErrorDialog'
export default {
  name: 'New',
  data () {
    return {
      category: {
        title: '',
        description: '',
        slug: ''
      }
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      const self = this
      this.$axios.post('/category', {
        title: this.category.title,
        description: this.category.description
      }).then(({ data }) => {
        self.$router.push('/admin/category')
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
