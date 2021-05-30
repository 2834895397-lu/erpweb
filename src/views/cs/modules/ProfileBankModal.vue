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
         <!-- <a-col :span="24">
            <a-form-item label="客商标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['csFlag', validatorRules.csFlag]" :trigger-change="true" dictCode="cs_flag" placeholder="请选择客商标识"/>
            </a-form-item>
          </a-col>-->
          <a-col :span="24">
            <a-form-item label="开户行" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['openingBank', validatorRules.openingBank]" placeholder="请输入开户行"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['bankAccount', validatorRules.bankAccount]" placeholder="请输入账号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="账号类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['registeredAddress']" :trigger-change="true" dictCode="registered_address" placeholder="请选择账号类型"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="有效期起始日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择有效期起始日期" v-decorator="['contactNumber']"  :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="有效期终止日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择有效期终止日期" v-decorator="['fax']" :trigger-change="true" style="width: 100%"/>
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
    name: "ProfileBankModal",
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
          openingBank: {
            rules: [
              { required: true, message: '请输入开户行!'},
            ]
          },
          bankAccount: {
            rules: [
              { required: true, message: '请输入账号!'},
            ]
          },
        },
        url: {
          add: "/cs/profileInf/addProfileBank",
          edit: "/cs/profileInf/editProfileBank",
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
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','openingBank','bankAccount','registeredAddress','contactNumber','fax','tenantId'))
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
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','openingBank','bankAccount','registeredAddress','contactNumber','fax','tenantId'))
      },


    }
  }
</script>
