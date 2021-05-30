<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('移库单明细表')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0 && pRecord.status === '0' ? true : false">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="delBatch" v-has="'moveorder.delete'">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :rowClassName="rowClassName"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width: 80px; font-size: 12px; font-style: italic"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span v-if="pRecord.status === '0' ? true : false" slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a>-->
          <!-- <a-divider type="vertical"/>-->
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-has="'moveorder.delete'">删除</a>
          </a-popconfirm>
        </span>
        <span v-else slot="action">暂无操作</span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction } from '@/api/manage'
import { filterDictTextByCache } from '@comp/dict/JDictSelectUtil'

export default {
  name: 'MatlMoveOrderDtlList',
  mixins: [JeecgListMixin],
  props: {
    mainId: {
      type: String,
      default: '',
      required: false,
    },
    pRecord: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  watch: {
    mainId: {
      immediate: true,
      handler(val) {
        if (!this.mainId) {
          this.clearList()
        } else {
          this.loadData(1)
        }
      },
    },
  },
  data() {
    return {
      description: '移库单主表管理页面',
      disableMixinCreated: true,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '物料',
          align: 'center',
          dataIndex: 'tbdMaterialId_dictText',
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'matlQty',
        },
        /*  {
            title:'单价',
            align:"center",
            dataIndex: 'matlPrice'
          },
          {
            title: '币别',
            align: 'center',
            dataIndex: 'payBb',
            customRender: function(value){
              return filterDictTextByCache("fm_pay_bb",value)
            }
          },*/
        {
          title: '移库起点库存地',
          align: 'center',
          dataIndex: 'fromTbdNodeId_dictText',
        },
        {
          title: '移库终点库存地',
          align: 'center',
          dataIndex: 'toTbdNodeId_dictText',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sm/matlMoveOrder/queryMatlMoveOrderDtlByMainId',
        delete: '/sm/matlMoveOrder/deleteMatlMoveOrderDtl',
        deleteBatch: '/sm/matlMoveOrder/deleteBatchMatlMoveOrderDtl',
        exportXlsUrl: '/sm/matlMoveOrder/exportMatlMoveOrderDtl',
        importUrl: '/sm/matlMoveOrder/importMatlMoveOrderDtl',
      },
      dictOptions: {
        type: [],
        status: [],
      },
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importUrl}/${this.mainId}`
    },
  },
  methods: {
    delBatch() {
      let id = ''
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        id += this.selectedRowKeys[i] + ','
      }
      console.log(id)
      this.handleDelete(id)
      this.selectedRowKeys = []
    },

    handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
          this.$emit('reload')
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      getAction(this.url.list + '/?id=' + this.mainId).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    clearList() {
      this.dataSource = []
      this.selectedRowKeys = []
      this.ipagination.current = 1
    },
    rowClassName: function (record, index) {
      if (record.originalId === null) {
        /* 1是蓝单, 否则是红单据 */
        return ''
      }
      return 'redfont'
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
