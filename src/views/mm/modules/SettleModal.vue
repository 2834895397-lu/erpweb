<template>
  <j-modal :title="title"
           :width="1200"
           :visible="visible"
           :maskClosable="false"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @ok="preHandleOk"
           @cancel="preHandleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="结算单号"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input disabled=""
                       placeholder="结算单号"
                       v-decorator="['settleNumber']"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="供应商"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-popup :multi="false"
                       v-decorator="['tcsProfileInfName',validatorRules.tcsProfileInfName]"
                       :trigger-change="true"
                       org-fields="id,cs_name,cs_code"
                       dest-fields="tcsProfileInfId,tcsProfileInfName,tcsProfileInfCode"
                       placeholder="请选择供应商"
                       code="tbd_supply_id"
                       :disabled="disabled"
                       @callback="popupCallback" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="审核日期"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date disabled=""
                      placeholder="审核日期"
                      v-decorator="['voucherTime']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="供应商ID"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['tcsProfileInfId']"
                       style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 hidden="hidden">
            <a-form-item label="供应商编码"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input disabled=""
                       v-decorator="['tcsProfileInfCode']"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="金额"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input-number disabled=""
                              v-decorator="['matlAmount']"
                              placeholder="请输入金额"
                              style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="起始日期"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date disabled=""
                      placeholder="请选择起始日期"
                      v-decorator="['startTime']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="终止日期"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date disabled=""
                      placeholder="请选择终止日期"
                      v-decorator="['endTime']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="状态"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag disabled=""
                                 type="list"
                                 v-decorator="['status',{'initialValue':0}]"
                                 :trigger-change="true"
                                 dictCode="is_check"
                                 placeholder="请选择状态" />
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

        </a-row>
      </a-form>

      <!-- 子表单区域   -->
      <a-tabs v-model="activeKey"
              @change="handleChangeTabs">
        <a-tab-pane tab="采购结算明细"
                    :key="refKeys[0]"
                    :forceRender="true">
          <j-editable-table :ref="refKeys[0]"
                            :loading="settleDtlTable.loading"
                            :columns="settleDtlTable.columns"
                            :dataSource="settleDtlTable.dataSource"
                            :maxHeight="300"
                            :rowNumber="true"
                            :rowSelection="true"
                            @valueChange="valueChange"
                            :actionButton="buttonShow" />
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
import JDictSelectTag from "@/components/dict/JDictSelectTag"

