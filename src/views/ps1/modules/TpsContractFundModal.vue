<template>
  <j-modal
    :title="title"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="合同ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input disabled="false" v-decorator="['contractId',{'initialValue':this.mainId }, {rules: [ { required: true, message: '合同号不能为空' }]} ]"  placeholder="请输入合同ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="收付款日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择收付款日期" v-decorator="['fundDate', {'initialValue':new Date()} , {rules: [ { required: true, message: '请选择收付款日期' }]}]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
            <a-col :xs="24"
                   :sm="12">
              <a-form-item label="交易类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-dict-select-tag type="list" v-decorator="['fundBusiType', {rules: [ { required: true, message: '请选择交易类型' }]}]" :trigger-change="true" dictCode="fund_busi_type" placeholder="请输入交易类型"/>
              </a-form-item>
            </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="资金类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['fundType', {rules: [ { required: true, message: '请选择资金类型' }]}]" :trigger-change="true" dictCode="fund_type" placeholder="请输入资金类型"/>
            </a-form-item>
          </a-col>
            <a-col :xs="24"
                   :sm="12">
              <a-form-item label="交易银行" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-dict-select-tag type="list" v-decorator="['cashBank']" :trigger-change="true" dictCode="bank_inf" placeholder="请输入交易银行"/>
              </a-form-item>
            </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['fundAmount', {rules: [ { required: true, message: '请输入金额' }]}]" placeholder="请输入金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="汇票日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择汇票日期" v-decorator="['draftDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="出票银行" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['draftBank']" :trigger-change="true" dictCode="bank_inf" placeholder="请输入出票银行"/>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['status',{'initialValue':'0'}]" :trigger-change="true" dictCode="ps_contract_fund_status" placeholder="请输入状态"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']" placeholder="请输入备注"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "TpsContractFundModal",
    components: {
      JDate,
    },
    props:{
      mainId:{
        type:String,
        required:false,
        default:''
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
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
          add: "/ps1/tpsContract/addTpsContractFund",
          edit: "/ps1/tpsContract/editTpsContractFund",
        }

      }
    },
    created () {
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
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','tenantId','contractId','fundDate','fundBusiType','fundType','fundAmount','draftDate','draftBank','cashBank','status','remark'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
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
            formData['contractId'] = this.mainId
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
              that.close();
            })
          }

        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','tenantId','contractId','fundDate','fundType','fundAmount','draftDate','draftBank','cashBank','remark'))
      },


    }
  }
</script>
