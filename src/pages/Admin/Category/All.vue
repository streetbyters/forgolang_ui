<template>
  <q-page class="q-pa-md">
    <q-table
      :title="$t('categories')"
      :columns="columns"
      :data="data"
      :loading="loading"
      row-key="id"
      @request="getCategories"
      :pagination.sync="pagination"
      :rows-per-page-options="[10, 20, 30, 40]"
      binary-state-sort
    >
      <template slot="top-left">
        <q-input data-position="left" v-model="query" debounce="500" dense class="q-mr-lg" :placeholder="$t('enterSearchTerm')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template slot="top-right">
        <q-btn icon="fa fa-plus" data-position="right" color="primary" :label="$t('new')" to="/admin/category/new" size="sm" />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            data-step="4"
            data-intro="Edit your organizations user"
            data-position="left"
            dense
            icon="edit"
            color="primary"
            size="10px"
            class="q-mr-xs"
            :to="`/admin/category/${props.row.id}`"
          >
            <q-tooltip content-style="font-size: 12px">
              Show
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            data-step="5"
            data-intro="Delete your organizations user"
            data-position="left"
            icon="delete"
            color="negative"
            size="10px"
            @click="remove(props.row)"
          >
            <q-tooltip content-style="font-size: 12px">
              Delete
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import qs from 'query-string'
export default {
  name: 'All',
  meta () {
    return {
      title: this.$t('categories')
    }
  },
  data () {
    return {
      query: '',
      loading: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 40,
        rowsNumber: 1
      },
      columns: [
        {
          name: 'id',
          label: '#ID',
          field: 'id',
          // sortable: true,
          align: 'center'
        },
        {
          name: 'title',
          label: 'Title',
          field: 'title',
          align: 'left'
        },
        {
          name: 'slug',
          label: 'Slug',
          field: 'slug',
          align: 'center'
        },
        {
          name: 'inserted_at',
          label: 'Inserted at',
          field: 'inserted_at',
          align: 'center'
        },
        {
          name: 'updated_at',
          label: 'Updated at',
          field: 'updated_at',
          align: 'center'
        },
        {
          name: 'actions',
          align: 'center'
        }
      ],
      data: []
    }
  },
  mounted () {
    this.getCategories({
      pagination: this.pagination
    })
  },
  methods: {
    remove (row) {
      const self = this
      this.$q.dialog({
        title: this.$t('actionRequired'),
        message: this.$t('deleteAction'),
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        self.$axios.delete(`/category/${row.id}`).then(() => {
          self.getCategories({
            pagination: self.pagination
          })
        }).catch(() => {
          this.$q.notify({
            message: 'Something went wrong!',
            color: 'warning'
          })
        })
      })
    },
    getCategories (props) {
      const self = this
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.loading = true
      console.log(page)
      console.log(rowsPerPage)
      console.log(sortBy)
      console.log(descending)
      const params = qs.stringify({
        limit: rowsPerPage,
        offset: (page === 1 ? 0 : rowsPerPage * page - 1),
        order_field: sortBy,
        order_by: (descending ? 'desc' : 'asc')
      })
      this.$axios.get(`/category?${params}`).then(({ data }) => {
        console.log(data.data)
        self.pagination.rowsNumber = data.total_count
        self.data.splice(0, self.data.length, ...data.data)
        self.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
