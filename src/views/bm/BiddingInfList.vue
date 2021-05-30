
<template>
  <a-card class="j-inner-table-wrapper"
          :bordered="false">

    <!-- 查询区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.biddingTitle"
                       placeholder="请输入标题" />

            </a-form-item>
          </a-col>
          <a-col :xl="10"
                 :lg="11"
                 :md="12"
                 :sm="24">
            <a-form-item label="开标日期">
              <j-date placeholder="请选择开始日期"
                      class="query-group-cust"
                      v-model="queryParam.beginTime"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期"
                      class="query-group-cust"
                      v-model="queryParam.endTime"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xl="10"
                 :lg="11"
                 :md="12"
                 :sm="24">
            <a-form-item label="截标日期">
              <j-date placeholder="请选择开始日期"
                      class="query-group-cust"
                      v-model="queryParam.bTime"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期"
                      class="query-group-cust"
                      v-model="queryParam.eTime"></j-date>
            </a-form-item>
          </a-col>

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="申请单位">
              <a-input v-model="queryParam.biddingDepaterment"
                       placeholder="请输入申请单位" />
            </a-form-item>
          </a-col>

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <span class="table-page-search-submitButtons table-operator">
              <a-button type="primary"
                        icon="search"
                        @click="searchQuery">查询</a-button>
              <a-button type="primary"
                        icon="reload"
                        @click="searchReset">重置</a-button>
              <a @click="handleToggleSearch"
                 style="margin-left: 8px">
                <span>{{ toggleSearchStatus ? '收起' : '展开' }}</span>
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域 end -->

    <!-- 操作按钮区域 begin -->
    <div class="table-operator">
      <a-button type="primary"
                icon="plus"
                @click="handleAdd" v-has="'bm:biddingInf:add'">新增</a-button>
      <a-button type="primary"
                @click="lookList" v-has="'bm:biddingDtl:list'">参考采购查询</a-button>
      <purchase-plan-form :pId="selectedRowKeys"
                          ref="PurchasePlanForm" />
      <a-button type="primary"  @click="priceList" v-has="'bm:biddingPrice:list'">查看报价</a-button>
      <report-bidding-price :pId="selectedRowKeys"
                          ref="ReportBiddingPrice" />
      <a-button type="primary"
                icon="download"
                @click="handleExportXls('招标信息表')" v-has="'bm:biddingInf:export'">导出</a-button>
      <!-- <a-upload name="file"
                :showUploadList="false"
                :multiple="false"
                :headers="tokenHeader"
                :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary"
                  icon="import">导入</a-button> 
      </a-upload>-->

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"
                       @click="batchDel">
            <a-icon type="delete" />
            <span>删除</span>
          </a-menu-item>
        </a-menu>
        <a-button  v-has="'bm:biddingInf:batchDel'">
          <span>批量操作</span>
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!-- 操作按钮区域 end -->

    <!-- table区域 begin -->
    <div>

      <a-alert type="info"
               showIcon
               style="margin-bottom: 16px;">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px"
             @click="onClearSelected">清空</a>
        </template>
      </a-alert>
      <a-table size="middle"
               bordered
               rowKey="id"
               :loading="loading"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="false"
               :rowSelection="{selectedRowKeys, onChange: onSelectChange}">

        <!-- 内嵌table区域 begin -->
        <template slot="expandedRowRender"
                  slot-scope="record">
          <a-tabs tabPosition="top">
            <a-tab-pane tab="招标明细信息表"
                        key="biddingDtl"
                        forceRender>
              <bidding-dtl-sub-table :record="record" />
            </a-tab-pane>
            <a-tab-pane tab="招标企业信息表"
                        key="biddingEnterprise"
                        forceRender>
              <bidding-enterprise-sub-table :record="record" @reLoadData="reLoadData"/>
            </a-tab-pane>
          </a-tabs>
        </template>
        <!-- 内嵌table区域 end -->

        <template slot="htmlSlot"
                  slot-scope="text">
          <div v-html="text"></div>
        </template>

        <template slot="imgSlot"
                  slot-scope="text">
          <div style="font-size: 12px;font-style: italic;">
            <span v-if="!text">无图片</span>
            <img v-else
                 :src="getImgView(text)"
                 alt=""
                 style="max-width:80px;height:25px;" />
          </div>
        </template>

        <template slot="fileSlot"
                  slot-scope="text">
          <span v-if="!text"
                style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else
                    ghost
                    type="primary"
                    icon="download"
                    size="small"
                    @click="downloadFile(text)">
            <span>下载</span>
          </a-button>
        </template>

        <template slot="action"
                  slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'bm:biddingInf:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?"
                        @confirm="handleDelete(record.id)">
            <a v-has="'bm:biddingInf:delete'">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
