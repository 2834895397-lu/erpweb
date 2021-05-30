<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="库存地" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select dict="tbd_node,name,id" pid-field="pid" pidValue="0"
                v-decorator="['toTbdNodeId']" placeholder="请输入库存地"></j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单据类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type']" :trigger-change="true" dictCode="tsm_waste_book_type" placeholder="请选择单据类型"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单据号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['orderId']" placeholder="请输入单据号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select dict="tbd_material,name,id" pid-field="pid" pidValue="0"
                v-decorator="['tbdMaterialId']" placeholder="请输入物料"></j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="过账日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择过账日期" v-decorator="['postTime']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['matlQty']" placeholder="请输入数量" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['matlPrice']" placeholder="请输入单价" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="出入库方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['matlDirect']" :trigger-change="true" dictCode="matl_direct_type" placeholder="请选择出入库方向"/>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from '@/components/jeecg/JTreeSelect'

  export default {
    name: 'WasteBookForm',
    components: {
      JTreeSelect,
      JFormContainer,
      JDate,
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
        },
        url: {
          add: "/sm/wasteBook/add",
          edit: "/sm/wasteBook/edit",
          queryById: "/sm/wasteBook/queryById"
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
          this.form.setFieldsValue(pick(this.model,'toTbdNodeId','type','orderId','tbdMaterialId','postTime','matlQty','matlPrice','matlDirect'))
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
        this.form.setFieldsValue(pick(row,'toTbdNodeId','type','orderId','tbdMaterialId','postTime','matlQty','matlPrice','matlDirect'))
      },
    }
  }
</script>