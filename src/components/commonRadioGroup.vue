<template>
  <el-radio-group v-model="inputValue" @change="change">
    <el-radio v-for="(item, i) in options" :key="i" :label="item.label">{{
      item.value
    }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'commonRadioGroup',
  props: {
    value: '',
    options: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      inputValue: this.value,
      label: ''
    }
  },
  mounted() {
    console.log('commonRadioGroup.vue -- ')
    // console.log(this.value)
    // this.inputValue = this.value
    // console.log(this.options)
    // console.log(this.rules)
  },
  methods: {
    change(val) {
      // console.log('change --- ')
      // console.log(val)
      this.$emit('input', val)
    }
  },
  watch: {
    value(o, n) {
      // console.log('watch---')
      // console.log(n)
      this.inputValue = this.value
    }
  }
}
</script>
<style></style>
