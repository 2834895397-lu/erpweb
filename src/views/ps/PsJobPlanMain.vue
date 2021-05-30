<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <a-layout-sider width="600" style="background: #fff;" >
        <a-card style="padding-right:15px;border-radius: 5px" :headStyle="headStyle">
          <span slot="title">
            <a-form layout="inline" class="buttons">
              <a-form-item>
                <a-button type="primary" @click="addJob" :disabled="edit[0]">新增</a-button>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="editJob" :disabled="edit[1]">编辑</a-button>
              </a-form-item>
              <a-form-item>
                <a-button :disabled="edit[2]" @click="delJob">删除</a-button>
              </a-form-item>
            </a-form>
          </span>
          <a-table :data-source="job" :scroll="{x:true}" rowKey="id" :pagination='jobPage'
                    bordered :customRow="customRow" :rowClassName="setRowClassName">
            <a-table-column title="项目元素" >
              <template slot-scope="text, record">
                <span slot="icon" style="text-align: center">
                  <a-icon :type="record.text" />
                  {{record.name}}
                </span>
              </template>
            </a-table-column>

            <a-table-column title="预算金额" data-index="wbsBudget" />
            <a-table-column title="操作" data-index="name">
              <template slot-scope="text, record" v-if="record.action">
                <span>
                  <a @click.stop="editPlan" :disabled="record.order">编辑计划</a>
                  <a-divider type="vertical" />
                  <a @click.stop="orderPlan(record.id)" :disabled="record.order">下达计划</a>
                </span>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-layout-sider>

       <a-layout style="padding: 0 8px 8px;background-color: #fff">
        <a-layout-content :style="{ background: '#fff', margin: 0 }">
        <a-card style="padding-right:15px;border-radius: 5px" :headStyle="headStyle">
          <span slot="title">
             <a-form layout="inline" class="buttons" style="text-align: left">
               <a-form-item>
                 <a-button type="primary" @click="addPlan" :disabled="planEdit">新增</a-button>
               </a-form-item>
               <a-form-item>
                 <a-button type="primary" :disabled="!globalEdit" @click="savePlan">保存</a-button>
               </a-form-item>
               <a-form-item>
                 <a-button :disabled="!globalEdit" @click="exitEditPlan">取消</a-button>
               </a-form-item>
             </a-form>
          </span>
          <a-table bordered :data-source="material" :scroll="{x:3000}" rowKey="id" :row-selection="planSelection" :pagination="materialPage">

            <a-table-column title="#" width="80px" align='center'  fixed="left">
              <template slot-scope="text, record, index">
                <span  >{{index +1}}</span>
                <!--                <a-input v-else style="width: 100%"></a-input>-->
              </template>
            </a-table-column>
            <a-table-column title="创建人" data-index="createBy" align='center'>
              <template slot-scope="text, record" data-index="createBy">
                <span  >{{record.createBy}}</span>
                <!--                <a-input v-else style="width: 100%"></a-input>-->
              </template>
            </a-table-column>
            <a-table-column title="创建日期" data-index="createTime" align='center'>
              <template slot-scope="text, record" data-index="createTime">
                <span  >{{record.createTime}}</span>
                <!--                <a-input v-else style="width: 100%"></a-input>-->
              </template>
            </a-table-column>
            <a-table-column title="更新人" data-index="updateBy" align='center'>
              <template slot-scope="text, record" data-index="updateBy">
                <span  >{{record.updateBy}}</span>
                <!--                <a-input v-else style="width: 100%"></a-input>-->
              </template>
            </a-table-column>
            <a-table-column title="更新日期" data-index="updateTime" align='center'>
              <template slot-scope="text, record" data-index="updateTime">
                <span  >{{record.updateTime}}</span>
