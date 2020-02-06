<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <template v-for="(v, k) in errors">
          {{ k }} : {{ v }}
        </template>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ErrorDialog',
  props: {
    errors: Object
  },
  mounted () {
    Object.keys(this.errors).map((i) => {
      console.log(this.errors[i])
    })
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
      this.$emit('ok')
      this.hide()
    }
  }
}
</script>

<style scoped>

</style>
