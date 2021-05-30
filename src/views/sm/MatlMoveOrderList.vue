<template>
  <a-card class="j-inner-table-wrapper" :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="状态">
              <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.status" dictCode="is_check"/>
            </a-form-item>
          </a-col>
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="审核日期">
              <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.voucherTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.voucherTime_end"></j-date>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="类型">
                <j-dict-select-tag placeholder="请选择类型" v-model="queryParam.type" dictCode="tsm_matl_out_order_type"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 begin -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-has="'moveorder.add'">新增</a-button>
     <a-popconfirm title="确定要审核这些数据吗?"  @confirm="check">
        <a-button type="primary" icon="check" v-has="'inorder.check'">审核</a-button>
        </a-popconfirm>
      <a-button type="primary" icon="download" @click="handleExportXls('移库单主表')" v-has="'moveorder.out'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import" v-has="'moveorder.in'">导入</a-button>
      </a-upload>

            <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'moveorder.delete'">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="preBatchDel">
                  <a-icon type="delete"/>
                  <span>删除</span>
                </a-menu-item>
              </a-menu>
              <a-button>
                <span>批量操作</span>
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
    </div>
    <!-- 操作按钮区域 end -->

    <!-- table区域 begin -->
    <div>

      <a-alert type="info" showIcon style="margin-bottom: 16px;">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ y: 280 }"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :expandedRowKeys="expandedRowKeys"
        :rowSelection="{selectedRowKeys, onChange: onSelectChange}"
        @expand="handleExpand"
        @change="handleTableChange"
        :rowClassName="rowClassName"
      >

        <!-- 内嵌table区域 begin -->
        <!-- <template slot="expandedRowRender" slot-scope="record">
          <a-tabs tabPosition="top">
            <a-tab-pane tab="移库单明细表" key="matlMoveOrderDtl" forceRender>
              <matl-move-order-dtl-sub-table :record="record"/>
            </a-tab-pane>
          </a-tabs>
        </template> -->
        <!-- 内嵌table区域 end -->

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

        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" :disabled="record.status === '1' ? true:false" v-has="'moveorder.edit'">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link" v-has="'moveorder.more'">
              <span>更多 <a-icon type="down"/></span>
            </a>
            <a-menu slot="overlay" >
              <a-menu-item v-has="'moveorder.delete'" v-if="record.status === '0' ? true : false">
                <a-popconfirm title="确定删除吗?" @confirm="preDel(record)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
                 <a-menu-item v-has="'moveorder.redflushdtl'" v-if="record.status === '0' ? false : true">
                <!-- <a @click="handleEdit(record)" v-has="'outorder.redflush'" :disabled="record.status === '0' ? true:false">冲红</a> -->
                <a @click="handleRedFlushDtl(record)">冲红明细</a>
              </a-menu-item>
              <a-menu-item v-has="'moveorder.redflush'" v-if="record.status === '0' ? false : true">
                <a-popconfirm
                  :title="`确定要冲红选中单据吗?`"
                  v-if="record.status === '0' ? false : true"
                  @confirm="handleRedFlush(record)"
                >
                    <a>冲红整单</a>
                  <span class="gap"></span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </template>

      </a-table>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
    <matl-move-order-modal ref="modalForm" @ok="modalFormOk"/>

    <!-- 冲红区域 -->
    <red-matl-move-order-modal @reload="loadData()" ref="redModalForm" @ok="modalFormOk" />

    <!--子表区域-->
    <matl-move-order-dtl-list @reload="loadData()" :main-id="selectedRowKeys[0]"
                          :pRecord="selectionRows[0]"></matl-move-order-dtl-list>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MatlMoveOrderModal from './modules/MatlMoveOrderModal'
import RedMatlMoveOrderModal from './red/RedMatlMoveOrderModal'
import MatlMoveOrderDtlSubTable from './subTables/MatlMoveOrderDtlSubTable'
import '@/assets/less/TableExpand.less'
import MatlMoveOrderDtlList from './dtlList/MatlMoveOrderDtlList'
import { deleteAction, postAction } from '@/api/manage'
import { commonActionMixin } from '@/mixins/CommonActionMixin'
import JDate from '@comp/jeecg/JDate'
import JSearchSelectTag from '@comp/dict/JSearchSelectTag'


export default {
  name: 'MatlMoveOrderList',
  mixins: [JeecgListMixin, commonActionMixin],
  components: {
    JSearchSelectTag,
    MatlMoveOrderModal,
    MatlMoveOrderDtlSubTable,
    MatlMoveOrderDtlList,
    RedMatlMoveOrderModal,
    JDate
  },
  provide() {
    return {
      onClearSelectedList: this.onClearSelected
    }
  },
  data() {
    return {
      description: '移库单主表列表管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => parseInt(index) + 1
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type_dictText'
        },
        {
          title: '单据号',
          align: 'center',
          dataIndex: 'matlMoveNumber'
        },
        {
          title: '过账日期',
          align: 'center',
          sorter: true,
          dataIndex: 'postingDate'
        },
        {
          title: '审核日期',
          align: 'center',
          sorter: true,
          dataIndex: 'voucherTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 字典选项
      dictOptions: {},
      // 展开的行test
      expandedRowKeys: [],
      url: {
        list: '/sm/matlMoveOrder/list',
        delete: '/sm/matlMoveOrder/delete',
        deleteBatch: '/sm/matlMoveOrder/deleteBatch',
        exportXlsUrl: '/sm/matlMoveOrder/exportXls',
        importExcelUrl: '/sm/matlMoveOrder/importExcel',
        check: '/sm/matlMoveOrder/check',
        redFlush: '/sm/matlMoveOrder/redFlush'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return window._CONFIG['domianURL'] + this.url.importExcelUrl
    }
  },
  methods: {
    initDictConfig() {
    },
    handleExpand(expanded, record) {
      this.expandedRowKeys = []
      if (expanded === true) {
        this.expandedRowKeys.push(record.id)
      }
    },
    handleRedFlushDtl(record) {
      this.$refs.redModalForm.edit(record)
      this.$refs.redModalForm.title = '冲红'
      this.$refs.modalForm.disableSubmit = true
    },
    handleRedFlush(record) {
      if (!this.url.redFlush) {
        this.$message.error('请设置url.redFlush属性!')
        return
      }
      if (record.status == 0) {
        this.$message.warning('请选择已审核的记录冲红!')
        return
      }
       deleteAction(this.url.redFlush, { ids: record.id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
          this.clearSelected()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    rowClassName:function(record, index){
        if(record.billProp === 1){
            return ""
        }
        return "redfont"
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
</style>