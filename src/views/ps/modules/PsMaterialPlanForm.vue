<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="submitForm"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail" ref="realForm">
        <a-row>
          <a-col :span="24">
            <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['purchaseOrgId']" placeholder="请输入采购组织"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物料ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialId']" placeholder="请输入物料ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物料名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialName']" placeholder="请输入物料名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物料编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialCode']" placeholder="请输入物料编码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="需求数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['planNum']" placeholder="请输入需求数量" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="允许偏差数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['offsetPlanNum']" placeholder="请输入允许偏差数" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="计划交货日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择计划交货日期" v-decorator="['tackDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预估单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['budgetPrice']" placeholder="请输入预估单价" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="预估金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['budgetAmount']" placeholder="请输入预估金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </j-modal>

</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDate from '@/components/jeecg/JDate'
  import { notification } from 'ant-design-vue'
  export default {
    name: 'PsMaterialPlanForm',
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
        title: '物料采购计划',
        width: 800,
        visible: false,
        disableSubmit: false,
        form: this.$form.createForm(this),
        model: {
          projectJobId: ''
        },
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
        },
        url: {
          add: "/ps/psMaterialPlan/add",
          edit: "/ps/psMaterialPlan/edit",
          queryById: "/ps/psMaterialPlan/queryById"
        },
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
      init (val) {
        console.log(val)
        if (val){
          this.visible = true
          this.model.projectJobId = val
        }else {
          notification.warning({ message: '请选择作业类型', duration: 4 })
          return
        }
        this.form.resetFields()
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'purchaseOrgId','materialId','materialName','materialCode','planNum','offsetPlanNum','tackDate','budgetPrice','budgetAmount'))
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
      handleCancel () {
        this.visible = false
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
            // console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok', that.model.projectJobId);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.visible = false;
            })
          }

        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'purchaseOrgId','materialId','materialName','materialCode','planNum','offsetPlanNum','tackDate','budgetPrice','budgetAmount'))
      },
    }
  }
</script>

<style scoped>

</style>