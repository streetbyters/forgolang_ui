<template>
  <q-page class="q-pa-md">
    <h1>{{ category.title }}</h1>
  </q-page>
</template>

<script>
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
      }
    }
  },
  mounted () {
    console.log(this.$route.params)
  }
}
</script>

<style scoped>

</style>
