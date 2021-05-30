<!--
- @Description: 项目基础信息
- @Author: ljc
- @Date:   2020-11-13
- @Version: V1.0
-->
<template>
  <j-modal
    :fullscreen="true"
    title="WBS分类"
    :visible="visible"
    @ok="setModal1Visible(false)"
    @cancel="setModal1Visible(false)">
    <a-layout>
      <a-layout-sider width="310" style="background: #fff">
        <a-card title="WBS分类" style="width: 310px;padding-right:15px;border-radius: 5px">
          <a-button-group style="margin-bottom: 15px">
            <a-button icon="plus" @click="addWBSNode">新增</a-button>
            <a-button icon="edit">修改</a-button>
            <a-button icon="minus">删除</a-button>
          </a-button-group>

        <a-tree
          checkable
          :replaceFields="fields"
          :auto-expand-parent="autoExpandParent"
          :tree-data="treeData"
          @select="onSelect"/>
        </a-card>

      </a-layout-sider>
      <a-layout style="padding: 0 8px 8px;background-color: #fff">
        <a-layout-content :style="{ background: '#fff', margin: 0 }">
          <a-card title="概要">
            <a-form :form="infos" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
              <a-form-item label="WBS编码:">
                <a-input v-model="infos.code"/>
              </a-form-item>
              <a-form-item label="WBS描述:">
                <a-input v-model="infos.name" />
              </a-form-item>
            </a-form>
          </a-card>

          <a-card title="活动" style="width: 100%;padding-right: 15px;border-radius: 5px">
          <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('项目基础信息')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload>
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
            </a-dropdown>
          </div>
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleWBS(record.id)">查看WBS</a>
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
          </a-card>

        </a-layout-content>
    </a-layout>
    </a-layout>

  </j-modal>
</template>

<script>
  import Vue from 'vue'
  import { axios } from '@/utils/request'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import {Modal, notification} from 'ant-design-vue'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: 'PsWBSModalView',
    mixins:[JeecgListMixin, mixinDevice],
    data () {
      return {
        visible: false,
        baseUrl: '',
        token: '',
        tenantid: '',
        treeData: [],
        fields: {children:'children', title:'name', key:'id' },
        autoExpandParent: true,
        selectedRowKeys: [],
        columns: [
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/ps/psActivity/list",
          delete: "/ps/psActivity/delete",
          deleteBatch: "/ps/psActivity/deleteBatch",
          exportXlsUrl: "/ps/psActivity/exportXls",
          importExcelUrl: "ps/psActivity/importExcel",
        },
        infos: {

        },
        dataSource: [],
        loading: false
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    created() {
      this.token = Vue.ls.get(ACCESS_TOKEN)
      this.baseUrl = `${window._CONFIG['domianURL']}`
    },
    methods: {
      init(val) {
        this.visible = true
        axios({
          url: this.baseUrl + '/ps/psProjInfo/getWbstree',
          method: 'get',
          params: { 'id': val, 'tenantid': this.tenantid }
        }).then((res) => {
          if (res.code === 200) {
            this.treeData = res.result.tree
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      handleEdit () {
      },
      handleTableChange () {
      },
      onSelect(selectedNodes, node, event){
        console.log(selectedNodes)
        console.log(node)
        console.log(event)
      },
      addWBSNode (val) {
        console.log(val)
      },
      setModal1Visible(val){
        this.visible = val
      },
      handleAdd (val){
      },
      downloadFile(){

      }
    }
  }
</script>

<style scoped>

</style>