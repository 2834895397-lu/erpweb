<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="PreHandleOk"
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


      <!--企业名称-->
      <h3 style="display:inline-block">企业名称：</h3>
      <a-input style="width: 20%;margin-right:410px" :value="pRecord.enterpriseName" disabled/>

      <!--报价日期-->
      <h3 style="display:inline-block" right="15px">请选择报价日期：</h3>
      <j-date placeholder="请选择报价日期" v-model="date" style="width: 20%"/>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <!--报价-->
        <!--          <span slot="inputPrice" slot-scope="text, record" width="150px">
                  <a-input id="inputPrice" width="80%"></a-input>
                </span>


                &lt;!&ndash;报价数量&ndash;&gt;
                <span slot="inputCount" slot-scope="text, record" width="150px">
                  <a-input id="inputCount" width="80%" :value="record.measureNum"></a-input>
                </span>-->

        <!--报价数量-->
        <template slot="offerNum" slot-scope="text, record">
        <a-input v-model="record.offerNum"
                 @blur="onCellChange(record.biddingDetailId, 'offerNum', record.offerNum)"></a-input>

<!--          <editable-cell :text="record.measureNum" :value="record.measureNum"
                         @change="onCellChange(record.biddingDetailId, 'offerNum', $event)"/>-->
        </template>
        <!--报价-->
        <template slot="offerPrice" slot-scope="text, record">
          <a-input v-model="record.offerPrice"
                   @blur="onCellChange(record.biddingDetailId, 'offerPrice', record.offerPrice)"></a-input>

<!--          <editable-cell :text="record.offerPrice+''" :value="record.offerPrice"
                         @change="onCellChange(record.biddingDetailId, 'offerPrice', $event)"/>-->
        </template>


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
import {postAction} from '@api/manage'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import AInputSearch from "ant-design-vue/es/input/Search"
import JDate from '@/components/jeecg/JDate'
import EditableCell from "@views/bm/modules/EditableCell";

export default {
  name: 'PriceForm',
  mixins: [JeecgListMixin],
  components: {AInputSearch, JDate, EditableCell},

  // ERP子表定点刷新
  inject:{
    realTimeList:{
      type: Function
    },
  },
  props: {
    pRecord: {
      type: Object,
      default: () => ({})

    }
  },
  data() {
    return {
      measureNum:0,
      date: '',
      visible: false,
      title: '报价申请',
      width: 1100,
      height: 900,
      disableSubmit: false,
      loading: false,
      //分页信息
      description: '报价详情',
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
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'materielName'
        },
        {
          title: '招标数量',
          align: 'center',
          dataIndex: 'measureNum'
        },
        {
          title: '计量单位',
          align: 'center',
          dataIndex: 'measureUnitName'
        },
        {
          title: '报价',
          align: 'center',
          dataIndex: 'offerPrice',
          scopedSlots: {customRender: 'offerPrice'},
        },
        {
          title: '报价数量',
          align: 'center',
          dataIndex: 'offerNum',
          scopedSlots: {customRender: 'offerNum'},
        },
      ],
      url: {
        getCompanyOffer: '/bm/biddingInf/getCompanyOffer',
        add: '/bm/biddingInf/addPriceForm'
      },
      dictOptions: {
        type: [],
        status: []
      }

    }
  },

  methods: {

    handleChange(e){
    },

    /** 确定按钮点击事件 */
    PreHandleOk(){
      this.handleOk();
    },


    onCellChange(id, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find(item => item.biddingDetailId === id);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },

    loadData() {
     /* if(this.pRecord.id.length != 1){
        console.log(this.pRecord.id.length)
        this.$message.warning('请勾选一条记录')
        return
      }*/
     // this.visible = true
      // let CompanyId;
      console.log(this.pRecord)
      postAction(this.url.getCompanyOffer, this.pRecord).then(res => {
        if (res.length == 0) {
          this.$message.warning('请勾选一条记录')
          return
        }
        this.visible = true
        this.dataSource = res
      })
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
      this.onClearSelected();
    },
    handleOk() {
      console.log(this.dataSource, 'dataSource')
      postAction(this.url.add + '?companyId=' + this.pRecord.id + '&date=' + this.date, this.dataSource).then(res => {
        if (res.success) {
          this.$message.success(res.result);
          this.realTimeList();
        } else {
          this.$message.error('添加失败');
        }
      })
      this.onClearSelected();
      this.dataSource = []
      this.date = ''
      this.visible = false
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  },
}
</script>