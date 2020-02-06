<template>
  <mavon-editor
    v-model="content"
    :toolbars="toolbars"
    language="en"
    ref="md"
    @imgAdd="imageUpload"
    @imgDel="imageDelete"
  />
</template>

<script>
export default {
  name: 'Mavon',
  props: {
    value: {
      required: true
    },
    uploadUrl: {
      required: false
    }
  },
  data () {
    return {
      content: '',
      uploadedFiles: [],
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        code: true,
        table: true,
        imagelink: true,
        fullscreen: false,
        readmodel: false,
        htmlcode: true,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true,
        preview: true
      }
    }
  },
  created () {
    this.content = this.value
  },
  methods: {
    imageUpload (pos, $file) {
      this.uploadedFiles.push({
        pos: pos,
        ...$file
      })
    },
    imageDelete ($file) {
      console.log($file)
      this.uploadedFiles = this.uploadedFiles.filter((f) => {
        return Number(f.pos) !== $file.pos
      })
    }
  },
  watch: {
    content (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
