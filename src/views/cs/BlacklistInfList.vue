<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

         <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="客户名称">
              <a-input placeholder="请输入客户名称" v-model="queryParam.csName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>-->

        </a-row>
      </a-form>
    </div>


    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="recoverStatus">恢复</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('黑名单管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt=""
               style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <blacklist-inf-modal ref="modalForm" @ok="modalFormOk"></blacklist-inf-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import {mixinDevice} from '@/utils/mixin'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import BlacklistInfModal from './modules/BlacklistInfModal'
  import {filterDictTextByCache, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {getAction, httpAction, postAction} from '@/api/manage'

  export default {
    name: 'BlacklistInfList',
    mixins: [JeecgListMixin, mixinDevice],
    components: {
      BlacklistInfModal
    },
    data() {
      return {
        description: '黑名单管理管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '客商名称',
            align: "center",
            dataIndex: 'csId'
          },
          {
            title: '客商标识',
            align: "center",
            dataIndex: 'csFlag',
            customRender: function (text) {
              return filterDictTextByCache('cs_flag', text)
            }
          },
          {
            title: '进入黑名单原因',
            align: "center",
            dataIndex: 'blackReason'
          },
          {
            title: '进入黑名单时间',
            align: "center",
            dataIndex: 'blackDate',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            customRender: function (text) {
              return filterDictTextByCache('blacklist_status', text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: {customRender: 'action'}
          }
        ],
        url: {
          list: "/cs/blacklistInf/list",
          delete: "/cs/blacklistInf/delete",
          deleteBatch: "/cs/blacklistInf/deleteBatch",
          exportXlsUrl: "/cs/blacklistInf/exportXls",
          importExcelUrl: "cs/blacklistInf/importExcel",
          recoverBlack: "cs/blacklistInf/recoverBlacklist"
        },
        dictOptions: {},
      }
    },
    created() {
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      recoverStatus() {
        let selectkeys = this.selectedRowKeys;

        postAction(this.url.recoverBlack, selectkeys).then((res) => {
          if (res.result==='操作成功') {
            this.$message.success(res.result);
            this.loadData();
            this.clearSelected();
          } else {
            this.$message.warning(res.result)
          }
        })

      },
      initDictConfig() {
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>