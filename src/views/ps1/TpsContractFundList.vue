<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'contractfund:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('合同资金表')" v-has="'contractfund:download'">导出</a-button>
      <a-button @click="check" type="primary" icon="check" v-has="'contractfund:edit'">审核</a-button>
      <!--<a-upload-->
        <!--name="file"-->
        <!--:showUploadList="false"-->
        <!--:multiple="false"-->
        <!--:headers="tokenHeader"-->
        <!--:action="importExcelUrl"-->
        <!--@change="handleImportExcel">-->
          <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" v-has="'contractfund:delete_all'" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          <a-menu-item key="2" v-has="'contractfund:edit'" @click="check"><a-icon type="check"/>审核</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
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
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <a @click="handleEdit(record)"
             :disabled="record.status === '0' ? false:true"
             v-has="'contractfund:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a :disabled="record.status === '0' ? false:true" v-has="'contractfund:delete'">删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <tpsContractFund-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></tpsContractFund-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TpsContractFundModal from './modules/TpsContractFundModal'
  import { commonActionMixin } from '../../mixins/CommonActionMixin'


  export default {
    name: "TpsContractFundList",
    mixins:[JeecgListMixin,commonActionMixin],
    components: { TpsContractFundModal},
    props:{
      mainId:{
        type:String,
        default:'',
        required:false
      }
    },
    watch:{
      mainId:{
        immediate: true,
        handler(val) {
          if(!this.mainId){
            this.clearList()
          }else{
            this.queryParam['contractId'] = val
            this.loadData(1);
          }
        }
      }
    },
    data () {
      return {
        description: '合同信息表管理页面',
        disableMixinCreated:true,
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'合同ID',
            align:"center",
            dataIndex: 'contractId'
          },
          {
            title:'收付款日期',
            align:"center",
            dataIndex: 'fundDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'资金类型',
            align:"center",
            dataIndex: 'fundType_dictText'
          },
          {
            title:'交易类型',
            align:"center",
            dataIndex: 'fundBusiType_dictText'
          },
          {
            title:'金额',
            align:"center",
            dataIndex: 'fundAmount'
          },
          {
            title:'汇票日期',
            align:"center",
            dataIndex: 'draftDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'出票银行',
            align:"center",
            dataIndex: 'draftBank_dictText'
          },
          {
            title:'交易银行',
            align:"center",
            dataIndex: 'cashBank_dictText'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status_dictText'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remark'
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
          list: "/ps1/tpsContract/listTpsContractFundByMainId",
          delete: "/ps1/tpsContract/deleteTpsContractFund",
          deleteBatch: "/ps1/tpsContract/deleteBatchTpsContractFund",
          exportXlsUrl: "/ps1/tpsContract/exportTpsContractFund",
          importUrl: "/ps1/tpsContract/importTpsContractFund",
          check:"/ps1/tpsContract/checkTpsContractFund",
        },
        dictOptions:{
         status:[],
        },

      }
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importUrl}/${this.mainId}`;
      }
    },
    methods: {
      clearList(){
        this.dataSource=[]
        this.selectedRowKeys=[]
        this.ipagination.current = 1
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
