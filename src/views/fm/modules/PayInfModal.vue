<!--suppress ALL -->
<template>
  <!--  :okButtonProps  表单未通过验证确定按钮置灰-->
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="disableSubmit">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">


        <ADivider orientation="left" plain>
          基本信息：
        </ADivider>
        <a-row>
          <a-col :xs="12" :sm="6" >
            <a-form-item label="付款单编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['code']" placeholder="请输入付款单编号" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="申请付款日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-date-picker placeholder="选择申请付款日期" v-decorator="['applyDate']" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" :showToday="false"/>-->
              <a-date-picker placeholder="请选择申请付款日期" v-decorator="['applyDate',{initialValue:moment(getCurrentData())}]":trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="应付日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker placeholder="请选择应付日期" v-decorator="['payDate',{initialValue:moment(getCurrentData())}]":trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="付款总金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number  v-decorator="['totalSum',{initialValue:'0'}]" placeholder="请输入付款总金额" style="width: 100%":disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="付款类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['payMode',{initialValue:2}]" :trigger-change="true" dictCode="fm_pay_mode" placeholder="请选择付款类型"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="是否预算外" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['budgetFlag',{initialValue:0}]" :trigger-change="true" dictCode="fm_budget_flag" placeholder="请选择是否预算外"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="款项性质" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-input v-decorator="['payNature']" placeholder="请输入款项性质"></a-input>-->
              <j-tree-select
                placeholder="请选择子节点"
                v-decorator="['payNature']"
                dict="fm_pay_nature,name,id"
                pid-field="pid"
                pid-value="0"
                @change=handleChange
                has-child-field="has_child">
              </j-tree-select>
            </a-form-item>
          </a-col>

          <a-col :xs="12" :sm="6">
            <a-form-item label="紧急程度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['urgency',{initialValue:2}]" :trigger-change="true" dictCode="fm_urgency" placeholder="请选择紧急程度"/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="付款原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input  v-decorator="['reason']" placeholder="请输入付款原因" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" v-show="false">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['appStatus',{initialValue:0}]" disabled="disabled" :trigger-change="true" dictCode="fm_pay_status" placeholder="请选择状态"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-form :form="form" slot="detail">
        <ADivider orientation="left" plain>
          合同及发票：
        </ADivider>
        <a-row>
          <a-col :xs="12" :sm="6" v-show="false">
            <a-form-item label="采购合同ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractId']" placeholder="请输入采购合同ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="采购合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-popup
                v-decorator="['contractCode']"

                :trigger-change="true"
                org-fields="tbd_company_id,id,tcs_profile_inf_id,contract_no,contract_name,tcs_profile_inf_name,cs_name"
                dest-fields="csIdPay,contractId,csIdRecept,contractCode,contractName,csNameRecept,csNamePay"
                code="tmm_contract"
                @callback="popupCallback"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="13">
            <a-form-item label="采购合同名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractName']" placeholder="请输入采购合同名称" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-form :form="form" slot="detail">
        <ADivider orientation="left" plain>
          往来信息：
        </ADivider>
        <a-row>
          <a-col :xs="12" :sm="6" v-show="false">
            <a-form-item label="支付公司ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input ref="csIdPay"  v-decorator="['csIdPay']"  placeholder="请输入支付公司ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="支付公司名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input  v-decorator="['csNamePay']" placeholder="请输入支付公司名称" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
        <!--  <a-col :xs="12" :sm="6">
            <a-form-item label="付款公司编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['csCodePay']" placeholder="请输入付款公司编码" ></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :xs="12" :sm="13">
            <!-- @mouseenter="getPayAccount" -->
            <a-form-item label="支付账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag id='payAccount' v-decorator="['payAccount',{initialValue:payAccount}]" :dictOptions="payInfPayAccounts" placeholder="请选择支付账号"></j-search-select-tag>
