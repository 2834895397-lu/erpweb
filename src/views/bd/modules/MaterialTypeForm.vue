<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="物料类型编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialTypeCode']" placeholder="请输入物料类型编码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="物料类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialTypeName']" placeholder="请输入物料类型名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag type="list" v-decorator="['orgId']" :trigger-change="true" :dictOptions="a.departNames"
                                   placeholder="请选择采购组织"/>
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

import {getAction, httpAction} from '@/api/manage'
import pick from 'lodash.pick'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDictSelectTag from "@/components/dict/JDictSelectTag"
import JSearchSelectTag from "@comp/dict/JSearchSelectTag";

export default {
  name: 'MaterialTypeForm',
  components: {
    JSearchSelectTag,
    JFormContainer,
    JDictSelectTag,
  },

  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {
      },
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
  inject: {
    a: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      /* departName:[],*/
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      confirmLoading: false,
      validatorRules: {},
      url: {
        add: "/bd/materialType/add",
        edit: "/bd/materialType/edit",
        queryById: "/bd/materialType/queryById"
      }
    }

  },
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    }
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    this.showFlowData();
  },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'materialTypeCode', 'materialTypeName', 'orgId'))
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = {id: this.formData.dataId};
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result);
          }
        });
      }
    },
    submitForm() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          console.log("表单提交数据", formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'materialTypeCode', 'materialTypeName', 'orgId'))
    },
  }
}
</script>