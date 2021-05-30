<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['csId', validatorRules.csId]" :trigger-change="true" dictCode="tcs_profile_inf where del_flag=0,cs_name,id" placeholder="请选择客户名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['visMan', validatorRules.visMan]" placeholder="请输入拜访人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择拜访时间" v-decorator="['visDate', validatorRules.visDate]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访省市" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select
                placeholder="拜访省市"
                v-decorator="['visPlace', validatorRules.visPlace]"
                dict="place,province_or_city,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child">
              </j-tree-select>
              <!--<a-input v-decorator="['visPlace']" placeholder="请输入拜访省市"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['visAddress']" placeholder="请输入拜访详细地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访记录" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-textarea v-decorator="['visRecord', validatorRules.visRecord]" rows="4" placeholder="请输入拜访记录"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上传附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['upload']" :trigger-change="true"></j-upload>
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
  import JUpload from '@/components/jeecg/JUpload'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from "../../../components/jeecg/JTreeSelect";

  export default {
    name: 'VisitInfForm',
    components: {
      JTreeSelect,
      JFormContainer,
      JDate,
      JUpload,
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
          visMan: {
            rules: [
              { required: true, message: '请输入拜访人!'},
            ]
          },
          visDate: {
            rules: [
              { required: true, message: '请输入拜访时间!'},
            ]
          },
          visRecord: {
            rules: [
              { required: true, message: '请输入拜访记录!'},
            ]
          },
          visPlace: {
            rules: [
              { required: true, message: '请输入拜访省市!'},
            ]
          },
        },
        url: {
          add: "/cs/visitInf/add",
          edit: "/cs/visitInf/edit",
          queryById: "/cs/visitInf/queryById"
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
          this.form.setFieldsValue(pick(this.model,'csId','visMan','visDate','visPlace','visAddress','visRecord','upload'))
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
        this.form.setFieldsValue(pick(row,'csId','visMan','visDate','visPlace','visAddress','visRecord','upload'))
      },
    }
  }
</script>