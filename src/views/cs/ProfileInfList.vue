<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="客户代码">
              <a-input placeholder="请输入客户代码" v-model="queryParam.csCode"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="客户名称">
              <a-input placeholder="请输入客户名称" v-model="queryParam.csName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="注册省市">
              <j-tree-select
                placeholder="请输入注册地省市"
                dict="place,province_or_city,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child"
                v-model="queryParam.regisPlace">
              </j-tree-select>
              <!--<a-input placeholder="请输入注册省市" v-model="queryParam.csLevel"></a-input>-->
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="客户类型">
              <j-dict-select-tag v-model="queryParam.csType" dictCode="cs_type" placeholder="请选择客商类型"/>
              <!--<a-input placeholder="请输入客户类型" v-model="queryParam.csType"></a-input>-->
            </a-form-item>
          </a-col>


          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="客户等级">
              <j-dict-select-tag v-model="queryParam.csLevel" dictCode="cs_level" placeholder="请选择客商等级"/>

              <!--<a-input placeholder="请输入客户等级" v-model="queryParam.csLevel"></a-input>-->
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
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus"  v-has="'cs:profile:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('客户基础信息')" v-has="'cs.profile.exportXls'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import" v-has="'cs.profile.importExcel'">导入</a-button>
      </a-upload>
      <a-button type="primary" @click="applyRegular" v-has="'cs.profile.turnToFormal'">转为正式</a-button>
      <a-button type="primary" @click="counter_check" v-has="'cs.profile.turnToInformal'">转为非正式</a-button>
      <a-button type="primary" @click="turnToBlacklist" class="blacklist" v-has="'cs.profile.turnToBlacklist'">转为黑名单</a-button>
      <a-button type="primary" @click="removeBlacklist" class="blacklist" v-has="'cs.profile.removeBlacklist'">解除黑名单</a-button>
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
          <a @click="handleEdit(record)" v-has="'cs.profile.edit'">编辑</a>

          <a-divider type="vertical"/>
          <!--<a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>-->
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a v-has="'cs.profile.del'">删除</a>
                </a-popconfirm>
          <!--</a-menu-item>
        </a-menu>
      </a-dropdown>-->
        </span>

      </a-table>


    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="客户类型" key="1" forceRender>
        <ProfileTypeLevelList :key="timer" :refresh-flag="refreshFlag" @update_data="update_data()" :mainId="selectedMainId"/>
      </a-tab-pane>
      <a-tab-pane tab="客户银行账户" key="2" forceRender>
        <ProfileBankList  :mainId="selectedMainId"/>
      </a-tab-pane>
      <a-tab-pane tab="客户归属信息" key="3" forceRender>
        <ProfileBelongList :mainId="selectedMainId"/>
      </a-tab-pane>
      <a-tab-pane tab="客户经营品种" key="4" forceRender>
        <ProfileProductList :mainId="selectedMainId"/>
      </a-tab-pane>
      <a-tab-pane tab="客户委托书" key="5">
        <ProfilePoaList :mainId="selectedMainId"/>
      </a-tab-pane>
      <a-tab-pane tab="客户收货人" key="6" forceRender>
        <ProfileCneeList :mainId="selectedMainId"/>
      </a-tab-pane>
      <!--<a-tab-pane tab="供应商资质信息" key="7" forceRender>
        <ProfileQualifiList :mainId="selectedMainId" />
      </a-tab-pane>-->

    </a-tabs>

    <profileInf-modal ref="modalForm" @ok="modalFormOk"></profileInf-modal>
  </a-card>
</template>

