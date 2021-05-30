<template>
  <a-card :bordered="false" >
    <div v-if="!jobPlanVisible">


    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称"
                       v-model="queryParam.projectName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="状态">
              <j-dict-select-tag placeholder="请选择状态"
                                 v-model="queryParam.status"
                                 dictCode="tps_project_status" />
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="primary"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd"
                type="primary"
                icon="plus"
                v-has="'ps:project:handleAdd'">新增</a-button>
      <a-button type="primary"
                icon="check"
                @click="check"
                v-has="'ps:project:handleCheck'">审核通过</a-button>
      <!-- <a-button type="primary"
                icon="check"
                @click="checkPass"
                v-has="'ps:project:handleCheck'">审核不通过</a-button> -->
      <a-button type="primary"
                icon="download"
                @click="handleExportXls('项目基础信息表')"
                v-has="'ps:project:handleExportXls'"> 导出</a-button>
      <a-button type="primary"
                icon="edit"
                @click="editJob">维护作业</a-button>

    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px"
           @click="onClearSelected">清空</a>
      </div>

      <a-table ref="table"
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

        <template slot="action"
                  slot-scope="text, record">

          <a @click="handleDetail(record)"
             v-has="'ps:project:handleDetail'">查看</a>
          <a-divider type="vertical"
                     v-show="record.status === '0' ? true:false" />

          <a @click="handleEdit(record)"
             v-has="'ps:project:handleEdit'"
             v-show="record.status === '0' ? true:false">编辑</a>
          <a-divider type="vertical"
                     v-show="record.status === '0' ? true:false" />

          <a-popconfirm title="确定删除吗?"
                        @confirm="() => handleDelete(record.id)">
            <a v-show="record.status === '0' ? true:false"
               v-has="'ps:project:handleDelete'">删除</a>
          </a-popconfirm>

        </template>

      </a-table>
    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="项目费用表"
                  key="1">
        <ProjectCostList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <project-modal ref="modalForm"
                   @ok="modalFormOk"></project-modal>
    </div>
    <JobPlanMain ref="jobPlanMain" @ok="closeJobPlan" v-if="jobPlanVisible"> </JobPlanMain>
  </a-card>

</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ProjectModal from './modules/ProjectModal'
import { getAction } from '@/api/manage'
import { commonActionMixin } from '../../mixins/CommonActionMixin'
import JobPlanMain from './PsJobPlanMain'
import ProjectCostList from './ProjectCostList'
import '@/assets/less/TableExpand.less'

export default {
  name: "ProjectList",
  mixins: [JeecgListMixin, commonActionMixin],
  components: {
    ProjectCostList,
    ProjectModal,
    JobPlanMain
  },
  data () {
    return {
      description: '项目基础信息表管理页面',
      // 表头
      columns: [
        {
          title: '项目编号',
          align: "center",
          dataIndex: 'projectNo'
        },
        {
          title: '项目名称',
          align: "center",
          dataIndex: 'projectName'
        },
        {
          title: '经办人',
          align: "center",
          dataIndex: 'operator'
        },
        {
          title: '甲方',
          align: "center",
          dataIndex: 'partyAName'
        },
        {
          title: '已方',
          align: "center",
          dataIndex: 'partyBName'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText'
        },
        {
          title: '开始日期',
          align: "center",
          dataIndex: 'beginDate',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '项目负责人',
          align: "center",
          dataIndex: 'projectManager'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 147,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/ps/project/list",
        delete: "/ps/project/delete",
        deleteBatch: "/ps/project/deleteBatch",
        exportXlsUrl: "/ps/project/exportXls",
        importExcelUrl: "ps/project/importExcel",
        check: '/ps/project/check',
      },
      dictOptions: {
      },
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      selectedMainId: '',
      jobPlanVisible: false

    }
  },
  created () {
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    initDictConfig () {
    },
    clickThenSelect (record) {
      return {
        on: {
          click: () => {
            this.onSelectChange(record.id.split(","), [record]);
          }
        }
      }
    },
    onClearSelected () {
      this.selectedRowKeys = [];
      this.selectionRows = [];
      this.selectedMainId = ''
    },
    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedMainId = selectedRowKeys[0]
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
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
      this.onClearSelected()
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    //审核不通过
    checkPass () {

    },
    //维护作业
    editJob () {
      this.jobPlanVisible = true
      var id = this.selectedMainId
      this.$nextTick(()=>{
        this.$refs.jobPlanMain.init(id);
      })

    },
    closeJobPlan(){
      this.jobPlanVisible = false
      this.loadData()
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>