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
            <a-form-item label="供应商代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['csCode']" placeholder="请输入供应商代码" :disabled="true"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['csName', validatorRules.csName]" placeholder="请输入供应商名称" ></a-input>
              <a-button @click="queryExisting" v-has="'bcs:profile:add'">查询是否已有</a-button>
            </a-form-item>
          </a-col>
          <j-modal
            :title="text"
            :width="600"
            :visible="showModal"
            :confirmLoading="confirmLoading"
            switchFullscreen
            @ok="handleIt"
            @cancel="closeIt"
            cancelText="否"
            okText="是">
            <table border="1">
              <tr>
                <th class="message">名称</th>
                <th class="message">法人代表</th>
                <th class="message">税号</th>
                <th id="province">注册省市</th>
              </tr>
              <tr>
                <td>{{this.name}}</td>
                <td>{{this.legal}}</td>
                <td>{{this.dutySign}}</td>
                <td>{{this.provincesAndCities}}</td>
              </tr>
            </table>
            <div id="text">该用户已存在，是否应用该数据</div>
          </j-modal>
          <a-col :span="24">
            <a-form-item label="法人代表" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['legal', validatorRules.legal]" placeholder="请输入法人代表"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="税号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dutySign', validatorRules.dutySign]" placeholder="请输入税号" :disabled="showDutySign"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="注册地省市" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select
                placeholder="请输入注册地省市"
                v-decorator="['regisPlace']"
                dict="place,province_or_city,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child">
              </j-tree-select>
              <!--<a-input v-decorator="['regisPlace']" placeholder="请输入注册地省市"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详细注册地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['regisAddress']" placeholder="请输入详细注册地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contaNumber']" placeholder="请输入联系电话"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="传真" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['fax']" placeholder="请输入传真"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="电子邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['email']" placeholder="请输入电子邮箱"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="办公地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['officeAddress']" placeholder="请输入办公地址"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :span="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isUse']" :trigger-change="true" dictCode="is_use" placeholder="请选择是否启用"/>
            </a-form-item>
          </a-col>-->
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from "@/components/jeecg/JTreeSelect";


  export default {
    name: "ProfileInfModal",
    inject:{
      data_update:{
        type:Function
      }
    },
    components: {
      JTreeSelect,
      JDictSelectTag,
    },
    data () {
      return {

        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        showDutySign:false,
        visible: false,
        model: {},
        id:"",
        text:"",
        showModal: false,
        name:"",
        legal:"",
        dutySign:"",
        provincesAndCities:"",
        cs_flag:"0",

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
          csName: {
            rules: [
              { required: true, message: '请输入供应商名称!'},
              { validator: (rule, value, callback) => validateDuplicateValue('tcs_profile_inf ', 'del_flag=0 and cs_name ', value, this.model.id, callback)},            ]
          },
          legal: {
            rules: [
              { required: true, message: '请输入法人代表!'},
            ]
          },
          dutySign: {
            rules: [
              { required: true, message: '请输入税号!'},
              { validator: (rule, value, callback) => validateDuplicateValue('tcs_profile_inf', 'duty_sign', value, this.model.id, callback)},
            ]
          },
        },
        url: {
          add: "/bcs/profileInf/add",
          edit: "/bcs/profileInf/edit",
          getCsName: "/bcs/profileInf/getCsName",
          setCsLevel:"/cs/profileInf/setCsLevel",
        }

      }
    },
    created () {
    },
    methods: {
      queryExisting(){
        if (this.form.getFieldValue('csName')===undefined){
          this.$message.warning("请输入公司名称")
        }else{
          getAction(this.url.getCsName, {id: this.form.getFieldValue('csName'),num:this.cs_flag}).then((res) => {
            if (res.success){
              this.showModal = true;
              this.name=res.result.csName;
              this.legal=res.result.legal;
              this.dutySign=res.result.dutySign;
              this.provincesAndCities=res.result.regisPlace;
              this.$message.success(res.message);
            }else if (res.message==='已存在该公司信息'){
              this.$message.warning(res.message);
            }else if(res.message==='没有相同数据'){
              this.$message.warning(res.message)
            }else{
              this.$message.warning('没有权限，请联系管理员授权');
            }
          });
        }
      },
      update(){
        this.loadData();
      },
      add () {
        this.edit({});
        this.showDutySign=false;
      },
      edit (record) {
        if(record!==null){
          this.showDutySign=true;
        }
        if (record.csType==='1'){
          this.showDutySign=false;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.id=this.model.id;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'csCode','csName','legal','dutySign','regisPlace','regisAddress','contaNumber','fax','email','officeAddress','isUse','isCheck','checker','checkDate'))
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
        this.form.setFieldsValue(pick(row,'csCode','csName','legal','dutySign','regisPlace','regisAddress','contaNumber','fax','email','officeAddress','isUse','isCheck','checker','checkDate'))
      },
      closeIt(){
        this.showModal=false;
      },
      handleIt(){
        getAction(this.url.setCsLevel, {id: this.form.getFieldValue('csName'),num:this.cs_flag}).then((res) => {
            this.showModal=false;
            this.close();
            this.$message.success(res.result);
            this.data_update();
        })
      },


    }
  }
</script>

<style>
  .message{
    width: 90px;
  }
  #province{
    width: 150px;
  }
  #text{
    margin-left:30%;
    margin-top: 50px;
  }
</style>