<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'csPoa.add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('客商委托书')" v-has="'csPoa.exportXls'">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import" v-has="'csPoa.importExcel'">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" v-has="'csPoa.deleteBatch'"><a-icon type="delete"/>删除</a-menu-item>
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
          <a @click="handleEdit(record)" v-has="'csPoa.edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-has="'csPoa.del'">删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <profilePoa-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></profilePoa-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProfilePoaModal from './modules/ProfilePoaModal'
  import {filterDictTextByCache} from '@/components/dict/JDictSelectUtil'



  export default {
    name: "ProfilePoaList",
    mixins:[JeecgListMixin],
    components: { ProfilePoaModal },
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
            this.queryParam['csId'] = val
            this.loadData(1);
          }
        }
      }
    },
    data () {
      return {
        description: '客商基础信息管理页面',
        disableMixinCreated:true,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          /*{
            title:'客商标识',
            align:"center",
            dataIndex: 'csFlag',
            customRender:function (text) {
              return filterDictTextByCache('cs_flag',text)
            }
          },*/
          {
            title:'委托人身份证号码',
            align:"center",
            dataIndex: 'clientIdNum'
          },
          {
            title:'委托人职务',
            align:"center",
            dataIndex: 'clientDuty'
          },
          {
            title:'委托人联系电话',
            align:"center",
            dataIndex: 'clientContact'
          },
          {
            title:'受托人姓名',
            align:"center",
            dataIndex: 'trusteeName'
          },
          {
            title:'受托人性别',
            align:"center",
            dataIndex: 'trusteeSex',
            customRender:function (text) {
              return filterDictTextByCache('sex',text)
            }
          },
          {
            title:'受托人职务',
            align:"center",
            dataIndex: 'trusteeDuty'
          },
          {
            title:'受托人联系电话',
            align:"center",
            dataIndex: 'trusteePhone'
          },
          {
            title:'受托人身份证号',
            align:"center",
            dataIndex: 'trusteeIdNum'
          },
          {
            title:'委托起始日期',
            align:"center",
            dataIndex: 'beginDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'委托终止日期',
            align:"center",
            dataIndex: 'endDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
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
          list: "/bcs/profileInf/listProfilePoaByMainId",
          delete: "/bcs/profileInf/deleteProfilePoa",
          deleteBatch: "/bcs/profileInf/deleteBatchProfilePoa",
          exportXlsUrl: "/bcs/profileInf/exportProfilePoa",
          importUrl: "/bcs/profileInf/importProfilePoa",
        },
        dictOptions:{
         isUse:[],
         isCheck:[],
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
