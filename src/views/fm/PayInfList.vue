<template>
  <a-card class="j-inner-table-wrapper" :bordered="false">

    <!-- 查询区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="付款单编号">
          <a-input v-model="queryParam.code" placeholder="请输入付款单编号"/>
        </a-form-item>
      </a-col>
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="申请付款日期">
              <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.beginTime"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.endTime"></j-date>
            </a-form-item>
          </a-col>
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请付款日期">
              <j-date v-model="queryParam.applyDate" placeholder="请选择申请付款日期"/>
        </a-form-item>
      </a-col>-->
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="款项性质">
            <a-input v-model="queryParam.payNatureName"  placeholder="请输入款项性质"/>
          </a-form-item>
        </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="采购合同号">
          <a-input v-model="queryParam.contractCode" placeholder="请输入采购合同号"/>
        </a-form-item>
      </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="供应商名称">
                <a-input v-model="queryParam.csNameRecept" placeholder="请输入供应商名称"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="单据状态">
                <j-dict-select-tag v-model="queryParam.appStatus" dictCode="fm_pay_status" placeholder="请选择单据状态"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span class="table-page-search-submitButtons table-operator">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                <span>{{ toggleSearchStatus ? '收起' : '展开' }}</span>
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域 end -->

    <!-- 操作按钮区域 begin -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-has="'fm:payInf:add'">新增</a-button>
      <a-button type="primary" icon="check" @click="check" v-has="'fm:payInf:check'">审批</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('财务付款信息表')" v-has="'fm:payInf:export'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import" v-has="'fm:payInf:import'">导入</a-button>
      </a-upload>

      <a-dropdown v-if="selectedRowKeys.length > 0">`
        <a-menu slot="overlay" >
          <a-menu-item key="1" @click="preBatchDel">
            <a-icon type="delete"/>
            <span>删除</span>
          </a-menu-item>
        </a-menu>
        <a-button v-has="'fm:payInf:batchDel'">
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
        :scroll="{x:true}"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :expandedRowKeys="expandedRowKeys"
        :rowSelection="{selectedRowKeys, onChange: onSelectChange}"
        @expand="handleExpand"
        @change="handleTableChange"
      >

        <!-- 内嵌table区域 begin -->
        <template slot="expandedRowRender" slot-scope="record">
          <a-tabs tabPosition="top">
            <a-tab-pane tab="财务付款明细信息" key="payDtl" forceRender>
              <pay-dtl-sub-table :record="record"/>
            </a-tab-pane>
          </a-tabs>
        </template>
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
          <a @click="handleEdit(record)" v-has="'fm:payInf:edit'" :disabled="record.appStatus === '0'?false:true" >编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)" >
            <a v-has="'fm:payInf:delete'" :disabled="record.appStatus === '0'?false:true" >删除</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a @click="handleDetail(record)">详情</a>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">
              <span>更多 <a-icon type="down"/></span>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail2(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->

        </template>

      </a-table>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
<!--    父组件调用子组件-->
    <pay-inf-modal ref="modalForm"  @ok="modalFormOk" />

  </a-card>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PayInfModal from './modules/PayInfModal'
  import PayDtlSubTable from './subTables/PayDtlSubTable'
  import JDate from '@/components/jeecg/JDate.vue'
  import '@/assets/less/TableExpand.less'
  import {deleteAction, postAction} from "@api/manage";


  export default {
    name: 'PayInfList',
    mixins: [JeecgListMixin , mixinDevice],
    components: {
      PayInfModal,
      PayDtlSubTable,
      JDate,
    },
    data() {
      return {
        /*disableSubmit: false,*/
        description: '财务付款信息表列表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: (t, r, index) => parseInt(index) + 1
          },
          {
            title: '付款单编号',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '申请付款日期',
            align: 'center',
            dataIndex: 'applyDate',
          },
          {
            title: '付款总金额',
            align: 'center',
            dataIndex: 'totalSum',
          },
          {
            title: '付款类型',
            align: 'center',
            dataIndex: 'payMode_dictText'
          },
          {
            title: '采购合同号',
            align: 'center',
            dataIndex: 'contractCode',
          },
          {
            title: '采购合同名称',
            align: 'center',
            dataIndex: 'contractName',
          },
          {
            title: '供应商名称',
            align: 'center',
            dataIndex: 'csNameRecept',
          },

          {
            title: '款项性质',
            align: 'center',
            dataIndex: 'payNatureName',
          },
          {
            title: '单据状态',
            align: 'center',
            dataIndex: 'appStatus_dictText',

          },
         /* {
            title: '支付公司编码',
            align: 'center',
            dataIndex: 'csCodePay',
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width:147,
            scopedSlots: { customRender: 'action' },
          },
        ],
        // 字典选项
        dictOptions: {},
        // 展开的行test
        expandedRowKeys: [],
        url: {
          list: '/fm/payInf/list',
          delete: '/fm/payInf/delete',
          deleteBatch: '/fm/payInf/deleteBatch',
          exportXlsUrl: '/fm/payInf/exportXls',
          importExcelUrl: '/fm/payInf/importExcel',
          check:'/fm/payInf/check'
        },
      }
    },
    computed: {
      importExcelUrl() {
        return window._CONFIG['domianURL'] + this.url.importExcelUrl
      }
    },
    methods: {

      //审批
      check() {
        if (!this.url.check) {
          this.$message.error('请设置url.check属性!')
          return
        }
        let unCheckRows = []
        const { selectedRowKeys, selectionRows } = this
        for (let i = 0; i < selectedRowKeys.length; i++) {
          if (selectionRows[i].appStatus=== '0') {
            unCheckRows.push(selectionRows[i])
          }
        }
        //如果需要审核, 则打包数据发送到后台
        if (unCheckRows.length > 0) {
          let promise = new Promise((resolve, reject) => {
            //可以是多条记录, 后台用集合接收
            postAction(this.url.check, unCheckRows).then(res => {
              if (res.success) {
                resolve(res.result)
              } else {
                reject(' failure')
              }
            })
          })
          promise.then((res) => {
            this.loadData()
            if ('审核成功!' !== res) {
              this.$message.warning(res)
            } else {
              this.$message.success(res)
            }
            this.clearSelected()
          })
        } else {
          this.$message.warning('没有待审核的记录')
        }
      },
      //批量删除
      preBatchDel() {
        if (!this.url.deleteBatch) {
          this.$message.error('请设置url.deleteBatch属性!')
          return
        }
        let ids = ''
        const { selectionRows } = this
        let pushRows = selectionRows.filter(item => {
          //0为未审核
          if (item.appStatus === '0') {
            ids += item.id + ','
            return item
          }
        })
        if (ids.length == 0) {
          this.$message.warning('请选择未审批的记录删除!')
          return
        }
        deleteAction(this.url.deleteBatch, { ids: ids }).then((res) => {
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
      //单条删除, 和多条删除公用后台统一请求, 后台用集合接收
      preDel(record) {
        if (!this.url.deleteBatch) {
          this.$message.error('请设置url.deleteBatch属性!')
          return
        }
        if (record.appStatus == 1) {
          this.$message.warning('请选择未审核的记录删除!')
          return
        }
        deleteAction(this.url.deleteBatch, { ids: record.id }).then((res) => {
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
      clearSelected() {
        this.selectionRows = []
        this.selectedRowKeys = []
      } ,


      initDictConfig() {
      },

      handleExpand(expanded, record) {
        this.expandedRowKeys = []
        if (expanded === true) {
          this.expandedRowKeys.push(record.id)
        }
      },
     /* handleDetail2:function(record){
        this.handleDetail(record);
        this.disableSubmit = true;
      },
      handleEdit2:function(record){
        this.handleEdit(record);
        this.disableSubmit = false;
      },
      handleAdd2:function(){
        this.handleAdd();
        this.disableSubmit = false;
      },*/
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
</style>