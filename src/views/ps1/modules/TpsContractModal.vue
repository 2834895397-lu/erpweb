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
                 :sm="24">
            <a-form-item label="合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractNo',validatorRules.contractNO]" placeholder="请输入合同号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="24">
            <a-form-item label="合同标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractTitle',validatorRules.contractTitle]" placeholder="请输入合同标题"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="招投标ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingInfId']" placeholder="请输入招投标ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="签订地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['signAddress']" placeholder="请输入签订地点"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="币别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-input v-decorator="['payBb']" placeholder="请输入币别"></a-input>-->
              <j-dict-select-tag type="list" v-decorator="['payBb',validatorRules.paybb]" :trigger-change="true" dictCode="tps_pay_bb" placeholder="请输入币别"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择签订日期" v-decorator="['signDate',{'initialValue':new Date()}]"   :trigger-change="true"  style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="合同类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-input v-decorator="['contractType']" placeholder="请输入合同类型"></a-input>-->
              <j-dict-select-tag type="list" v-decorator="['contractType',validatorRules.contractType]" :trigger-change="true" dictCode="tbd_contract_type" placeholder="请输入合同类型"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['contractAmount',{'initialValue':0}]" placeholder="请输入合同金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="经办人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['operator',{'initialValue':nickname()}]" placeholder="请输入经办人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="合同生效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择合同生效期" v-decorator="['beginDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="合同截止期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择合同截止期" v-decorator="['endDate']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="税率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['taxRate',{'initialValue':0}]"   placeholder="请输入税率" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<j-dict-select-tag type="radio" v-decorator="['taxFlag']" :trigger-change="true" dictCode="tps_tax_flag" />-->
              <a-checkbox @change="onChange" >
                含税
              </a-checkbox>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="甲方公司ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyAId']" placeholder="请输入甲方公司ID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="甲方公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-input v-decorator="['partyAName']" placeholder="请输入甲方公司名称"></a-input>-->
              <j-popup  v-decorator="['partyAName',validatorRules.partyAName]"
                :disabled="editDisabled"
                :triggerChange="true"
                org-fields="cs_name,id,legal,trustee_name,opening_bank,bank_account"
                dest-fields="partyAName,partyAId,partyALegal,partyATrusteeName,partyABankName,partyABankAccount"
                code="tps_contract_partya"
                placeholder="请选择甲方"
                @callback="popupCallback"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
          <a-form-item label="乙方公司ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['partyBId']" placeholder="请输入乙方公司ID"></a-input>
          </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="乙方公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--<a-input v-decorator="['partyBName']" placeholder="请输入乙方公司名称"></a-input>-->
              <j-popup v-decorator="['partyBName',validatorRules.partyBName]"
                       :disabled="editDisabled"
                       :triggerChange="true"
                       org-fields="cs_name,id,legal,trustee_name,opening_bank,bank_account"
                       dest-fields="partyBName,partyBId,partyBLegal,partyBTrusteeName,partyBBankName,partyBBankAccount"
                       code="tps_contract_partyb"
                       placeholder="请选择乙方"
                       @callback="popupCallback"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="甲方法人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['partyALegal',validatorRules.partyALegal]" placeholder="请输入甲方法人"></a-input>
          </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="乙方法人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyBLegal',validatorRules.partyBLegal]" placeholder="请输入乙方法人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="甲方委托人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyATrusteeName',validatorRules.partyATrusteeName]" placeholder="请输入甲方委托人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="乙方委托人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyBTrusteeName',validatorRules.partyBTrusteeName]" placeholder="请输入乙方委托人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="甲方开户行" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyABankName']" placeholder="请输入甲方开户行"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="乙方开户行" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyBBankName']" placeholder="请输入乙方开户行"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="甲方账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyABankAccount',validatorRules.partyAOpeningBank]" placeholder="请输入甲方账号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="乙方账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyBBankAccount',validatorRules.partyBOpeningBank]" placeholder="请输入乙方账号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="关联合同ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['refContractId']" placeholder="请输入关联合同ID"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['status',{'initValue':'0'}]" :trigger-change="true" dictCode="ps_contract_status" placeholder="请选择状态"/>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']" placeholder="请输入备注"></a-input>
            </a-form-item>
          </a-col>

            <a-col :span="24">
              <a-form-item label="上传附件"
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol">
                <j-upload v-decorator="['url']"
                          :trigger-change="true">
                </j-upload>
                <span>支持扩展名：.doc .docx .pdf .jpg...</span>
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
  import JUpload from '@/components/jeecg/JUpload'
  import JCheckbox from '@/components/jeecg/JCheckbox'
  import { mapGetters } from 'vuex'

  export default {
    name: "TpsContractModal",
    components: {
      JDate,
      JDictSelectTag,
      JUpload,
      JCheckbox,
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
          add: "/ps1/tpsContract/add",
          edit: "/ps1/tpsContract/edit",
        },
        checked:false,

        userName:'',

        validatorRules: {
          contractNO: {
            rules: [
              {required: true, message: '请输入合同号!'},
            ]
          },
          contractTitle: {
            rules: [
              {required: true, message: '请输入合同标题!'},
            ]
          },
          paybb: {
            rules: [
              {required: true, message: '请选择币种!'},
            ]
          },
          contractType: {
            rules: [
              {required: true, message: '请选择合同类型!'},
            ]
          },
          partyAName: {
            rules: [
              {required: true, message: '请选择甲方名称!'},
            ]
          },
          partyALegal: {
            rules: [
              {required: true, message: '请填写甲方法人!'},
            ]
          },
          partyATrusteeName: {
            rules: [
              {required: true, message: '请填写甲方委托人!'},
            ]
          },
          partyAOpeningBank: {
            rules: [
              {required: true, message: '请填写甲方账号!'},
            ]
          },
          partyBName: {
            rules: [
              {required: true, message: '请选择乙方名称!'},
            ]
          },
          partyBLegal: {
            rules: [
              {required: true, message: '请填写乙方法人!'},
            ]
          },
          partyBTrusteeName: {
            rules: [
              {required: true, message: '请填写乙方委托人!'},
            ]
          },
          partyBOpeningBank: {
            rules: [
              {required: true, message: '请填写乙方账号!'},
            ]
          },


        }
      }
    },
    created () {
       this.getAuthority();
    },
    methods: {
      ...mapGetters(["nickname"]),
      getAuthority(){
        // {"value":"admin","expire":1612246367077}
        var str = localStorage.getItem("pro__Login_Username");
        var info = JSON.parse(str);
        this.userName = info.value;
        // console.log("userName:",this.userName);
      },

      onChange(e) {
        debugger
        this.checked = e.target.checked;
        if (this.checked == true) {
            this.model.taxFlag = 1;
        }else{
          this.model.taxFlag = 0;
        }
      },

      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        if (null == this.model.taxFlag){
          this.model.taxFlag = 0;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'contractNo','contractTitle','biddingInfId','taxRate','taxFlag','payBb','contractAmount','signAddress','signDate','beginDate','endDate','operator','partyAId','partyAName','partyALegal','partyATrusteeName','partyABankName','partyABankAccount','partyBId','partyBName','partyBLegal','partyBTrusteeName','partyBBankName','partyBBankAccount','refContractId','contractType','status','remark'))
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
        this.form.setFieldsValue(pick(row,'contractNo','contractTitle','biddingInfId','taxRate','taxFlag','payBb','contractAmount','signAddress','signDate','beginDate','endDate','operator','partyAId','partyAName','partyALegal','partyATrusteeName','partyABankName','partyABankAccount','partyBId','partyBName','partyBLegal','partyBTrusteeName','partyBBankName','partyBBankAccount','refContractId','contractType','status','remark'))
      },


    }
  }
</script>