<!--                <a-input v-else style="width: 100%"></a-input>-->
              </template>
            </a-table-column>
            <a-table-column title="所属部门" data-index="sysOrgCode" align='center'>
              <template slot-scope="text, record" data-index="sysOrgCode">
                <span  v-if="!record.edit">{{record.sysOrgCode}}</span>
                <a-input v-else v-model="record.sysOrgCode" style="width: 100%"></a-input>
              </template>
            </a-table-column>
            <a-table-column title="采购组织" data-index="purchaseOrgId" align='center'>
              <template slot-scope="text, record" data-index="purchaseOrgId">
                  <span  v-if="!record.edit">{{record.purchaseOrgId}}</span>
                  <a-input v-else v-model="record.purchaseOrgId" style="width: 100%"></a-input>
              </template>
            </a-table-column>
            <a-table-column title="物料名称" data-index="materialName" align='center'>
              <template slot-scope="text, record" data-index="materialName">
                <span  v-if="!record.edit">{{record.materialName}}</span>
                <a-input v-else v-model="record.materialName" style="width: 100%"></a-input>
              </template>
            </a-table-column>
            <a-table-column title="物料编码" data-index="materialCode" align='center'>
              <template slot-scope="text, record" data-index="materialCode">
                <span  v-if="!record.edit">{{record.materialCode}}</span>
                <a-input v-else v-model="record.materialCode" style="width: 100%"></a-input>
              </template>
            </a-table-column>
            <a-table-column title="需求数量" data-index="planNum" align='center'>
              <template slot-scope="text, record" data-index="planNum">
                <span  v-if="!record.edit">{{record.planNum}}</span>
                <a-input-number v-else v-model="record.planNum" style="width: 100%"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column title="允许偏差数" data-index="offsetPlanNum" align='center'>
              <template slot-scope="text, record" data-index="offsetPlanNum">
                <span  v-if="!record.edit">{{record.offsetPlanNum}}</span>
                <a-input-number v-else v-model="record.offsetPlanNum" style="width: 100%"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column title="计划交货日期" data-index="tackDate" align='center'>
              <template slot-scope="text, record" data-index="tackDate">
                <span  v-if="!record.edit">{{record.tackDate}}</span>
                <j-date v-else placeholder="请选择计划交货日期" v-model="record.tackDate" v-decorator="['tackDate']" :trigger-change="true" style="width: 100%"/>
              </template>
            </a-table-column>
            <a-table-column title="预估单价" data-index="budgetPrice" align='center'>
              <template slot-scope="text, record" data-index="budgetAmount">
                <span  v-if="!record.edit">{{record.budgetPrice}}</span>
                <a-input-number v-else v-model="record.budgetPrice" style="width: 100%"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column title="预估金额" data-index="budgetAmount" align='center'>
              <template slot-scope="text, record" data-index="budgetAmount">
                <span  v-if="!record.edit">{{record.budgetAmount}}</span>
                <a-input-number v-else v-model="record.budgetAmount" style="width: 100%"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column title="操作" data-index="name" width="120px" fixed="right">
              <template slot-scope="text, record">
                <span>
                  <a @click="deletePlan(record.id)" :disabled="planEdit">删除</a>
                </span>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-layout-content>
      </a-layout>
    </a-layout>

    <div style="text-align: center;margin-top: 15px">
      <a-button  type="primary" @click="close">确定</a-button>
    </div>

    <MaterialPlanForm v-if="planVisible" ref="planForm" @ok="queryPlan"></MaterialPlanForm>
    <JobForm v-if="jobVisible" ref="jobForm" @ok="jobTree"></JobForm>
  </a-card>

</template>

