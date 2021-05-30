<template>
  <div>
    <div class="table-operator">
    <a-button type="primary"  @click="lookList" v-has="'bm:biddingEnterprise:price'">报价</a-button>
    <a-button type="primary" icon="check"  @click="biddingStatus" :pId="selectedRowKeys" v-has="'bm:biddingEnterprise:bidding'">中标</a-button>
    </div>
    <price-form :pRecord="selectionRows[0]" ref="PriceForm"></price-form>
<!--    <bidding-enterprise-sub-table :pId="selectedRowKeys" ref="BiddingEnterpriseSubTable"/>-->
    <a-table
      rowKey="id"
      size="middle"
      bordered
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :rowSelection="{selectedRowKeys, onChange: onSelectChange,type:'radio' }"
    >

    <template slot="htmlSlot" slot-scope="text">
      <div v-html="text"></div>
    </template>

    <template slot="imgSlot" slot-scope="text">
      <div style="font-size: 12px;font-style: italic;">
        <span v-if="!text">无图片</span>
        <img v-else :src="getImgView(text)" alt="" style="max-width:80px;height:25px;"/>
      </div>
    </template>

    <template slot="fileSlot" slot-scope="text">
      <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
      <a-button
              v-else
              ghost
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)"
      >
        <span>下载</span>
      </a-button>
    </template>


  </a-table>
  </div>
</template>

<script>
import {getAction, postAction} from '@api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BiddingPriceForm from "../modules/BiddingPriceForm";
  import PriceForm from "../modules/PriceForm";

  export default {
    name: 'BiddingEnterpriseSubTable',
    components: {PriceForm, BiddingPriceForm},
    mixins: [JeecgListMixin],
    props: {
      record: {
        type: Object,
        default: null,
      },
      inject:{
        realTimeList:{
          type: Function,
          default: ()=>{}
        },
      },
    },
    data() {
      return {
        description: '招标企业信息表内嵌列表',
        disableMixinCreated: true,
        loading: false,
        dataSource: [],
        columns: [
       /*   {
            title: '招投标号',
            align: 'center',
            dataIndex: 'biddingInfId',

          },*/
          {
            title: '企业编码',
            align: 'center',
            dataIndex: 'enterpriceNo',
          },
          {
            title: '企业名称',
            align: 'center',
            dataIndex: 'enterpriseName',
          },
          {
            title: '中标状态',
            align: 'center',
            dataIndex: 'biddingStatus_dictText',
          },
          {
            title: '中标日期',
            align: 'center',
            dataIndex: 'biddingDate',
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
          },
        ],
        url: {
          listByMainId: '/bm/biddingInf/queryBiddingEnterpriseByMainId',
          status:'/bm/biddingInf/status',
        },
      }
    },
    watch: {
      record: {
        immediate: true,
        handler() {
          if (this.record != null) {
            this.loadData(this.record)
          }
        }
      }
    },
    methods: {

     biddingStatus() {
       console.log(this.selectedRowKeys.length)
       if (this.selectedRowKeys.length ==0) {
         this.$message.warning('请勾选一条记录')
         return
       }
        getAction(this.url.status, {id:this.selectedRowKeys[0]}).then(res => {
         if(res.success){
           this.loadData(this.record)
           //定点刷新
          this.$emit("reLoadData")
          }else{
           this.$message.warning('没有报价或已经中标!!!')
         }
        }).finally(()=>{
         this.loading = false
       })
      },


      loadData(record) {
        this.loading = true
        this.dataSource = []
        getAction(this.url.listByMainId, {
          id: record.id
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
          }
        }).finally(() => {
          this.loading = false
        })
      },

      lookList() {
        this.$refs.PriceForm.loadData()
      },


    },
  }
</script>

<style scoped>

</style>
