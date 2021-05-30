<template>
  <div>
    <j-search-select-tag @change="change" style="width: 200px" dict="tcs_profile_inf,cs_name,id"
                         placeholder="请选择客商"></j-search-select-tag>

  </div>
</template>


<!--
使用方法:
  在页面直接import Customer from '@/views/sm/component/Customer'
  然后在组件中声明使用即可, 获取值获取值直接用v-model绑定或者change事件来接收值
-->

<script>
import JSearchSelectTag from '@comp/dict/JSearchSelectTag'

export default {
  name:'Customer',
  components: { JSearchSelectTag },
  methods: {
    change(value) {
      this.$emit('change', value)
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style>

</style>
