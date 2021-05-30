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
            <a-form-item label="客商标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['csFlag', validatorRules.csFlag]" :trigger-change="true" dictCode="cs_flag" placeholder="请选择客商标识"/>
            </a-form-item>
          </a-col>-->
          <a-col :span="24">
            <a-form-item label="收货人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cneeName', validatorRules.cneeName]" placeholder="请输入收货人姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="收货地省市" :labelCol="labelCol" :wrapperCol="wrapperCol">
             <j-tree-select
               placeholder="请输入收货地省市"
               v-decorator="['deliveryArea']"
               dict="place,province_or_city,id"
               pid-field="pid"
               pid-value="0"
               has-child-field="has_child">
             </j-tree-select>
              <!--<a-input v-decorator="['deliveryArea']" placeholder="请输入收货地省市"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="收货详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['deliveryAddress']" placeholder="请输入收货详细地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contactNumber']" placeholder="请输入联系电话"></a-input>
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
  import JTreeSelect from "../../../components/jeecg/JTreeSelect";

  export default {
    name: "ProfileCneeModal",
    components: {
      JTreeSelect,
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
          cneeName: {
            rules: [
              { required: true, message: '请输入收货人姓名!'},
            ]
          },
        },
        url: {
          add: "/cs/profileInf/addProfileCnee",
          edit: "/cs/profileInf/editProfileCnee",
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
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','cneeName','deliveryArea','deliveryAddress','contactNumber','tenantId'))
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
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','sysOrgCode','delFlag','ver','csId','csFlag','cneeName','deliveryArea','deliveryAddress','contactNumber','tenantId'))
      },


    }
  }
</script>
