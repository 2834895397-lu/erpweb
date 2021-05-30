  <template>
  <a-card class="j-inner-table-wrapper" :bordered="false">

    <!-- 查询区域 begin -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请类型">
              <j-dict-select-tag placeholder="请申请类型" v-model="queryParam.type" dictCode="tmm_contract_type"/>
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
              <a-form-item label="合同单据号">
                <a-input placeholder="请输入合同单据号" v-model="queryParam.contractNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="完结标识">
                <j-dict-select-tag placeholder="请输入完结标识" v-model="queryParam.ContEndFlag" dictCode="tmm_cont_end_flag"/>
              </a-form-item>
            </a-col>
          </template>

          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="供方">
                <a-input placeholder="请输入供方" v-model="queryParam.tcsProfileInfName"></a-input>
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
      <a-button type="primary" icon="plus" @click="handleAdd" v-has="'contract.add'">新增</a-button>
      <a-button type="primary" icon="check" @click="check" v-has="'contract.check'">审核</a-button>
      <a-button type="primary" icon="check" @click="over" v-has="'contract.over'">完结</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('采购合同主表')" v-has="'contract.download'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
<!--        <a-button type="primary" icon="import" v-has="'contract.import'">导入</a-button>-->
      </a-upload>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="preBatchDel">
            <a-icon type="delete"/>
            <span>删除</span>
          </a-menu-item>
        </a-menu>
        <a-button v-has="'contract.batchDelete'">
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
            <a-tab-pane tab="采购合同明细表" key="contractDtl" forceRender>
              <contract-dtl-sub-table :record="record"/>
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
          <a @click="handleEdit(record)" :disabled="record.status === '0'?false:true" v-has="'contract.edit'">编辑</a>
          <a-divider type="vertical"/>
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link" :disabled="record.status === '0'?false:true">-->
<!--              <span>更多 <a-icon type="down"/></span>-->
<!--            </a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a :disabled="record.status === '0'?false:true" v-has="'contract.delete'">删除</a>
                </a-popconfirm>
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->

        </template>

      </a-table>
    </div>
    <!-- table区域 end -->

    <!-- 表单区域 -->
    <contract-modal ref="modalForm" @ok="modalFormOk"/>
    <!--子表区域-->
    <ContractDtlList  @reload="loadData()" :main-id="selectedRowKeys[0]"
                          :pRecord="selectionRows[0]"></ContractDtlList>

  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ContractModal from './modules/ContractModal'
  import ContractDtlSubTable from './subTables/ContractDtlSubTable'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import {commonActionMixin} from '@/mixins/CommonActionMixin'
  import  ContractDtlList from './dtlList/ContractDtlList'
  import {getAction, postAction} from "../../api/manage";
  import {filterDictTextByCache} from "../../components/dict/JDictSelectUtil";
  import JDate from '@/components/jeecg/JDate';


  export default {
    name: 'ContractList',
    mixins: [JeecgListMixin, commonActionMixin],
    provide () {
      return {
        realTimeList: this.loadData,
      }
    },
    components: {
      ContractModal,
      ContractDtlSubTable,
      ContractDtlList,
      JDate
    },
    data() {
      return {
        description: '采购合同主表列表管理页面',
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
            title: '合同号',
            align: 'center',
            dataIndex: 'contractNo',
          },
          {
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
          },
          {
            title: '合同类型',
            align: 'center',
            dataIndex: 'type_dictText'
          },
          {
            title: '审核日期',
            align: 'center',
            dataIndex: 'voucherTime',
          },
          {
            title: '签订日期',
            align: 'center',
            dataIndex: 'signDate',
          },
          {
            title: '签订地点',
            align: 'center',
            dataIndex: 'signPlace',
          },
          {
            title: '合同有效期起',
            align: 'center',
            dataIndex: 'validDateFrom',
          },
          {
            title: '合同有效期止',
            align: 'center',
            dataIndex: 'validDateTo',
          },
          {
            title: '完结标识',
            align: 'center',
            dataIndex: 'contEndFlag',
            customRender: function(value) {
              return filterDictTextByCache('tmm_cont_end_flag', value)
            }
          },
          {
            title: '供方编码',
            align: 'center',
            dataIndex: 'tcsProfileInfCode',
          },
          {
            title: '供方名称',
            align: 'center',
            dataIndex: 'tcsProfileInfName',
          },
          {
            title: '需方（公司）',
            align: 'center',
            dataIndex: 'tbdCompanyId_dictText'
          },
          {
            title: '采购组织',
            align: 'center',
            dataIndex: 'purchaseOrgn_dictText'
          },
          {
            title: '采购合同单据号',
            align: 'center',
            dataIndex: 'contractNumber'
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
          list: '/mm/contract/list',
          delete: '/mm/contract/delete',
          deleteBatch: '/mm/contract/deleteBatch',
          exportXlsUrl: '/mm/contract/exportXls',
          importExcelUrl: '/mm/contract/importExcel',
          check:'/mm/contract/check',
          over:'/mm/contract/over',
        },
      }
    },
    computed: {
      importExcelUrl() {
        return window._CONFIG['domianURL'] + this.url.importExcelUrl
      }
    },
    methods: {
      over() {
        var checkedCount = 0
        var endCount = 0
        if (!this.url.over) {
          this.$message.error('请设置url.over属性!')
          return
        }
        let unOverRows = []
        const { selectedRowKeys, selectionRows } = this

        for (let i = 0; i < selectedRowKeys.length; i++) {
          if (selectionRows[i].status == '1' ) {
                     checkedCount++
            if(selectionRows[i].contEndFlag == '0'){
              unOverRows.push(selectionRows[i])
            }
            else{
              endCount++
            }
          }
        }
        //如果需完结, 则打包数据发送到后台
        if (unOverRows.length > 0) {
          let promise = new Promise((resolve, reject) => {
            //可以是多条记录, 后台用集合接收
            postAction(this.url.over, unOverRows).then(res => {
              if (res.success) {
                resolve(res.result)
              } else {
                reject('failure')
              }
            })
          })
          promise.then((res) => {
            this.loadData()
           this.$message.success(res)
          })
        }
        else {
           if(endCount == selectedRowKeys.length){
             this.$message.warn('不可重复进行完结操作')
             return
           }
           if(checkedCount == 0){
             this.$message.warn('请先审核')
             return
           }
           this.$message.warn('请先审核再完结')
        }
      },
      // over(){
      //   postAction(this.url.over, {ids:this.selectedRowKeys}).then((res) => {
      //
      //   })
      // },
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



