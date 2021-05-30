<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!--<a-col :xl="6" :lg="7" :md="8" :sm="24">-->
            <!--<a-form-item label="合同号">-->
              <!--<a-input placeholder="请输入合同号" v-model="queryParam.contractNo"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <a-col :xl="8" :lg="11" :md="12" :sm="24">
            <a-form-item label="合同标题">
              <a-input placeholder="请输入合同标题"  v-model="queryParam.contractTitle"></a-input>
              <!--<span class="query-group-split-cust"></span>-->
              <!--<a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.contractTitle_end"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          <a-form-item label="状态">
            <j-dict-select-tag v-model="queryParam.status" dictCode="ps_contract_status" placeholder="请选择状态"/>
          </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" v-has="'contract:select'" icon="search">查询</a-button>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" v-has="'contract:add'" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" v-has="'contract:download'" @click="handleExportXls('合同信息表')">导出</a-button>
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <a-button @click="check"  v-has="'contract:edit'" icon="check">审核</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type:'radio'}"
        :customRow="clickThenSelect"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'contract:edit'">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'contract:delete'">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="合同资金表" key="1" >
        <TpsContractFundList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <tpsContract-modal ref="modalForm" @ok="modalFormOk"></tpsContract-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TpsContractModal from './modules/TpsContractModal'
  import { getAction } from '@/api/manage'
  import TpsContractFundList from './TpsContractFundList'
  import { commonActionMixin } from '../../mixins/CommonActionMixin'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "TpsContractList",
    mixins:[JeecgListMixin,commonActionMixin],
    components: {
      TpsContractFundList,
      TpsContractModal
    },
    data () {
      return {
        description: '合同信息表管理页面',
        // 表头
        columns: [
          {
            title:'合同号',
            align:"center",
            dataIndex: 'contractNo'
          },
          {
            title:'合同标题',
            align:"center",
            dataIndex: 'contractTitle'
          },
          {
            title:'币别',
            align:"center",
            dataIndex: 'payBb_dictText'
          },
          {
            title:'合同金额',
            align:"center",
            dataIndex: 'contractAmount'
          },
          {
            title:'合同生效期',
            align:"center",
            dataIndex: 'beginDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'合同截止期',
            align:"center",
            dataIndex: 'endDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'甲方公司名称',
            align:"center",
            dataIndex: 'partyAName'
          },
          {
            title:'乙方公司名称',
            align:"center",
            dataIndex: 'partyBName'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status_dictText',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/ps1/tpsContract/list",
          delete: "/ps1/tpsContract/delete",
          deleteBatch: "/ps1/tpsContract/deleteBatch",
          exportXlsUrl: "/ps1/tpsContract/exportXls",
          importExcelUrl: "ps1/tpsContract/importExcel",
          check: '/ps1/tpsContract/check',
        },
        dictOptions:{
         status:[],
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        selectedMainId:''

      }
    },
    created() {
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
        initDictOptions('').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'status', res.result)
          }
        })
      },
      clickThenSelect(record) {
        return {
          on: {
            click: () => {
              this.onSelectChange(record.id.split(","), [record]);
            }
          }
        }
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.selectedMainId=''
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedMainId=selectedRowKeys[0]
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.onClearSelected()
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
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>