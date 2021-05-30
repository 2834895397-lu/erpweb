<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <a-button @click="handleAdd" type="primary" icon="plus" v-if="false" v-has="'bcsTypeLevel.add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('客商类型等级表')" v-has="'bcsTypeLevel.exportXls'">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import" v-has="'bcsTypeLevel.importExcel'">导入</a-button>
      </a-upload>
      <a-button @click="resume" type="primary" icon="select" v-has="'bcsTypeLevel.resume'">查看履历</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" v-has="'bcsTypeLevel.del'"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px" v-if="false"> 批量操作 <a-icon type="down" /></a-button>
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
          <a @click="handleEdit(record)" v-has="'bcsTypeLevel.edit'">编辑</a>
          <a-divider type="vertical"  v-if="false"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-if="false">删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <template>
      <j-modal
        :title="resumeText"
        :width="500"
        :visible="showResume"
        switchFullscreen
        @ok="handleResume"
        @cancel="closeResume"
        cancelText="关闭"
        okText="确定">
        <a-table
          ref="table"
          size="middle"
          bordered
          :scroll="{x:true}"
          :columns="resumeColumns"
          :dataSource="resumeDataSource"
          :pagination="resumePagination"
          :loading="loading">
        </a-table>
      </j-modal>
    </template>

    <profileTypeLevel-modal @update_data="update_data" ref="modalForm" @ok="modalFormOk" :mainId="mainId"></profileTypeLevel-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProfileTypeLevelModal from './modules/ProfileTypeLevelModal'
  import {filterDictTextByCache} from '@/components/dict/JDictSelectUtil'
  import { postAction,deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'



  export default {
    name: "ProfileTypeLevelList",
    mixins:[JeecgListMixin],
    components: { ProfileTypeLevelModal },
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
        showResume: false,
        resumeDataSource: [],
        resumeTable:'tcsProfileTypeLevelHis',
        resumeText: '查看履历',
        loading:false,
        resumePagination:true,
        /*resumePagination:true,*/
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
          {
            title:'客商类型',
            align:"center",
            dataIndex: 'csType',
            customRender:function (text) {
                return filterDictTextByCache('cs_type',text)
            }
          },
          {
            title:'客商等级',
            align:"center",
            dataIndex: 'csLevel',
            customRender:function (text) {
              if (text==="暂无"){
                return "暂无"
              } else{
                return filterDictTextByCache('cs_level',text)
              }
            }
          },
          {
            title:'生效时间',
            align:"center",
            dataIndex: 'effectiveTime',
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
        resumeColumns: [
          {
            title: '客户类型',
            align: "center",
            dataIndex: 'csType',
            customRender: function (text) {
              return filterDictTextByCache('cs_type', text)
            }
          },
          {
            title: '客户等级',
            align: "center",
            dataIndex: 'csLevel',
            customRender: function (text) {
              if (text === '暂无') {
                return "暂无"
              } else {
                return filterDictTextByCache('cs_level', text)
              }
            }
          },
          {
            title: '生效时间',
            align: "center",
            dataIndex: 'effectiveTime',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
        ],
        url: {
          list: "/bcs/profileInf/listProfileTypeLevelByMainId",
          delete: "/bcs/profileInf/deleteProfileTypeLevel",
          deleteBatch: "/bcs/profileInf/deleteBatchProfileTypeLevel",
          exportXlsUrl: "/bcs/profileInf/exportProfileTypeLevel",
          importUrl: "/bcs/profileInf/importProfileTypeLevel",
          resume: "/bcs/profileInf/resume",
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
    created(){
      this.loadData();
    },
    methods: {
      batchDel: function () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          var that = this;
          this.$confirm({
            title: "确认删除",
            content: "是否删除选中数据?",
            onOk: function () {
              deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                  that.update_data();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleDelete: function (id) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
            this.$emit('update_data');
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      update_data(){
        this.$emit('update_data');
      },
      clearList(){
        this.dataSource=[]
        this.selectedRowKeys=[]
        this.ipagination.current = 1
        /*this.$emit('update_data');*/
      },
      resume() {
        postAction(this.url.resume, this.dataSource).then((res) => {
          if (res.success) {
            this.showResume = true;
            this.resumeDataSource = res.result;
          }else{
            this.$message.warning("没有权限，请联系管理员授权")
          }
        });
      },
      closeResume() {
        this.showResume = false;
      },
      handleResume() {
        this.showResume = false;
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
