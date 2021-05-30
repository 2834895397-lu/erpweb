<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="归属项目id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projId']" placeholder="请输入归属项目id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractId']" placeholder="请输入合同id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['year']" placeholder="请输入年度" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="月份" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['month']" placeholder="请输入月份" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本月投资完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['monthAllInvest']" placeholder="请输入本月投资完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本月建筑完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['monthConstructionInvest']" placeholder="请输入本月建筑完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本月安装完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['monthInstallationInvest']" placeholder="请输入本月安装完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本月设备完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['monthEquipmentInvest']" placeholder="请输入本月设备完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本月其他完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['monthOtherInvest']" placeholder="请输入本月其他完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本年投资完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['yearAllInvest']" placeholder="请输入本年投资完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本年建筑完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['yearConstructionInvest']" placeholder="请输入本年建筑完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本年安装完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['yearInstallationInvest']" placeholder="请输入本年安装完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本年设备完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['yearEquipmentInvest']" placeholder="请输入本年设备完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="本年其他完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['yearOtherInvest']" placeholder="请输入本年其他完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计投资完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalAllInvest']" placeholder="请输入累计投资完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计建筑完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalConstructionInvest']" placeholder="请输入累计建筑完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计安装完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalInstallationInvest']" placeholder="请输入累计安装完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计设备完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalEquipmentInvest']" placeholder="请输入累计设备完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="累计其他完成金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['totalOtherInvest']" placeholder="请输入累计其他完成金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['reamark']" placeholder="请输入备注"></a-input>
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

  export default {
    name: 'PsInvestForm',
    components: {
      JFormContainer,
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
        },
        url: {
          add: "/ps/psInvest/add",
          edit: "/ps/psInvest/edit",
          queryById: "/ps/psInvest/queryById"
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
          this.form.setFieldsValue(pick(this.model,'projId','contractId','year','month','monthAllInvest','monthConstructionInvest','monthInstallationInvest','monthEquipmentInvest','monthOtherInvest','yearAllInvest','yearConstructionInvest','yearInstallationInvest','yearEquipmentInvest','yearOtherInvest','totalAllInvest','totalConstructionInvest','totalInstallationInvest','totalEquipmentInvest','totalOtherInvest','reamark'))
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
        this.form.setFieldsValue(pick(row,'projId','contractId','year','month','monthAllInvest','monthConstructionInvest','monthInstallationInvest','monthEquipmentInvest','monthOtherInvest','yearAllInvest','yearConstructionInvest','yearInstallationInvest','yearEquipmentInvest','yearOtherInvest','totalAllInvest','totalConstructionInvest','totalInstallationInvest','totalEquipmentInvest','totalOtherInvest','reamark'))
      },
    }
  }
</script>