<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="true"
  >
    <div class="row flex flex-center shadow-0">
      <div class="col-12 col-xs-12 col-md-8 col-lg-8 col-xl-8">
        <q-card class="">
          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="text-h6">{{ $t('createNewTopic') }}</div>
              </div>
              <div class="col-6 text-right">
                <q-btn type="submit" color="secondary" @click="onSubmit">
                  {{ $t('create') }}
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row items-center no-wrap">
            <q-form
              class="full-width"
              @submit="onSubmit"
            >
              <q-input
                stack-label
                :label="$t('title')"
                v-model="title"
                lazy-rules
                :rules="[ val => val && val.length > 8 || 'Please enter title' ]"
              />
              <q-select
                stack-label
                ref="selectBox"
                v-model="category"
                :options="categories"
                :label="$t('category')"
                multiple
                map-options
                emit-value
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please select category' ]"
              />
              <q-space />
              <Mavon v-if="showEditor"
                     v-model="content"
                     :upload-url="uploadUrl"
                     style="margin-top: 20px"
              />
<!--              <mavon-editor-->
<!--                style="margin-top: 20px"-->
<!--                v-model="content"-->
<!--                :toolbars="editorToolbars"-->
<!--                language="en"-->
<!--              />-->
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-dialog>
</template>
<script>
import Mavon from './Mavon'
export default {
  name: 'NewTopic',
  components: {
    Mavon
  },
  props: {
    selectedCategory: Number
  },
  computed: {
    categories () {
      return this.$store.getters.CATEGORIES.map((c) => {
        return { label: c.title, value: c.id }
      })
    },
    selectBox () {
      return this.$refs.selectBox
    }
  },
  data () {
    return {
      showEditor: true,
      uploadUrl: null,
      title: '',
      description: '',
      content: '',
      category: [],
      files: []
    }
  },
  mounted () {
    if (this.$props.selectedCategory) {
      this.category.push(this.$props.selectedCategory)
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok', { success: true })
      this.hide()
    },
    onCancelClick () {
      this.hide()
    },
    onSubmit (event) {
      event.preventDefault()
      console.log(this.title)
      console.log(this.content)
      console.log(this.category)
    }
  },
  watch: {
    files () {
      console.log(this.files)
    }
  }
}
</script>

<style scoped>

</style>
