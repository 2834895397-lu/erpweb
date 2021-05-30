<!--suppress ALL -->
<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="招标企业ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag @change='handleChange' v-decorator="['biddingEnterpriseId', validatorRules.biddingEnterpriseId]" :trigger-change="true" dictCode="tbm_bidding_enterprise,id,id" placeholder="请选择招标企业ID"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="招投明细ID" :labelCol="labelCol" :wrapperCol="wrapperCol">

             <j-search-select-tag id="Id" v-model="Id" :dictOptions="biddingInfIds"></j-search-select-tag>

            <!--<j-dict-select-tag type="list" v-decorator="['biddingDetailId', validatorRules.biddingDetailId]" :trigger-change="true" dictCode="tbm_bidding_dtl,id,id" placeholder="请选择招投明细ID"/>-->
            </a-form-item>
          </a-col>
          
          <a-col :span="24">
            <a-form-item label="报价" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['offerPrice', validatorRules.offerPrice]" placeholder="请输入报价" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="报价数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['offerNum', validatorRules.offerNum]" placeholder="请输入报价数量" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="报价日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择报价日期" v-decorator="['offerDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="中标标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['biddingFlag']" :trigger-change="true" dictCode="bm_bidding_flag" placeholder="请选择中标标识"/>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JSearchSelectTag from "../../../components/dict/JSearchSelectTag";

  export default {
    name: 'BiddingPriceForm',
    components: {
      JSearchSelectTag,
      JFormContainer,
      JDate,
      JDictSelectTag,
    },
    props: {
      //流程表单data
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
    data () {
      return {
        Id:'',
        //物料明细表ids
        biddingInfIds:[],
        form: this.$form.createForm(this),
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          biddingDetailId: {
            rules: [
              { required: true, message: '请输入招投明细ID!'},
            ]
          },
          biddingEnterpriseId: {
            rules: [
              { required: true, message: '请输入招标企业ID!'},
            ]
          },
          offerPrice: {
            rules: [
              { required: true, message: '请输入报价!'},
            ]
          },
          offerNum: {
            rules: [
              { required: true, message: '请输入报价数量!'},
            ]
          },
        },
        url: {
          // gklfk
          add: "/bm/biddingPrice/add",
          edit: "/bm/biddingPrice/edit",
          queryById: "/bm/biddingPrice/queryById",
         // <!--前端请求参数的路径-->
          selBindingDtlId: "/bm/biddingInf/queryBiddingInfId"

        }
      }
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
      },
      showFlowSubmitButton(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return true
          }
        }
        return false
      }
    },
    created () {
      //如果是流程中表单，则需要加载流程表单data
      this.showFlowData();
    },
    methods: {
      // <!--前端发送请求的方法-->
      handleChange(e) {
       console.log('value---->'+e);
        if(e === undefined){
          alert('please select companyId')
          return
          console(e)
        }

        getAction(this.url.selBindingDtlId, {id: e}).then(res=>{
          if(res.success){

            var ids = []
          let recs =  res.result.records;
          for (let i = 0; i < recs.length ; i++) {
            ids.push({value:recs[i].id,text:recs[i].id})
          }
          this.biddingInfIds = ids;
          if(recs.length == '0'){
            debugger
            this.Id = ''
          }
        }
        })
        },
      
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'biddingDetailId','biddingEnterpriseId','offerPrice','offerNum','offerDate','biddingFlag'))
        })
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          });
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'biddingDetailId','biddingEnterpriseId','offerPrice','offerNum','offerDate','biddingFlag'))
      },
    }
  }
</script>