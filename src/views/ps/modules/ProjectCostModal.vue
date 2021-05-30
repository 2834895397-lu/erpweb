<template>
  <j-modal :title="title"
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
            <a-form-item label="款项类型"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['wbsTypeId']"
                       placeholder="请输入款项类型"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="费用金额"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['cost',validatorRules.cost]"
                              placeholder="请输入费用金额"
                              style="width: 100%" />
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

export default {
  name: "ProjectCostModal",
  components: {
  },
  props: {
    mainId: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      title: "操作",
      width: 800,
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
        cost: {
          rules: [
            { required: true, message: '请输入费用金额!' },
          ]
        }
      },
      url: {
        add: "/ps/project/addProjectCost",
        edit: "/ps/project/editProjectCost",
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
        this.form.setFieldsValue(pick(this.model, 'createBy', 'createTime', 'updateBy', 'updateTime', 'sysOrgCode', 'delFlag', 'ver', 'tenantId', 'projectId', 'wbsTypeId', 'cost'))
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
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          formData['projectId'] = this.mainId
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
            that.close();
          })
        }

      })
    },
    handleCancel () {
      this.close()
    },
    popupCallback (row) {
      this.form.setFieldsValue(pick(row, 'createBy', 'createTime', 'updateBy', 'updateTime', 'sysOrgCode', 'delFlag', 'ver', 'tenantId', 'projectId', 'wbsTypeId', 'cost'))
    },


  }
}
</script>