<!--          <a-dropdown>
            <a class="ant-dropdown-link">
              <span>更多
                <a-icon type="down" />
              </span>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?"
                              @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->

        </template>

      </a-table>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
    <bidding-inf-modal ref="modalForm"
                       @ok="modalFormOk" /> 

  </a-card>
</template>

<script>


import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BiddingInfModal from './modules/BiddingInfModal'
import BiddingDtlSubTable from './subTables/BiddingDtlSubTable'
import BiddingEnterpriseSubTable from './subTables/BiddingEnterpriseSubTable'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'
import PurchasePlanForm from "./modules/PurchasePlanForm2";
import ReportBiddingPrice from "./modules/ReportBiddingPrice";

import { getAction } from "@/api/manage";
import JDate from "@comp/jeecg/JDate";
import { filterObj } from "@/utils/util";




export default {
  name: 'BiddingInfList',
  mixins: [JeecgListMixin],
  provide () {
    return {
      realTimeList: this.loadData,
    }
  },
  components: {
    JDate,
    PurchasePlanForm,
    BiddingInfModal,
    BiddingDtlSubTable,
    BiddingEnterpriseSubTable,
    ReportBiddingPrice

  },
  data () {
    return {
      queryParam: {},
      description: '招标信息表列表管理页面',
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
          title: '招投标号',
          align: 'center',
          dataIndex: 'biddingNo',
          display: 'false'
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'biddingType_dictText'
        },
        {
          title: '采购标题',
          align: 'center',
          dataIndex: 'biddingTitle',
        },
        {
          title: '采购类型',
          align: 'center',
          dataIndex: 'biddingCategory_dictText'
        },
        {
          title: '采购方式',
          align: 'center',
          dataIndex: 'biddingWay_dictText'
        },
        {
          title: '申请单位',
          align: 'center',
          dataIndex: 'biddingDepaterment',
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'biddingMan',
        },
        {
          title: '开标时间',
          align: 'center',
          dataIndex: 'openBiddingDate',
        },
        {
          title: '截标时间',
          align: 'center',
          dataIndex: 'endBiddingDate',
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'biddingDate',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'biddingFlag_dictText'
        },
        {
          title: '第三方公司',
          align: 'center',
          dataIndex: 'biddingCompany',
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
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 字典选项
      dictOptions: {},
      // 展开的行test
      expandedRowKeys: [],
      url: {
        list: '/bm/biddingInf/list',
        delete: '/bm/biddingInf/delete',
        deleteBatch: '/bm/biddingInf/deleteBatch',
        exportXlsUrl: '/bm/biddingInf/exportXls',
        importExcelUrl: '/bm/biddingInf/importExcel',
        //  getPurchaseDetail: '/bm/biddingInf/purchaseDetail'
      },
    }
  },
  computed: {
    importExcelUrl () {
      return window._CONFIG['domianURL'] + this.url.importExcelUrl
    }
  },

  watch: {
    record: {
      immediate: true,
      handler () {
        if (this.record != null) {
          this.loadData(this.record)
        }
      }
    }
  },
  methods: {

    reLoadData(){
      debugger
      this.loadData()
    },
    /*loadData1(arg) {
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
          alert('list loaddata')
          this.ipagination.total = res.result.total;

        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
        this.loading = false;
      })

      this.onClearSelected()
    },*/


    // 用于解决定点刷新问题
    searchQuery () {
      this.loadData(1);
    },
    loadData (arg) {
      if (!this.url.list) {
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
          // this.$message.success('更新数据成功')
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    getQueryParams () {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },

    //参考采购查询
    lookList () {
      this.$refs.PurchasePlanForm.loadData()
    },
    priceList () {
      this.$refs.ReportBiddingPrice.loadData()
    },
    initDictConfig () {
    },

    handleExpand (expanded, record) {
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