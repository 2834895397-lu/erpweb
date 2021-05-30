<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['code']" placeholder="请输入合同编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="合同名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name']" placeholder="请输入合同名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projId']" placeholder="请输入项目id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="是否年度合同" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['annualFlag']" placeholder="请输入是否年度合同"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择开始时间" v-decorator="['beginDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择结束时间" v-decorator="['finishDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="建筑金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['constructionAmount']" placeholder="请输入建筑金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="安装金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['installAmount']" placeholder="请输入安装金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设备金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['equipmentAmount']" placeholder="请输入设备金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="设计金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['designAmount']" placeholder="请输入设计金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="其他金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['otherAmount']" placeholder="请输入其他金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="甲方" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['firstParty']" placeholder="请输入甲方"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="乙方" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sencondParty']" placeholder="请输入乙方"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="是否总包合同" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['epcFlag']" placeholder="请输入是否总包合同"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择签订日期" v-decorator="['signDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="签订地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['signPlace']" placeholder="请输入签订地点"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="结算方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['balanceMode']" placeholder="请输入结算方式"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['status']" placeholder="请输入状态"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']" placeholder="请输入备注"></a-input>
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
    name: 'PsContractInfoForm',
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
        },
        url: {
          add: "/ps/psContractInfo/add",
          edit: "/ps/psContractInfo/edit",
          queryById: "/ps/psContractInfo/queryById"
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
          this.form.setFieldsValue(pick(this.model,'code','name','projId','annualFlag','beginDate','finishDate','constructionAmount','installAmount','equipmentAmount','designAmount','otherAmount','firstParty','sencondParty','epcFlag','signDate','signPlace','balanceMode','status','remark'))
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
        this.form.setFieldsValue(pick(row,'code','name','projId','annualFlag','beginDate','finishDate','constructionAmount','installAmount','equipmentAmount','designAmount','otherAmount','firstParty','sencondParty','epcFlag','signDate','signPlace','balanceMode','status','remark'))
      },
    }
  }
</script>