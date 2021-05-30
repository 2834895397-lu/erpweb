<template>
  <a-card class="j-inner-table-wrapper" :bordered="false">

    <!-- 查询区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请类型">
              <j-dict-select-tag placeholder="请申请类型" v-model="queryParam.type" dictCode="tmm_plan_type"/>
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
              <a-form-item label="申请单据号">
                <a-input placeholder="请输入申请单据号" v-model="queryParam.planNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>


          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="状态">
                <j-dict-select-tag placeholder="请输入状态" v-model="queryParam.status" dictCode="is_check"></j-dict-select-tag>
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
    <!-- 查询区域 end -->

    <!-- 操作按钮区域 begin -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd" v-has="'plan.add'">新增</a-button>
      <a-button type="primary" icon="check" @click="check" v-has="'plan.check'">审核</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('采购申请主表')" v-has="'plan.download'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
<!--        <a-button type="primary" icon="import" v-has="'plan.import'">导入</a-button>-->
      </a-upload>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="preBatchDel">
            <a-icon type="delete"/>
            <span>删除</span>
          </a-menu-item>
        </a-menu>
        <a-button v-has="'plan.batchDelete'">
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
            <a-tab-pane tab="采购申请明细表" key="planDtl" forceRender>
              <plan-dtl-sub-table :record="record"/>
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
            v-elseq
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
          <a @click="handleEdit(record)" :disabled="record.status === '0'?false:true" v-has="'plan.edit'">编辑</a>
          <a-divider type="vertical"/>
          <!--          <a-dropdown>-->
          <!--            <a class="ant-dropdown-link" :disabled="record.status === '0'?false:true">-->
          <!--              <span>更多 <a-icon type="down"/></span>-->
          <!--            </a>-->
          <!--            <a-menu slot="overlay">-->
          <!--              <a-menu-item>-->
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a :disabled="record.status === '0'?false:true" v-has="'plan.delete'">删除</a>
          </a-popconfirm>
          <!--              </a-menu-item>-->
          <!--            </a-menu>-->
          <!--          </a-dropdown>-->

        </template>

      </a-table>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
    <plan-modal ref="modalForm" @ok="modalFormOk"/>
    <!--子表区域-->
    <PlanDtlList  @reload="loadData()" :main-id="selectedRowKeys[0]"
                         :pRecord="selectionRows[0]"></PlanDtlList>

  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PlanModal from './modules/PlanModal'
  import PlanDtlSubTable from './subTables/PlanDtlSubTable'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import {commonActionMixin} from "../../mixins/CommonActionMixin";
  import  PlanDtlList from './dtlList/PlanDtlList'
  import {getAction} from "../../api/manage";
  import {filterDictTextByCache} from "../../components/dict/JDictSelectUtil";
  import JDate from '@/components/jeecg/JDate';

  export default {
    name: 'PlanList',
    mixins: [JeecgListMixin, commonActionMixin],
    provide () {
      return {
        realTimeList: this.loadData,
      }
    },
    components: {
      PlanModal,
      PlanDtlSubTable,
      PlanDtlList,
      JDate
    },

    data() {
      return {
        description: '采购申请主表列表管理页面',
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
            title: '采购申请类型',
            align: 'center',
            dataIndex: 'type_dictText'
          },
          {
            title: '采购组织',
            align: 'center',
            dataIndex: 'purchaseOrgn_dictText'
          },
          {
            title: '审核日期',
            align: 'center',
            dataIndex: 'voucherTime',
          },
          {
            title: '采购申请来源',
            align: 'center',
            dataIndex: 'applyFrom',
            customRender:function (value) {
              return filterDictTextByCache('tmm_apply_from_type', value) ;
            }
          },
          {
            title: '采购申请来源号',
            align: 'center',
            dataIndex: 'applyFromNo',
          },
          {
            title: '采购申请单据号',
            align: 'center',
            dataIndex: 'planNumber',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText'
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
          },
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
          list: '/mm/plan/list',
          delete: '/mm/plan/delete',
          deleteBatch: '/mm/plan/deleteBatch',
          exportXlsUrl: '/mm/plan/exportXls',
          importExcelUrl: '/mm/plan/importExcel',
          check:'/mm/plan/check'
        },
      }
    },
    computed: {
      importExcelUrl() {
        return window._CONFIG['domianURL'] + this.url.importExcelUrl
      }
    },
    methods: {
      // 用于解决定点刷新问题
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })

        this.onClearSelected()
      },

      initDictConfig() {
      },

      handleExpand(expanded, record) {
        this.expandedRowKeys = []
        if (expanded === true) {
          this.expandedRowKeys.push(record.id)
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
</style>