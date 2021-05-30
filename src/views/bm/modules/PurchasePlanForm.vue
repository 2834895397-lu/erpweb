<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @ok="PreHandleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="采购申请号">
                <a-input v-model="queryParam.planNo" placeholder="请输入采购申请号"/>
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="采购申请日期">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.beginTime"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.endTime"></j-date>
              </a-form-item>
            </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span class="table-page-search-submitButtons table-operator">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
            </span>
              </a-col>
          </a-row>
        </a-form>

      </div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
import {getAction, postAction} from '@api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDate from "@comp/jeecg/JDate";
import {filterObj} from "@/utils/util";


  export default {
    name: 'PurchasePlanForm',
    components: {JDate},
    // ERP子表实时刷新
    inject:{
      realTimeList:{
        type: Function
      },
    },
    props: {
      pId: {
        type:Array,
        default: ''

      }
    },
    mixins: [JeecgListMixin],

    data() {
      return {
        visible: false,
        title: '',
        width: 1100,
        height: 900,
        disableSubmit: false,
        loading: false,
        queryParam: {},
        isorter:{
          column: 'createTime',
          order: 'desc',
        },
        /* 筛选参数 */
        filters: {},
        superQueryParams: '',/*
        /** 高级查询拼接方式 */
        superQueryMatchType: 'and',
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
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },

          {
            title: '采购申请号',
            align: 'center',
            dataIndex: 'planNo',
          },
          {
            title: '凭证日期',
            align: 'center',
            dataIndex: 'planDate',
          },
          {
            title: '物料编号',
            align: 'center',
            dataIndex: 'materielNo',
          },
          {
            title: '物料名称',
            align: 'center',
            dataIndex: 'materielName',
          },
          {
            title: '计量单位',
            align: 'center',
            dataIndex: 'measureUnitName'
          },
          {
            title: '数量',
            align: 'center',
            dataIndex: 'measureNum',
          },
        ],
        url: {
          getPurchaseDetail: '/bm/biddingInf/purchaseDetail',
          addMaterialDtl:'/bm/biddingInf/addMaterialDtl',
          listPlanNo:'/bm/biddingInf/listPlanNo'
        },
        dictOptions: {
          type: [],
          status: []
        }

      }
    },

    methods: {
      /** 确定按钮点击事件 */
      PreHandleOk(){
        this.handleOk();
        this.realTimeList();
      },

      searchQuery() {
        this.loadData1(1);
      },
      loadData1(params) {
     /*   if(!this.url.listPlanNo){
          this.$message.error("请设置url.list属性!")
          return
        }else {*/
          /* //加载数据 若传入参数1则加载第一页的内容
        if (params === 1) {
          this.ipagination.current = 1;
        }*/
          var params = this.getQueryParams();//查询条件
          this.loading = true;
          getAction(this.url.listPlanNo, params).then((res) => {
            console.log(params);
            if (res.length==0) {
              this.$message.warning('没有该采购申请号!')

              /*this.dataSource = res.result.records;
              this.ipagination.total = res.result.total;*/
             /* this.dataSource = []
              this.selectedRowKeys = []*/
              this.visible = true

            }else{
              this.dataSource=res
              this.visible=true
            }
            /*if (res.code === 510) {
              this.$message.warning(res.message)
            }
            this.loading = false;*/
          })
        this.loading = false;
      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        //TODO 字段权限控制
        var str = "id,";
        this.columns.forEach(function (value) {
          str += "," + value.dataIndex;
        });
        return str;
      },
      //采购申请明细查询
      loadData() {
        if(this.pId.length != 1){
          this.$message.warning('请勾选一条记录')
          return
        }
       getAction(this.url.getPurchaseDetail ).then(res => {
          if (res.length == 0) {
          this.$message.warning('没有采购申请!!!')
            this.dataSource = []
            this.selectedRowKeys = []
            this.visible = false
          return
        }else {
            this.dataSource = res
            this.visible = true
          }

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
        if(this.selectionRows.length == 0){
          this.$message.error("请勾选要添加的数据???")
          return
        }
        postAction(this.url.addMaterialDtl+'?id='+this.pId[0],this.selectionRows).then(res => {
          if(res.success){
            this.$message.success(res.result)
          }else {
            this.$message.error('添加失败!')
          }
        })



        this.visible = false
        this.onClearSelected();
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