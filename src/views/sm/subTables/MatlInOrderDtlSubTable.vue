<template>
  <a-table
    rowKey="id"
    size="middle"
    bordered
    :loading="loading"
    :columns="columns"
    :dataSource="dataSource"
    :pagination="false"
  >

    <template slot="htmlSlot" slot-scope="text">
      <div v-html="text"></div>
    </template>

    <template slot="imgSlot" slot-scope="text">
      <div style="font-size: 12px;font-style: italic;">
        <span v-if="!text">无图片</span>
        <img v-else :src="getImgView(text)" alt="" style="max-width:80px;height:25px;"/>
      </div>
    </template>

    <template slot="fileSlot" slot-scope="text">
      <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
      <a-button
              v-else
              ghost
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)"
      >
        <span>下载</span>
      </a-button>
    </template>

  </a-table>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterDictTextByCache } from '@comp/dict/JDictSelectUtil'

  export default {
    name: 'MatlInOrderDtlSubTable',
    mixins: [JeecgListMixin],
    props: {
      record: {
        type: Object,
        default: null,
      }
    },
    data() {
      return {
        description: '收货单明细表内嵌列表',
        disableMixinCreated: true,
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '物料',
            align: 'center',
            dataIndex: 'tbdMaterialId_dictText'
          },
          {
            title: '数量',
            align: 'center',
            dataIndex: 'matlQty',
          },
          {
            title: '单价',
            align: 'center',
            dataIndex: 'matlPrice',
          },
          {
            title: '币别',
            align: 'center',
            dataIndex: 'payBb',
            customRender: function(value){
              return filterDictTextByCache("fm_pay_bb",value)
            }
          },
          {
            title: '库存地',
            align: 'center',
            dataIndex: 'tbdNodeId_dictText'
          },
          {
            title: '结算标识',
            align: 'center',
            dataIndex: 'settleFlag_dictText'
          },
          {
            title: '采购订单号',
            align: 'center',
            dataIndex: 'orderNumber',
          },
          {
            title: '采购合同号',
            align: 'center',
            dataIndex: 'contractNumber',
          }
        ],
        url: {
          listByMainId: '/sm/matlInOrder/queryMatlInOrderDtlByMainId',
        },
      }
    },
    watch: {
      record: {
        immediate: true,
        handler() {
          if (this.record != null) {
            this.loadData(this.record)
          }
        }
      }
    },
    methods: {

      getDataSource(){
        return this.dataSource
      },
      loadData(record) {
        this.loading = true
        this.dataSource = []
        getAction(this.url.listByMainId, {
          id: record.id
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            debugger
          }
        }).finally(() => {
          this.loading = false
        })
      },

    },
  }
</script>

<style scoped>

</style>