export default {
  name: 'SettleModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JDictSelectTag,
  },
  data () {
    return {
      disabled: false,
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
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        tcsProfileInfId: {
          rules: [
            { required: true, message: '请输入供方!' },
          ]
        },
        tcsProfileInfCode: {
          rules: [
            { required: true, message: '请输入供方编码!' },
          ]
        },
        tcsProfileInfName: {
          rules: [
            { required: true, message: '请输入供方名称!' },
          ]
        },
      },
      refKeys: ['settleDtl',],
      tableKeys: ['settleDtl',],
      activeKey: 'settleDtl',
      disabled1: true,
      buttonShow: true,
      that: this,
      // 采购结算明细表
      settleDtlTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '采购合同单据号',
            key: 'contractNumber',
            type: FormTypes.popup,
            popupCode: "tsm_matl_in_order_dtl",
            disabled: true,
            destFields: "contractNumber,tbdMaterialId,matlQty,matlPrice,payBb,tsmMatlInOrderDtlId,tmmContractId,tmmContractDtlId",
            orgFields: "contract_number,tbd_material_id,matl_qty,matl_price,pay_bb,tsm_matl_in_order_dtl_id,tmm_contract_id,tmm_contract_dtl_id",
            width: "200px",
            placeholder: '请选择${title}',
            defaultValue: '',
            initQueryParam: '',
            validateRules: [
              {
                required: true,
                message: '${title}不能为空',
                handler (type, value, row, column, callback, target) {
                  //验证tsmMatlInOrderDtlId不能重复
                  let { values } = target.getValuesSync({ validate: false })

                  var cdList = new Array();
                  for (var j = 0; j < values.length; j++) {
                    if (values[j].tsmMatlInOrderDtlId != null && values[j].tsmMatlInOrderDtlId != '') {
                      cdList.push(values[j].tsmMatlInOrderDtlId);
                    }
                  }
                  var nary = cdList.sort();
                  for (var i = 0; i < cdList.length; i++) {
                    if (cdList[i] == cdList[i + 1]) {
                      callback(false, '收货单明细不能重复')
                      return
                    }
                  }
                  callback(true) // true = 通过验证
                }
              }
            ],
          },

          {
            title: '物料',
            key: 'tbdMaterialId',
            type: FormTypes.select,
            dictCode: "tbd_material,name,id",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            disabled: true,
          },
          {
            title: '数量',
            key: 'matlQty',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            disabled: true,

          },
          {
            title: '单价',
            key: 'matlPrice',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            disabled: true
          },
          {
            title: '币别',
            key: 'payBb',
            type: FormTypes.select,
            dictCode: 'fm_pay_bb',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            disabled: true,
          },
          {
            title: '收货单明细表ID',
            key: 'tsmMatlInOrderDtlId',
            type: 'hidden',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '采购合同主表ID',
            key: 'tmmContractId',
            type: 'hidden',
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '采购合同明细表ID',
            key: 'tmmContractDtlId',
            type: "hidden",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            type: 'hidden',
          },
          {
            title: 'tsm_matl_in_order_id',
            key: 'tsm_matl_in_order_id',
            type: "hidden"
          },

          {
            title: 'tbd_material_id',
            key: 'tbd_material_id',
            type: "hidden"
          },

          {
            title: 'matl_qty',
            key: 'matl_qty',
            type: "hidden"
          },

          {
            title: 'matl_price',
            key: 'matl_price',
            type: "hidden"
          },
          {
            title: 'contract_number',
            key: 'contract_number',
            type: 'hidden',
          },
        ]
      },
      url: {
        add: "/mm/settle/add",
        edit: "/mm/settle/edit",
        settleDtl: {
          list: '/mm/settle/querySettleDtlByMainId'
        },
      }
    }
  },
  methods: {
    preHandleOk () {
      this.handleOk()
      this.disabled = false
    },
    preHandleCancel () {
      this.handleCancel()
      this.disabled = false
    },
    getAllTable () {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter () {

      this.settleDtlTable.columns[0].disabled = true;//设置结算明细表不可选

      let fieldval = pick(this.model, 'settleNumber', 'tcsProfileInfId', 'tcsProfileInfCode', 'tcsProfileInfName',
        'tenantId', 'voucherTime', 'startTime', 'endTime', 'matlAmount', 'status', 'remark')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据:获取采购结算明细记录
      if (this.model.id) {

        this.disabled = true;//修改时表单不可编辑
        this.settleDtlTable.columns[0].disabled = true;//设置结算明细表可选
        this.buttonShow = false;

        let params = { id: this.model.id }
        this.requestSubTableData(this.url.settleDtl.list, params, this.settleDtlTable)
      }
      //

    },
    /** 整理成formData */
    classifyIntoFormData (allValues) {
      let main = Object.assign(this.model, allValues.formValue)

      return {
        ...main, // 展开
        settleDtlList: allValues.tablesValue[0].values,
      }
    },
    validateError (msg) {
      this.$message.error(msg)
    },
    popupCallback (row) {
      this.settleDtlTable.columns[0].disabled = false;//设置结算明细表可选

      this.form.setFieldsValue(pick(row, 'contractNumber', 'tenantId', 'voucherTime', 'startTime', 'endTime', 'tcsProfileInfId', 'matlAmount', 'status', 'remark', 'tcsProfileInfCode', 'tcsProfileInfName'))
      //获取选中的供应商
      this.settleDtlTable.columns[0].initQueryParam = this.form.getFieldsValue().tcsProfileInfCode;
    },
    valueChange ({ type, row, column, value, target }) {
      if (column.type == 'popup') {
        if (value && value != '') {
          this.disabled = true;
        }
      }
    },

  }
}
</script>

<style scoped>
</style>