<script>
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { notification } from 'ant-design-vue'
  import JDate from '@/components/jeecg/JDate'
  import { axios } from '@/utils/request'
  import MaterialPlanForm from './modules/PsMaterialPlanForm'
  import JobForm from './modules/PsJobForm'
  export default {
    name: 'PsJobPlanMain',
    mixins: [mixinDevice],
    components: {
      MaterialPlanForm, JobForm, JDate
    },
    data () {
      return {
        id: '',
        planEdit: true,
        edit: [true, true, true],
        planVisible: false,
        jobVisible: false,
        jobRow: '',
        headStyle: {height: '70px'},
        job: [],
        material: [],
        jobPage: false,
        materialPage: {
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
        globalEdit: false,
        planSelection: {type: 'checkbox'},
        cardHead:{
        },
      }
    },
    watch: {
    },
    computed: {
    },
    activated() {
    },
    created() {
    },
    methods: {
      searchQuery (){

      },
      init(val){
        this.id = val
        this.jobTree()
      },
      jobTree () {
        axios({
          url: '/ps/tpsProjectJob/jobTree',
          method: 'get',
          params: {'id': this.id }
        }).then((res) => {
          if (res.code === 200) {
            // console.log(res.result)
            this.job = res.result[0].children
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      customRow(record, index){
        return {
          on: {
            click: () => {
              this.jobRow = record
              if(record.order){
                this.edit = [true, true, true]
                this.planEdit = true
              }else {
                if(record.action){
                  this.edit = [true, false, false]
                }else {
                  this.edit = [false, true, true]
                }
                this.planEdit = false
              }
              this.queryPlan(record.id)
            }
          }
        }
      },
      setRowClassName (record) {
        return record.id === this.jobRow ? 'clickRowStyl' : ''
      },
      // 查询计划
      queryPlan(val) {
        axios({
          url: '/ps/psMaterialPlan/list',
          method: 'get',
          params: { 'projectJobId': val }
        }).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.material = []
            res.result.records.forEach((val) => {
              val.edit = false
              this.material.push(val)
            })
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      // 新增作业
      addJob () {
        this.jobVisible = true
        this.$nextTick(() => {
          this.$refs.jobForm.init(this.jobRow, true)
        })
      },
      // 编辑作业
      editJob(){
        this.jobVisible = true
        this.$nextTick(() => {
          this.$refs.jobForm.init(this.jobRow, false)
        })
      },
      // 删除作业
      delJob (){
        console.log(this.jobRow)
        var that = this
        axios({
          url: '/ps/tpsProjectJob/delete',
          method: 'DELETE',
          params: { id: that.jobRow.id }
        }).then((res) => {
          if (res.code === 200) {
            this.jobTree()
            this.globalEdit = false
            notification.info({ message: '操作成功', description: res.message, duration: 4 })
          } else {
            notification.error({ message: '系统提示', description:  res.message, duration: 4 });
          }
        })
      },
      // 下达计划
      orderPlan (val){
        var that = this
        axios({
          url: '/ps/tpsProjectJob/orderPlan',
          method: 'PUT',
          params: { id: val }
        }).then((res) => {
          if (res.code === 200) {
            this.jobTree()
            this.queryPlan(this.jobRow.id)
            this.globalEdit = false
            notification.info({ message: '操作成功', description: res.message, duration: 4 })
          } else {
            notification.error({ message: '系统提示', description:  res.message, duration: 4 });
          }
        })
      },
      // 编辑计划
      editPlan () {
        this.material.forEach((val)=>{
          val.edit = true
        })
        this.globalEdit = true
        this.planEdit = false
      },
      // 新增计划
      addPlan (){
        this.planVisible = true
        this.$nextTick(() => {
          this.$refs.planForm.init(this.jobRow.id)
        })
      },
      // 保存计划
      savePlan () {
        var that = this
        axios({
          url: '/ps/psMaterialPlan/update',
          method: 'PUT',
          data:  that.material
        }).then((res) => {
          if (res.code === 200) {
            this.queryPlan(this.jobRow.id)
            this.globalEdit = false
            notification.info({ message: '操作成功', description: res.message, duration: 4 })
          } else {
            notification.error({ message: '系统提示', description:  res.message, duration: 4 });
          }
        })
      },
      // 退出计划编辑
      exitEditPlan(){
        this.material.forEach((val)=>{
          val.edit = false
        })
        this.globalEdit = false
      },
      // 删除计划
      deletePlan (val) {
        axios({
          url: '/ps/psMaterialPlan/delete',
          method: 'DELETE',
          params: { 'id': val }
        }).then((res) => {
          if (res.code === 200) {
            this.queryPlan(this.jobRow.id)
            notification.info({ message: '操作成功', description: res.message, duration: 4 })
          } else {
            notification.error({ message: '系统提示', description:  res.message, duration: 4 });
          }
        })
      },
      // 关闭作业编辑
      close (){
        this.$emit('ok')
      }
    }
  }
</script>

<style lang="less" scoped>
  .buttons {
    text-align: center;
     button {
      margin: 0px 10px 15px 10px;
    };
  }
  .ant-table-tbody {
    .clickRowStyl:hover {
      td {
        background-color: #045872;
      }
    }
  }
</style>