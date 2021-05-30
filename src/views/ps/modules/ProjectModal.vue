<template>
  <j-modal :title="title"
           :width="1200"
           :visible="visible"
           :maskClosable="false"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @ok="handleOk"
           @cancel="handleCancel"
           :okButtonProps="{ class:{'jee-hidden': disableSubmit} }">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="项目编号"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectNo',validatorRules.projectNo]"
                       placeholder="请输入项目编号"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="合同ID"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractId']"
                       style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="合同编号"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-popup :multi="false"
                       v-decorator="['contractTitle']"
                       :trigger-change="true"
                       org-fields="id,contract_no,contract_title,sign_date,sign_address,begin_date,end_date,operator,party_a_name,party_a_id,party_b_id,party_b_name,remark,pay_bb"
                       dest-fields="contractId,contract_no,contractTitle,sign_date,sign_address,begin_date,end_date,operator,partyAName,partyAId,partyBId,partyBName,remark,payBb"
                       placeholder="请选择合同编号"
                       code="contract_list"
                       @callback="popupCallback1" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="项目名称"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName',validatorRules.projectName]"
                       placeholder="请输入项目名称"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="币种"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 :disabled="editDisabled"
                                 v-decorator="['payBb',{ rules: [{ required: true, message: '请选择币种!' }],initialValue:'RMB'}]"
                                 :trigger-change="true"
                                 dictCode="fm_pay_bb"
                                 placeholder="请选择币种" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="项目属性"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-select v-decorator="['projectTypeId',validatorRules.projectTypeId]"
                        placeholder="请选择项目属性">
                <a-select-option v-for="item in projectTypes"
                                 :key="item.id"
                                 :value="item.id">{{item.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="经办人"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input :disabled="editDisabled"
                       v-decorator="['operator', {rules: [ { required: true, message: '请输入经办人!' } ],initialValue: nickname()} ]"
                       placeholder="请输入经办人"
                       style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="项目工期(天数)"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['projectPeriod']"
                              placeholder="请输入项目工期(天数)"
                              style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="开始日期"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date placeholder="请选择开始日期"
                      v-decorator="['beginDate']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="结束日期"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date placeholder="请选择结束日期"
                      v-decorator="['endDate']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="项目负责人"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectManager',validatorRules.projectManager]"
                       placeholder="请输入项目负责人"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="甲方ID"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyAId']"
                       style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="甲方名称"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-popup v-decorator="['partyAName',validatorRules.partyAName]"
                       :disabled="editDisabled"
                       :triggerChange="true"
                       code="tps_contract_partya"
                       org-fields="cs_name,id,cs_code"
                       dest-fields="partyAName,partyAId,tcsProfileInfCode"
                       placeholder="请选择甲方"
                       @callback="popupCallback" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="乙方ID"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['partyBId']"
                       style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="乙方名称"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-popup v-decorator="['partyBName',validatorRules.partyBName]"
                       :disabled="editDisabled"
                       :triggerChange="true"
                       code="tps_contract_partyb"
                       org-fields="cs_name,id,cs_code"
                       dest-fields="partyBName,partyBId,tcsProfileInfCode"
                       placeholder="请选择乙方"
                       @callback="popupCallback" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="WBS模板"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-select v-decorator="['wbsId',validatorRules.wbsId]"
                        placeholder="请选择WBS模板"
                        @change="wbsOnchange">
                <a-select-option v-for="item in WbsModels"
                                 :key="item.id"
                                 :value="item.id">{{item.text}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="备注"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']"
                       placeholder="请输入备注"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="状态"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 :disabled="true"
                                 v-decorator="['status',{initialValue:0}]"
                                 :trigger-change="true"
                                 dictCode="tps_project_status"
                                 placeholder="请输入状态" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="上传附件"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-upload v-decorator="['url']"
                        :trigger-change="true"></j-upload>
              <span>支持扩展名：.doc .docx .pdf .jpg... </span>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey"
              @change="handleChangeTabs">
        <a-tab-pane tab="项目费用表"
                    :key="refKeys[0]"
                    :forceRender="true">
          <j-editable-table :ref="refKeys[0]"
                            :loading="projectCostTable.loading"
                            :columns="projectCostTable.columns"
                            :dataSource="projectCostTable.dataSource"
                            :maxHeight="300"
                            :rowNumber="true"
                            :rowSelection="false"
                            :actionButton="false" />
        </a-tab-pane>

      </a-tabs>

    </a-spin>
  </j-modal>
</template>

<script>

import pick from 'lodash.pick'
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { validateDuplicateValue } from '@/utils/util'
import JDate from '@/components/jeecg/JDate'
import JUpload from '@/components/jeecg/JUpload'
import JDictSelectTag from "@/components/dict/JDictSelectTag"
import { httpAction, getAction } from '@/api/manage'
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JUpload,
    JDictSelectTag,
    httpAction,
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      projectTypes: [],
      WbsTypes: [],
      WbsModels: [],
      disableSubmit: false,
      editDisabled: false,
      wbsModelId: '',
      userName: '',//经办人
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 0,
      validatorRules: {
        projectNo: {
          rules: [
            { required: true, message: '请输入项目编号!' },
          ]
        },
        projectName: {
          rules: [
            { required: true, message: '请输入项目名称!' },
          ]
        },
        projectTypeId: {
          rules: [
            { required: true, message: '请选择项目属性!' },
          ]
        },
        wbsId: {
          rules: [
            { required: true, message: '请选择wbs模板!' },
          ]
        },
        payBb: {
          rules: [
            { required: true, message: '请选择币种!' },
          ]
        },
        projectManager: {
          rules: [
            { required: true, message: '请输入项目负责人!' },
          ]
        },
        partyAName: {
          rules: [
            { required: true, message: '请选择甲方!' },
          ]
        },
        partyBName: {
          rules: [
            { required: true, message: '请选择乙方!' },
          ]
        }
      },
      refKeys: ['projectCost',],
      tableKeys: ['projectCost',],
      activeKey: 'projectCost',
      // 项目费用表
      projectCostTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: 'wbs类型ID',
            key: 'wbsTypeId',
            type: "hidden"
          },
          {
            title: '款项类型',
            key: 'wbsTypeName',
            type: FormTypes.input,
            width: "400px",
            defaultValue: '',
            disabled: true
          },
          {
            title: '费用金额',
            key: 'cost',
            type: FormTypes.input,
            width: "400px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [
              {
                required: true,
                message: '${title}不能为空',
              }
            ]
          },
        ]
      },
      url: {
        add: "/ps/project/add",
        edit: "/ps/project/edit",
        projectCost: {
          list: '/ps/project/queryProjectCostByMainId'
        },
        getUrl: "/bd/attachedUrl/getAttachedUrlByRelationId",
        projectTypeList: "/bd/projectType/list",
        getWbsTypeList: "/bd/wbsType/list",
        getProjectInfo: "/ps/project/getProjectInfo",
        getWbsModelList: "/ps/wbsModel/queryWbsModelList"
      }
    }
  },
  methods: {
    ...mapGetters(["nickname"]),
    getAllTable () {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter () {
      let fieldval = pick(this.model, 'projectNo', 'projectName', 'contractId', 'projectPeriod', 'projectTypeId', 'beginDate', 'endDate', 'projectManager', 'remark',
        'partyAName', 'partyBName', 'operator', 'status')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      this.getWbsModelList();//获取wbs模板
      this.getProjectTypeList();//获取项目属性

      // 加载子表数据
      if (this.model.id) {
        this.editDisabled = true;

        //获取项目信息
        let params = { id: this.model.id }
        getAction(this.url.getProjectInfo, params).then((res) => {
          if (res.success) {
            this.wbsModelId = res.result.wbsId;
            let fieldval = pick(res.result, 'contractId', 'contractTitle', 'partyAId', 'partyBId', 'payBb', 'projectTypeId', 'wbsId', 'status')
            this.$nextTick(() => {
              this.form.setFieldsValue(fieldval)
            })
          }
        })
        //获取附件
        getAction(this.url.getUrl, params).then((res) => {
          if (res.success) {
            this.model.url = res.result;
            let fieldval = pick(this.model, 'url')
            this.$nextTick(() => {
              this.form.setFieldsValue(fieldval)
            })
          }
        })
        //获取费用信息
        params = { wbsId: this.wbsModelId, projectId: this.model.id }
        this.requestSubTableData(this.url.projectCost.list, params, this.projectCostTable)
      }

    },
    /** 整理成formData */
    classifyIntoFormData (allValues) {
      let main = Object.assign(this.model, allValues.formValue)

      return {
        ...main, // 展开
        projectCostList: allValues.tablesValue[0].values,
      }
    },
    validateError (msg) {
      this.$message.error(msg)
    },
    popupCallback (row) {
      this.form.setFieldsValue(pick(row, 'projectNo', 'projectName', 'contractId', 'projectTypeId', 'projectPeriod', 'beginDate', 'endDate', 'projectManager', 'remark',
        'partyAId', 'partyAName', 'partyBId', 'partyBName'))
    },
    //合同回调
    popupCallback1 (row) {
      this.form.setFieldsValue(pick(row, 'contractId', 'contractTitle', 'operator', 'partyAName', 'partyAId', 'partyBId', 'partyBName', 'payBb'))
      this.editDisabled = true;
    },
    //获取项目属性
    getProjectTypeList () {
      getAction(this.url.projectTypeList, null).then(res => {
        if (res.success) {
          const result = res.result.records;
          result.forEach((r) => {
            this.projectTypes.push({
              id: r.id,
              text: r.projectTypeName
            })
          })
        } else {
          this.$message.error('获取项目属性失败!')
        }
      })
    },
    //获取wbs模板
    getWbsModelList () {
      getAction(this.url.getWbsModelList, null).then(res => {
        if (res.success) {
          const result = res.result;
          result.forEach((r) => {
            this.WbsModels.push({
              id: r.id,
              text: r.wbsModelName
            })
          })
        } else {
          this.$message.error('获取WBS模板失败!')
        }
      })
    },
    //wbs模板change事件
    wbsOnchange (value) {
      let params = { wbsId: value }
      this.requestSubTableData(this.url.projectCost.list, params, this.projectCostTable)
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close');
      this.visible = false;
      this.editDisabled = false;
      this.projectTypes = [];
      this.WbsTypes = [];
      this.WbsModels = [];
      this.projectCostTable.dataSource = [];
      this.wbsModelId = '';
    },

  },

}
</script>

<style scoped>
</style>