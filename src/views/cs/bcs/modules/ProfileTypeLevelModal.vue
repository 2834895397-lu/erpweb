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
          <!--<a-col :span="24">
            <a-form-item label="客商标识" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <j-dict-select-tag type="list" v-decorator="['csFlag', validatorRules.csFlag]" :trigger-change="true" dictCode="cs_flag" placeholder="请选择客商标识"/>
            </a-form-item>
          </a-col>-->
          <a-col :span="24">
            <a-form-item label="客商类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag disabled="false" type="list" v-decorator="['csType', validatorRules.csType]" :trigger-change="true" dictCode="cs_type" placeholder="请选择客商类型"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="客商等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" :disabled="this.showCsLevel" v-decorator="['csLevel', validatorRules.csLevel]" :trigger-change="true" dictCode="cs_level" placeholder="请选择客商等级"/>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'

  export default {
    name: "ProfileTypeLevelModal",
    components: {
      JDictSelectTag,
      JSearchSelectTag,
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
        showCsLevel:true,
        model: {},
        csName:[],
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
          csType: {
            rules: [
              { required: true, message: '请输入客商类型!'},
            ]
          },
          csLevel: {
            rules: [
              { required: true, message: '请输入客商等级!'},
            ]
          },
        },
        url: {
          add: "/bcs/profileInf/addProfileTypeLevel",
          edit: "/bcs/profileInf/editProfileTypeLevel",
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
        if (record.csType==="2"){
          this.showCsLevel=false;
        }else{
          this.showCsLevel=true;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','tenantId','csId','csFlag','csType','csLevel'))
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
          this.$emit('update_data');
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','tenantId','csId','csFlag','csType','csLevel'))
      },
    }
  }
</script>