<!--                  <a-select id='payAccount' placeholder="请选择支付账号1" v-decorator="['payAccount']" >-->
<!--                    <a-select-option v-for="d in payAccountOptions" :key="d.bankAccount" :value="d.bankAccount">{{ d.bankAccount }}</a-select-option>-->
<!--                  </a-select>-->
            </a-form-item>
          </a-col>`
          <a-col :xs="12" :sm="6" v-show="false">
            <a-form-item label="供应商ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['csIdRecept']"  placeholder="请输入供应商ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['csNameRecept']" placeholder="请输入供应商名称" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="6">
            <a-form-item label="收款开户行" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag  id="ReceptBank" v-decorator="['receptBank',{initialValue:ReceptBank}]"  :dictOptions= "payInfReceptBanks"  placeholder="请选择收款开户行" @change='getBankAccounts'/>
            </a-form-item>
          </a-col>
          <a-col :xs="12" :sm="8">
            <a-form-item label="收款账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag  id="ReceptAccount" v-decorator="['receptAccount',{initialValue:ReceptAccount}]" :dictOptions="payInfReceptAccounts"  placeholder="请选择收款账号"/>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
      </j-form-container>
      
      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="财务付款明细信息" :key="refKeys[0]" :forceRender="true">
          <j-form-container :disabled="disableSubmit">
            <a-form :form="form" slot="detail">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="payDtlTable.loading"
            :columns="payDtlTable.columns"
            :dataSource="payDtlTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
            </a-form>
          </j-form-container>
        </a-tab-pane>
        
      </a-tabs>

    </a-spin>


  </j-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import {FormTypes, getRefPromise, VALIDATE_NO_PASSED, validateFormAndTables} from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import ARow from "ant-design-vue/es/grid/Row";
  import JTreeSelect from "@/components/jeecg/JTreeSelect";
  import {getAction, httpAction} from "@/api/manage";
  import { DatePicker } from 'ant-design-vue';
  import moment from "moment"; 
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'
  import axios from 'axios'


  export default {
    name: 'PayInfModal',
    mixins: [JEditableTableMixin],
    watch: {
    //   csIdPay: {
    //     immediate: true,
    //     handler(val) {
    //       debugger
    //       if (!this.csIdPay) {
    //         console.log('11111')
    //         this.clearList()
    //       } else {
    //         this.loadData(1)
    //         console.log(this.pRecord)
    //       }
    //     }
    //   }
    'ReceptBank':{
      immediate: true,
       handler(val) {
         if(val !== ''){
            this.getBankAccounts(val)
         }else{
          this.ReceptAccount = ''
          this.payInfReceptAccounts = []
         }
    }
   }
    },
    props: {
      formData: {
        type: Object,
        default: ()=>{},
      required: false
    },
    //表单模式：true流程表单 false普通表单
    formBpm: {
      type: Boolean,
      default: false,
      required: false
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
   
  },
   components: {
      JTreeSelect,
      ARow,
      JDate,
      JDictSelectTag,
      JSearchSelectTag
    },
  computed: {
    formDisabled(){
      if(this.formBpm===true){
        if(this.formData.disabled===false){
          return false
        }
        return true
      }
      return this.disabled
    }
  },

  data(){
    return {
    /*  a: new Date(),*/
      payAccount:'',
      ReceptBank:'',
      ReceptAccount:'',
      dateFormat: 'YYYY-MM-DD',
      // disableSubmit: false,
      payInfPayAccounts: [],
     // payInfPayName:"",
     // PayInfReceptName: '',
      payInfReceptBanks:[],
      payInfReceptAccounts:[],
      csIdPay: '',
      csIdRecept: '',
      payAccountOptions:[],
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      labelCol2: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol2: {
        xs: {span: 24},
        sm: {span: 20},
      },
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {},
      refKeys: ['payDtl',],
      tableKeys: ['payDtl',],
      activeKey: 'payDtl',
      // 财务付款明细信息
      payDtlTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '付款方式',
            key: 'payKind',
            type: FormTypes.select,
            dictCode: "fm_pay_kind",
            width: "200px",
            placeholder: '请输入${title}',
             defaultValue: '1',
            validateRules:[{required:true,message:"请输入付款方式"}]
          },
          {
            title: '币别',
            key: 'payBb',
            type: FormTypes.select,
            dictCode: "fm_pay_bb",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: 'RMB',
            // 校验不同币种不能在同一付款单出现
            validateRules: [//此处进行验证
              {
                required: false,//在前端设置此字段必填
                // message: '${title}不能为空',//在前端设置此字段不能为null，提示文本
                // 自定义函数校验 handler,表单验证
                handler(type, value, row, column, callback, target) {
                  let { values } = target.getValuesSync({ validate: false })
                  let count = 0
                  for (let val of values) {
                    if (val['payBb'] === value && val['payBb'] != undefined ) {
                      if(values.length==1){
                        callback(true)
                      }else if(++count >=2) {
                        callback(true)
                        // true = 通过验证
                      }
                    }
                    console.log(val['payBb'],'val[\'payBb\']')
                  }
                  callback(false, '${title}需要一致')
                  return

                }
              }
            ],
          },
          {
            title: '付款金额',
            key: 'money',
            type:FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '0',
          },
        ]
      },
      url: {
        add: "/fm/payInf/add",
        edit: "/fm/payInf/edit",
        payDtl: {
          list: '/fm/payInf/queryPayDtlByMainId'
        },
        // //前端发送请求到后台的路径
        getPayAccount: '/fm/payInf/getPayAccount',
        //getPayName:"/fm/payInf/getPayName",
       // getReceptName:"/fm/payInf/getReceptName",
        getReceptBank: "/fm/payInf/getReceptBank",
        getReceptAccount: "/fm/payInf/getReceptAccount"
      }
    }
  },

  methods: {
     moment,
      getCurrentData(){
      return new Date();
    },

    handleChange(e){
     
    },
    /** 确定按钮点击事件 */
    handleOk() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormAndTables(this.form, tables)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        // 发起请求

        let url = this.url.add, method = 'post'
        if (this.model.id) {
          url = this.url.edit
          method = 'put'
        }
        this.confirmLoading = true
        httpAction(url, formData, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
          //调用新增时候清空数据方法
          if (url===this.url.add){
            this.clearForm()
          }

        }).finally(() => {
          this.confirmLoading = false
        })
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
    },
    //清空数据
     clearForm(){
      this.payAccount=''
      this.payInfPayAccounts=[]
      this.ReceptBank=''
      this.payInfReceptBanks=[]
      this.ReceptAccount=''
      this.payInfReceptAccounts=[]
    },

      // 根据支付公司ID获得支付账号、支付公司名称
      getPayCompanyMessage (csIdPay) {
        
        this.payAccount = "";
        this.payInfPayAccounts = [];
        
        let that = this
        
        console.log(csIdPay);
        let accounts = [];
        //var PayAccounts = []
        //获得支付账号
         getAction(this.url.getPayAccount, {id: csIdPay}).then(res=>{
            if(res.success)
            {
              this.payAccountOptions = res.result.records;
              // if(res.result.records.length > 0){
              //   this.payAccount = res.result.records[0].bankAccount;
              // }
              let recs = res.result.records;
              for (let i = 0; i < recs.length; i++) {
                accounts.push({value:recs[i].bankAccount, text:recs[i].bankAccount})
              }
            //alert(BankAccounts)
            }
          that.payInfPayAccounts = accounts;
          if(accounts.length > 0){
            that.payAccount = accounts[0].value
          }
        })
        //获得支付公司名称
       /* getAction(this.url.getPayName,{id:csIdPay}).then(res=>{
          if(res.success)
          {
            // var PayName=[]
            // let recs=res.result.records;
            // PayName.push(recs[0].CsName)
            var PayName=""
            PayName=res.result
          }
          this.payInfPayName=PayName;
        })*/
      },

      //根据供应商id获得供应商名称、收款开户行
     getReceptMessage(csIdRecept) {
        //alert("jacklu")
        //console.log('value---->' , e);
        // if (e === undefined) {
        //   alert('please select csNamePay')
        //   return
       this.ReceptBank = ''
       var ReceptBanks = []
         console.log(csIdRecept,'csIdRecept...');
        
        //获得供应商名称
       /* getAction(this.url.getReceptName,{id:csIdRecept}).then(res=>{
          if(res.success)
        {
        //   var ReceptName=[];
        //   let recs=res.result.records;
        //  ReceptName.push(recs[0].CsName)
        var ReceptName=""
        ReceptName=res.result
        }
          this.PayInfReceptName=ReceptName;
          console.log(ReceptName,'ReceptName')
        })*/

        //获得收款开户行
        getAction(this.url.getReceptBank,{id:csIdRecept}).then(res=>{
          if(res.success)
          {

            let recs = res.result.records;
            for (let i = 0; i < recs.length; i++) {
              ReceptBanks.push({value:recs[i].openingBank,text:recs[i].openingBank})
            }
            //alert(BankAccounts)
          }
          this.payInfReceptBanks = ReceptBanks;
          if(ReceptBanks.length > 0){
                this.ReceptBank = ReceptBanks[0].value
          }
          })
        },

      //根据收款开户行获得收款账号
      getBankAccounts(receptBank) {
       // console.log('csIdRecept',this.csIdRecept);
        console.log('value---->', receptBank);
        var ReceptAccounts = []
        if (receptBank === 'undefined') {
          alert('hello jacklu')
          //-alert('please select csIdPay')
          return
        }else{
        // 获得收款账号
        getAction(this.url.getReceptAccount, {id: receptBank}).then(res=>{
          this.ReceptAccount = ''
          // console.log("aaaaaaaaaaaa"+receptBank)
          //alert(receptBank)
          if(res.success)
        {


          let recs = res.result.records;
          console.log("recs",recs)
          for (let i = 0; i < recs.length; i++) {
            ReceptAccounts.push({value:recs[i].bankAccount,text:recs[i].bankAccount})
          }
         // alert(BankAccounts)
        }
        this.payInfReceptAccounts = ReceptAccounts;
        if(ReceptAccounts.length > 0){
          this.ReceptAccount = ReceptAccounts[0].value
        }

      })
      }
      },


      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'code','applyDate','payDate','totalSum','payMode','budgetFlag','payNature','urgency','reason','contractId','contractCode','contractName','csIdPay','payAccount','csIdRecept','csNameRecept','receptBank','receptAccount','appStatus','csNamePay','csCodePay','')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.payDtl.list, params, this.payDtlTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          payDtlList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
        this.form.setFieldsValue(pick(row,'code','applyDate','payDate','totalSum','payMode','budgetFlag','payNature','urgency','reason','contractId','contractCode','contractName','csIdPay','payAccount','csIdRecept','csNameRecept','receptBank','receptAccount','appStatus','csNamePay'))
        // console.log("rows: ",row.csIdPay);
             
        this.getPayCompanyMessage(row.csIdPay);
        // this.handleChangeTwo(row.csIdRecept);
        this.getReceptMessage(row.csIdRecept);
     },

    }
  }
</script>

<style scoped>
</style>