<script>



  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import ProfileInfModal from './modules/ProfileInfModal'
  import {deleteAction, getAction} from '@/api/manage'
  import ProfilePoaList from './ProfilePoaList'
  import ProfileCneeList from './ProfileCneeList'
  import ProfileBankList from './ProfileBankList'
  import ProfileBelongList from './ProfileBelongList'
  import ProfileProductList from './ProfileProductList'
  import ProfileTypeLevelList from './ProfileTypeLevelList'
  import {filterDictTextByCache, filterMultiDictText, initDictOptions} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import JTreeSelect from "@/components/jeecg/JTreeSelect";


  export default {
    name: "ProfileInfList",
    mixins: [JeecgListMixin],

    provide() {
      return {
        data_update: this.loadData
      }
    },
    components: {
      JTreeSelect,
      ProfileTypeLevelList,
      ProfileBankList,
      ProfileBelongList,
      ProfileProductList,
      ProfilePoaList,
      ProfileCneeList,
      /*ProfileQualifiList,*/
      ProfileInfModal
    },
    data() {
      return {
        description: '客户基础信息管理页面',
        cs_flag: "1",


        timer:'',

        key:"1",
        // 表头
        columns: [
          {
            title: '客户代码',
            align: "center",
            dataIndex: 'csCode'
          },
          {
            title: '客户名称',
            align: "center",
            dataIndex: 'csName'
          },
          {
            title: '法人代表',
            align: "center",
            dataIndex: 'legal'
          },
          {
            title: '税号',
            align: "center",
            dataIndex: 'dutySign'
          },
          {
            title: '注册地省市',
            align: "center",
            dataIndex: 'provincesAndCities'
          },
          {
            title: '客户标识',
            align: "center",
            dataIndex: 'csFlag',
            customRender: function (text) {
              return filterDictTextByCache('cs_flag', text)
            }
          },
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
              if (text === "暂无") {
                return "暂无"
              } else {
                return filterDictTextByCache('cs_level', text)
              }
            }
          },
          {
            title: '详细注册地址',
            align: "center",
            dataIndex: 'regisAddress'
          },
          {
            title: '联系电话',
            align: "center",
            dataIndex: 'contaNumber'
          },
          {
            title: '传真',
            align: "center",
            dataIndex: 'fax'
          },
          {
            title: '电子邮箱',
            align: "center",
            dataIndex: 'email'
          },
          {
            title: '办公地址',
            align: "center",
            dataIndex: 'officeAddress'
          },
          /*{
            title: '是否启用',
            align: "center",
            dataIndex: 'isUse',
            customRender: function (text) {
              return filterDictTextByCache('is_use', text)
            }
          },
          {
            title: '审核状态',
            align: "center",
            dataIndex: 'isCheck_dictText',
          },
          {
            title: '审核人',
            align: "center",
            dataIndex: 'checker'
          },
          {
            title: '审核日期',
            align: "center",
            dataIndex: 'checkDate',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/cs/profileInf/list",
          delete: "/cs/profileInf/delete",
          deleteBatch: "/cs/profileInf/deleteBatch",
          exportXlsUrl: "/cs/profileInf/exportXls",
          importExcelUrl: "cs/profileInf/importExcel",
          checkIt: "/cs/profileInf/checkIt",
          counterCheck: "/cs/profileInf/counterCheckIt",
          checkNoPass: "/cs/profileInf/checkNoPass",
          applyRegular: "/cs/profileInf/applyRegular",
          turnToBlacklist : "/cs/profileInf/turnToBlacklist",
          removeBlacklist : "/cs/profileInf/removeBlacklist",
        },
        dictOptions: {
          isUse: [],
          isCheck: [],
        },
        /* 分页参数 */
        ipagination: {
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
        selectedMainId: ''

      }
    },
    created() {
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleDelete: function (id) {
        if (!this.url.delete) {
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        deleteAction(that.url.delete, {id: id, num: this.cs_flag}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //转为正式
      applyRegular() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning("请选择一条记录")
        } else {
          let key = this.selectedRowKeys[0].toString();
          getAction(this.url.applyRegular, {id: key, cs_flag: this.cs_flag}).then((res) => {
            if (res.result === "操作成功") {
              this.$message.success(res.result);
              this.loadData(2);
              this.timer = new Date().getTime();
            }else if (res.result === "已经为正式") {
              this.$message.warning(res.result);
            }else if (res.result === "黑名单不可转为正式"){
              this.$message.error(res.result)
            }else {
              this.$message.warning("没有权限，请联系管理员授权")
            }
          })
        }
      },
      //转为黑名单
      turnToBlacklist() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning("请选择一条记录")
        } else {
          let key = this.selectedRowKeys[0].toString();
          getAction(this.url.turnToBlacklist, {id: key, cs_flag: this.cs_flag}).then((res) => {
            if (res.result === "操作成功") {
              this.$message.success(res.result);
              this.loadData(2);
              this.timer = new Date().getTime();
            } else if (res.result === '已经为黑名单') {
              this.$message.warning(res.result)
            }else{
              this.$message.warning("没有权限，请联系管理员授权")
            }
          })
        }
      },
      //解除黑名单
      removeBlacklist() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning("请选择一条记录")
        } else {
          let key = this.selectedRowKeys[0].toString();
          getAction(this.url.removeBlacklist, {id: key, cs_flag: this.cs_flag}).then((res) => {
            if (res.result === "操作成功") {
              this.$message.success(res.result);
              this.loadData(2);
              this.timer = new Date().getTime();
            } else if(res.result === '该数据不为黑名单'){
              this.$message.warning(res.result)
            }else {
              this.$message.warning("没有权限，请联系管理员授权")
            }
          })
        }
      },
      counter_check() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning("请选择一条记录")
        } else {
          let key = this.selectedRowKeys[0].toString();
          getAction(this.url.counterCheck, {id: key, cs_flag: this.cs_flag}).then((res) => {
            if (res.result === "操作成功") {
              this.$message.success(res.result);
              this.loadData(2);
              this.timer = new Date().getTime();
            }else if (res.result === '黑名单不可转为转为非正式'){
              this.$message.error(res.result);
            } else if(res.result === '已经为非正式'){
              this.$message.warning(res.result);
            }else{
              this.$message.warning("没有权限，请联系管理员授权")
            }
          });
        }
      },
      update_data() {
        this.loadData(2);
      },
      initDictConfig() {
        initDictOptions('is_use').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'isUse', res.result)
          }
        })
        initDictOptions('is_check').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'isCheck', res.result)
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
        this.selectedMainId = ''
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedMainId = selectedRowKeys[0]
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        if (arg != 2) {
          this.onClearSelected()
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            /*this.ipagination.total = res.result.length;*/
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .blacklist{
    background-color: #5c6065;
    border-color: #5c6065;
  }
</style>