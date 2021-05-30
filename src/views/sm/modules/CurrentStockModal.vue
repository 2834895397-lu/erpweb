<template>
  <j-modal
    :title="title"
    :width="width"
    :height="height"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>


      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="库存地">
                <j-tree-select dict="tbd_node,name,id" pid-field="pid" pidValue="0" v-model="queryParam.toTbdNodeId"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物料">
                <j-tree-select dict="tbd_material,name,id" pid-field="pid" pidValue="0" placeholder="请输入物料"
                               v-model="queryParam.tbdMaterialId"/>
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

      <a-table
        ref="table"
        size="middle"
        bordered
        :height="height"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

  </j-modal>
</template>

<script>
import { getAction } from '@api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@comp/jeecg/JDate'
import JTreeSelect from '@comp/jeecg/JTreeSelect'

export default {
  name: 'CurrentStockModal',
  components: { JDate, JTreeSelect },
  mixins: [JeecgListMixin],
  data() {
    return {
      visible: false,
      title: '',
      width: 1100,
      height: 900,
      disableSubmit: false,
      loading: false,
      //分页信息
      description: '实时库存',
      disableMixinCreated: true,
      /* 数据源 */
      dataSource: [],
      //选中记录的id
      selectedRowKeys: [],
      //选中行
      selectionRows: [],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '库存地',
          align: 'center',
          dataIndex: 'toTbdNodeName'
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'tbdMaterialName'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'count'
        }
      ],
      url: {
        getCurrentStock: '/sm/matlStock/currentStock'
      },
      dictOptions: {
        type: [],
        status: []
      }

    }
  },

  methods: {
    loadData(args) {
      /* var params = this.getQueryParams();//查询条件
       this.loading = true;*/
      var params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.getCurrentStock, params).then(res => {
        if (res.length == 0) {
          this.$message.warning('流水表数据为空')
          return
        }
        this.dataSource = res
        this.visible = true
      })
      this.loading = false
    },
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.onClearSelected()
      this.ipagination.current = 1
      this.clearQueryParam()
    },
    handleOk() {
      this.visible = false
      this.onClearSelected()
      this.ipagination.current = 1
      this.clearQueryParam()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    clearQueryParam() {
      this.queryParam.tbdMaterialId = ''
      this.queryParam.toTbdNodeId = ''
    }
  }
}
</script>