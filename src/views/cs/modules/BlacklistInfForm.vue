<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="客商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-popup
                v-decorator="['csId', validatorRules.csId]"
                :trigger-change="true"
                org-fields="cs_name,cs_flag"
                dest-fields="csId,csFlag"
                code="blacklist"
                @callback="popupCallback"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="客商标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['csFlag', validatorRules.csFlag]" :trigger-change="true" dictCode="cs_flag" placeholder="请输入客商标识"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进入黑名单原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-textarea v-decorator="['blackReason',validatorRules.blackReason]" rows="4" placeholder="请输入进入黑名单原因"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="进入黑名单时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择进入黑名单时间" v-decorator="['blackDate',validatorRules.blackDate]" :trigger-change="true" style="width: 100%"/>
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

  export default {
    name: 'BlacklistInfForm',
    components: {
      JFormContainer,
      JDate,
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
          csId: {
            rules: [
              { required: true, message: '请输入客商名称!'},
            ]
          },
          csFlag: {
            rules: [
              { required: true, message: '请输入客商标识!'},
            ]
          },
          blackReason: {
            rules: [
              { required: true, message: '请输入进入黑名单原因!'},
            ]
          },
          blackDate: {
            rules: [
              { required: true, message: '请输入进入黑名单时间!'},
            ]
          },
        },
        url: {
          add: "/cs/blacklistInf/add",
          edit: "/cs/blacklistInf/edit",
          queryById: "/cs/blacklistInf/queryById"
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'csId','csFlag','blackReason','blackDate','status'))
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
        this.form.setFieldsValue(pick(row,'csId','csFlag','blackReason','blackDate','status'))
      },
    }
  }
</script>