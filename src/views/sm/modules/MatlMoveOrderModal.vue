<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="preHandleOk"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24" :sm="12">
            <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type',validatorRules.typeRules]" :trigger-change="true"
                                 dictCode="tsm_matl_move_order_type" placeholder="请选择类型"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="过账日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date :trigger-change="true" v-decorator="['postingDate',validatorRules.postingDateRules]" placeholder="请选择过账日期"></j-date>
            </a-form-item>
          </a-col>
<!--          <a-col :xs="24" :sm="12">
            <a-form-item label="凭证日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date disabled="" placeholder="请选择凭证日期" v-decorator="['voucherTime']" :trigger-change="true"
                      style="width: 100%"/>
            </a-form-item>
          </a-col>-->
          <a-col :xs="24" :sm="12">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag disabled type="list" v-decorator="['status',{'initialValue':0}]" :trigger-change="true"
                                 dictCode="is_check" placeholder="请选择状态"/>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="移库单明细表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="matlMoveOrderDtlTable.loading"
            :columns="matlMoveOrderDtlTable.columns"
            :dataSource="matlMoveOrderDtlTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
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
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'MatlMoveOrderModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JDictSelectTag
  },
  inject: {
    onClearSelectedList: {
      type: Function
    }
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        typeRules: {
          rules: [{ required: true, message: '请选择类型!' }],
          initialValue: '1'
        },
        postingDateRules: {
          rules: [{ required: true, message: '请选择过账日期!' }],
          initialValue: new Date()
        }
      },
      refKeys: ['matlMoveOrderDtl'],
      tableKeys: ['matlMoveOrderDtl'],
      activeKey: 'matlMoveOrderDtl',
      // 移库单明细表
      matlMoveOrderDtlTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '移库起点库存地',
            key: 'fromTbdNodeName',
            type: FormTypes.popup,
            popupCode: 'currentStock',
            destFields: 'fromTbdNodeName,fromTbdNodeId,tbdMaterialId',
            orgFields: 'to_tbd_node_name,to_tbd_node_id,tbd_material_id',
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '移库起点库存地ID',
            key: 'fromTbdNodeId',
            type: FormTypes.sel_search,
            dictCode: 'tbd_node,name,id',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            type:'hidden',
            validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  if(value){
                    callback()
                  }else {
                    callback(false, '${title}不能为空')
                  }
                }
              }]
          },
          {
            title: '物料',
            key: 'tbdMaterialId',
            type: FormTypes.sel_search,
            dictCode: 'tbd_material,name,id',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  let { values } = target.getValuesSync({ validate: false })
                  let count = 0
                  for (let i = 0; i < values.length - 1; i++) {
                    for (let j = i + 1; j < values.length; j++) {
                      if (values[i].tbdMaterialId === values[j].tbdMaterialId && values[i].fromTbdNodeId === values[j].fromTbdNodeId && values[i].toTbdNodeId === values[j].toTbdNodeId) {
                        callback(false, '相同库存起点和终点不能出库相同物料')
                        return
                      }
                    }
                  }
                  if (value) {
                    callback()
                  } else {
                    callback(false, '${title}不能为空')
                  }
                }
              }]
          },
          {
            title: '移库终点库存地',
            key: 'toTbdNodeId',
            type: FormTypes.sel_search,
            dictCode: 'tbd_node,name,id',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  if(value){
                    callback()
                  }else {
                    callback(false, '${title}不能为空')
                  }
                }
              }]
          },
          {
            title: '数量',
            key: 'matlQty',
            type: FormTypes.inputNumber,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  if (value && value >= 1 && value.indexOf('.') == -1) {
                    callback()
                  } else {
                    callback(false, '${title}必须大于等于1的整数')
                  }
                }
              }]
          },
          {
            title: '单价',
            key: 'matlPrice',
            type: FormTypes.inputNumber,
            width: '200px',
            type:'hidden',
            placeholder: '请输入${title}',
            defaultValue: '',
         /*   validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  if (value > 0 && (value.indexOf('.') != -1 ? (value.split('.')[1].length <= 2 ? true : false) : true)) {
                    callback()
                  } else {
                    callback(false, '${title}必须大于0且最多有两位小数')
                  }
                }
              }]*/
          },
          {
            title: '币别',
            key: 'payBb',
            type: FormTypes.sel_search,
            dictCode:"fm_pay_bb",
            width:"200px",
            type:'hidden',
            placeholder: '请输入${title}',
            defaultValue: 'RMB',
            /*validateRules: [
              {
                // 自定义函数校验 handler
                handler(type, value, row, column, callback, target) {
                  if(value){
                    callback()
                  }else {
                    callback(false, '${title}不能为空')
                  }
                }
              }]*/
          }
        ]
      },
      url: {
        add: '/sm/matlMoveOrder/add',
        edit: '/sm/matlMoveOrder/edit',
        matlMoveOrderDtl: {
          list: '/sm/matlMoveOrder/queryMatlMoveOrderDtlByMainId'
        }
      }
    }
  },
  methods: {

    preHandleOk() {
      this.handleOk()
      this.onClearSelectedList()
    },

    getAllTable() {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      let fieldval = pick(this.model, 'type', 'voucherTime', 'status','postingDate')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.matlMoveOrderDtl.list, params, this.matlMoveOrderDtlTable)
      }
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)

      return {
        ...main, // 展开
        matlMoveOrderDtlList: allValues.tablesValue[0].values
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'type', 'voucherTime', 'status','postingDate'))
    }

  }
}
</script>

<style scoped>
</style>