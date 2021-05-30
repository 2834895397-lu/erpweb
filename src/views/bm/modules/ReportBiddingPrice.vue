<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
   <bar-multid title="" :height="height" :dataSource="multBarData" :fields="mutlBarfields"/>
  </j-modal>
</template>

<script>
import difference from 'lodash/difference';
import BarMultid from '@/components/chart/BarMultid'
import { getAction, postAction } from '@api/manage'

  export default {
    name: 'RerportBiddingPrice',
    components: {BarMultid },
      props: {
    pId: {
      type: Array,
      default: ''
    }
  },
    data() {
      return {
        title:'报价表',
        visible:false,
        disableSubmit: false,
        width: 1800,
        height: 500,
        loading: false,
        multBarData: [],
        mutlBarfields:[],
        url: {
        list: '/bm/biddingInf/listBiddingPrice'
        },
      }
    },
    created() {
    },
    methods: {
      // 加载柱状图数据
      loadData() {
        if (this.pId.length != 1) {
          this.$message.warning('请勾选一条记录')
          return
        }
         //获取参考明细记录
          getAction(this.url.list, {id : this.pId[0]}).then(res => {
              if (res.success) {
                console.info(res.result.data)
                console.info(res.result.fields)
                this.visible = true
                this.multBarData = res.result.data
                this.mutlBarfields = res.result.fields
                //this.multBarData = [ { type: '企业1', '物料1': 150, '物料2': 180, '物料3': 180},{ type: '企业2', '物料1': 100, '物料2': 200, '物料3': 180}]
                //this.mutlBarfields = ['物料1','物料2','物料3']
              }
          })
       
      }, 
      close () {
        this.$emit('close')
        this.visible = false
      /*  this.onClearSelected();*/
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>
