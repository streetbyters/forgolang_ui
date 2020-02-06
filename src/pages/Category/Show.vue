<template>
  <q-page class="q-pa-md" padding>
    <div class="page-header full-width">
      <div class="row">
        <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <h1 class="page-title">{{ category.title }}</h1>
          <p>
            {{category.description}}
          </p>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div class="page-search full-width">
            <div class="row">
              <div class="text-right offset-0 offest-xs-0 offset-md-8 offset-lg-8 offset-xl-8 col-12 col-xs-12 col-md-4 col-lg-4 col-xl-4">
                <q-btn
                  @click="newTopic"
                  :label="$t('newTopic')"
                  :title="$t('newTopic')"
                  icon="fas fa-plus"
                  color="secondary"
                  size="small"
                />
              </div>
<!--              <div class="offset-0 offest-xs-0 offset-xl-6 col-12 col-xs-12 col-md-6 col-lg-6 col-xl-6">-->
<!--                <q-input dense debounce="300" v-model="query" placeholder="Search">-->
<!--                  <template v-slot:append>-->
<!--                    <q-icon name="search" />-->
<!--                  </template>-->
<!--                </q-input>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-table
      grid
      :loading="loading"
      :pagination.sync="pagination"
    >
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_satisfied" />
          <span>
            {{ $t('noTopic') }}
          </span>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import qs from 'query-string'
import NewTopic from '@/components/NewTopic'
export default {
  name: 'Show',
  meta () {
    return {
      title: `${this.category.title}`
    }
  },
  data () {
    return {
      category: {
        title: '',
        description: '',
        slug: ''
      },
      data: [],
      loading: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 40,
        rowsNumber: 1
      },
      query: ''
    }
  },
  mounted () {
    this.getCategory({
      pagination: this.pagination
    })
  },
  methods: {
    newTopic () {
      this.$q.dialog({
        component: NewTopic,
        parent: this,
        selectedCategory: this.category.id
      })
    },
    getCategory (props) {
      const self = this
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.loading = true
      const params = qs.stringify({
        limit: rowsPerPage,
        offset: (page === 1 ? 0 : rowsPerPage * page - 1),
        order_field: sortBy,
        order_by: (descending ? 'desc' : 'asc')
      })
      this.$axios.get(`/category/${this.$route.params.categorySlug}`).then(({ data }) => {
        self.category = data.data
        self.$axios.get(`/category/${self.category.id}/post?${params}`).then(({ data }) => {
          self.pagination.rowsNumber = data.total_count
          if (data.total_count > 0) {
            self.data.splice(0, self.data.length, ...data.data)
          }
        })
        self.loading = false
      }).catch(() => {
        self.loading = false
        self.$router.push('/404')
      })
    }
  }
}
</script>

<style scoped>

</style>
