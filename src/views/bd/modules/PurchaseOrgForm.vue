<template>
<div>

  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <!--            <a-form-item label="单位(部门)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
            <!--              <j-dict-select-tag type="list" v-decorator="['departId']" :trigger-change="true" dictCode="sys_depart,depart_name,id" placeholder="请选择单位(部门)"/>-->
            <!--            </a-form-item>-->
            <!--部门分配-->
            <a-form-item label="单位(部门)" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled" >
              <a-input-search
                placeholder="点击单位(部门)"
                v-model=checkedDepartNameString
                readOnly
                @search="onSearch">
                <a-button slot="enterButton" icon="search">选择</a-button>
              </a-input-search>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="采购组织编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['orgCode']" placeholder="请输入采购组织编码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="采购组织简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['orgName']" placeholder="请输入采购组织简称"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
  <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>
</div>


</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import departWindow from "@views/system/modules/DepartWindow";

  export default {
    name: 'PurchaseOrgForm',
    components: {
      JFormContainer,
      departWindow,
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
        dpKey: '',
        departDisabled: false, //是否是我的部门调用该页面
        checkedDepartNameString:"", // 保存部门的名称 =>title
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartNames:[], // 保存部门的名称 =>title
        resultDepartOptions:[],
        userId:"", //保存用户id
        checkedDepartKeys:[],
        userDepartModel:{userId:'',departIdList:[]}, // 保存SysUserDepart的用户部门中间表数据需要的对象
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
          add: "/bd/purchaseOrg/add",
          edit: "/bd/purchaseOrg/edit",
          queryById: "/bd/purchaseOrg/queryById"
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
      edit: function (record) {//record传过来翻译的值
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          let dep = pick(this.model, 'departId', 'departId_dictText')
          this.dpKey = dep.departId//赋值ID
          this.checkedDepartNameString = dep.departId_dictText //赋值上翻译过的值
          this.form.setFieldsValue(pick(this.model, 'departId', 'orgCode', 'orgName'))
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
              httpurl=this.url.add;
              method = 'post';
            }else{
              httpurl=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            formData['departId'] = this.dpKey
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);

              }
              if(httpurl===this.url.add){ //  新增完清空
                this.checkedDepartNameString=''
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'departId','orgCode','orgName'))
        debugger
      },
      // 搜索用户对应的部门API
      onSearch(){
        this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk (formData) {
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        this.departIds=[];
        this.resultDepartOptions=[];
        var depart=[];  //数组
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
          //新增部门选择，如果上面部门选择后不为空直接付给负责部门
          depart.push({
            key:formData.departIdList[i].key,
            title:formData.departIdList[i].title
          })
          this.departIds.push(formData.departIdList[i].key)
        }
        this.resultDepartOptions=depart;
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys;  //更新当前的选择keys
        this.dpKey = depart[0].key;
        this.form.setFieldsValue({orgName: depart[0].title})

      },
    }
  }
</script>