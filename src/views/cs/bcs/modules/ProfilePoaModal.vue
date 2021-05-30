<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="委托人身份证号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['clientIdNum', validatorRules.clientIdNum]" placeholder="请输入委托人身份证号码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="委托人职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['clientDuty', validatorRules.clientDuty]" placeholder="请输入委托人职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="委托人联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['clientContact', validatorRules.clientContact]" placeholder="请输入委托人联系电话"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="受托人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['trusteeName', validatorRules.trusteeName]" placeholder="请输入受托人姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="受托人性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['trusteeSex', validatorRules.trusteeSex]" :trigger-change="true" dictCode="sex" placeholder="请选择受托人性别"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="受托人职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['trusteeDuty', validatorRules.trusteeDuty]" placeholder="请输入受托人职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="受托人联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['trusteePhone', validatorRules.trusteePhone]" placeholder="请输入受托人联系电话"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="受托人身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['trusteeIdNum', validatorRules.trusteeIdNum]" placeholder="请输入受托人身份证号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="委托起始日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择委托起始日期" v-decorator="['beginDate', validatorRules.beginDate]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="委托终止日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择委托终止日期" v-decorator="['endDate', validatorRules.endDate]" :trigger-change="true" style="width: 100%"/>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: "ProfilePoaModal",
    components: {
      JDate,
      JDictSelectTag,
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
          csFlag: {
            rules: [
              { required: true, message: '请输入客商标识!'},
            ]
          },
          clientIdNum: {
            rules: [
              { required: true, message: '请输入委托人身份证号码!'},
              { required: false, message: '请输入正确的身份证号码!',pattern:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/},
            ]
          },
          clientDuty: {
            rules: [
              { required: true, message: '请输入委托人职务!'},
            ]
          },
          clientContact: {
            rules: [
              { required: true, message: '请输入委托人联系电话!'},
            ]
          },
          trusteeName: {
            rules: [
              { required: true, message: '请输入受托人姓名!'},
            ]
          },
          trusteeSex: {
            rules: [
              { required: true, message: '请输入受托人性别!'},
            ]
          },
          trusteeDuty: {
            rules: [
              { required: true, message: '请输入受托人职务!'},
            ]
          },
          trusteePhone: {
            rules: [
              { required: true, message: '请输入受托人联系电话!'},
            ]
          },
          trusteeIdNum: {
            rules: [
              { required: true, message: '请输入受托人身份证号!'},
              { required: false, message: '请输入正确的身份证号码!',pattern:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/},
            ]
          },
          beginDate: {
            rules: [
              { required: true, message: '请输入委托起始日期!'},
            ]
          },
          endDate: {
            rules: [
              { required: true, message: '请输入委托终止日期!'},
            ]
          },
        },
        url: {
          add: "/bcs/profileInf/addProfilePoa",
          edit: "/bcs/profileInf/editProfilePoa",
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
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','clientIdNum','clientDuty','clientContact','trusteeName','trusteeSex','trusteeDuty','trusteePhone','trusteeIdNum','beginDate','endDate','tenantId'))
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
            formData['csId'] = this.mainId
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
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','clientIdNum','clientDuty','clientContact','trusteeName','trusteeSex','trusteeDuty','trusteePhone','trusteeIdNum','beginDate','endDate','tenantId'))
      },


    }
  }
</script>
