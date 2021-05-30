<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="PreHandleOk"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24" :sm="12">
            <a-form-item label="订单类型 " :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type',validatorRules.type]" :trigger-change="true" dictCode="tmm_order_type" placeholder="请选择订单类型 "/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="供方名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-popup v-decorator="['tcsProfileInfName',validatorRules.tcsProfileInfName]" :triggerChange="true" code="tbd_supply_id" org-fields="cs_name,id,cs_code" dest-fields="tcsProfileInfName,tcsProfileInfId,tcsProfileInfCode" placeholder="请选择供方" @callback="popupCallback"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="供方编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input v-decorator="['tcsProfileInfCode',validatorRules.tcsProfileInfCode]" placeholder="请从供方名称选择" disabled="disabled"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" hidden="hidden">
            <a-form-item label="供方ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag type="list" v-decorator="['tcsProfileInfId',validatorRules.tcsProfileInfId]" :trigger-change="true"/>
            </a-form-item>
          </a-col>
          <!--需求字段直接引用封装的组件-->
          <a-col :xs="24" :sm="12">
            <a-form-item label="需方（公司）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-select-depart v-decorator="['tbdCompanyId',validatorRules.tbdCompanyId ]"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
<!--            <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <j-select-depart v-decorator="['purchaseOrgn',validatorRules.purchaseOrgn]"/>-->
<!--            </a-form-item>-->
              <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-dict-select-tag type="list" v-decorator="['purchaseOrgn',validatorRules.purchaseOrgn]" :trigger-change="true" dictCode="tbd_purchase_org,org_name
,depart_id,del_flag='0'" placeholder="请选择采购组织"/>
              </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['status',{initialValue:'0'}]" disabled="disabled" :trigger-change="true" dictCode="is_check" placeholder="请选择状态"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark']" placeholder="请输入备注"></a-input>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="采购订单明细表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="orderDtlTable.loading"
            :columns="orderDtlTable.columns"
            :dataSource="orderDtlTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            @valueChange="checkText"
            :actionButton="true"/>
        </a-tab-pane>

      </a-tabs>

    </a-spin>
  </j-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import JInput from "../../../components/jeecg/JInput";

  export default {
    name: 'OrderModal',
    mixins: [JEditableTableMixin],
    // ERP子表定点刷新
    inject:{
      realTimeList:{
        type: Function
      },
    },
    components: {
      JInput,
      JDictSelectTag,
      JSelectDepart
    },
    data() {
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
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          type: {
            rules: [
              { required: true, message: '请输入订单类型!'},
            ]
          },
          tcsProfileInfId: {
            rules: [
              { required: true, message: '请输入供方!'},
            ]
          },
          tbdCompanyId: {
            rules: [
              { required: true, message: '请输入需方（公司）!'},
            ]
          },
          purchaseOrgn: {
            rules: [
              { required: true, message: '请输入采购组织!'},
            ]
          },
          tcsProfileInfCode: {
            rules: [
              { required: true, message: '请输入供方编码!'},
            ]
          },
          tcsProfileInfName: {
            rules: [
              { required: true, message: '请输入供方名称!'},
            ]
          },
        },
        refKeys: ['orderDtl', ],
        tableKeys:['orderDtl', ],
        activeKey: 'orderDtl',
        // 采购订单明细表
        orderDtlTable: {
          loading: false,
          dataSource: [],
        //   change:Functioni(!document.forms[0].tbdMaterialId.value && !document.forms[0].shortText.value){
        // alert('xx和xx至少填写一个')},
          columns: [
            {
              title: '采购合同单据号',
              key: 'contractNumber',
              type: FormTypes.popup,
              popupCode:"tmm_contract_dtl",
              destFields:"contractNumber,tenantId,matlQty,matlPrice,tbdMaterialId,shortText,tmmContractDtlId",
              orgFields:"contract_number,tenant_id,matl_qty,matl_price,tbd_material_id,short_text,id",
              width:"200px",
              placeholder: '请选择合同单据号',
              defaultValue: '',
            },
            {
              title: '采购合同明细表',
              key: 'tmmContractDtlId',
              // type: FormTypes.popup,
              type:"hidden",
              // popupCode:"tmm_contract_dtl",
              // destFields:"tmmContractId,tenantId,matlQty,matlPrice,tbdMaterialId,shortText,tmmContractDtlId",
              // orgFields:"tmm_contract_id,tenant_id,matl_qty,matl_price,tbd_material_id,short_text,id",
              width:"200px",
              placeholder: '请选择${title}',
              defaultValue: '',
              // validateRules: [//此处进行验证
              //   {
              //     required: true,//在前端设置此字段必填
              //     message: '${title}不能为空',//在前端设置此字段不能为null，提示文本
              //     // 自定义函数校验 handler,表单验证
              //     handler(type, value, row, column, callback, target) {
              //       //验证name不能重复
              //       let { values } = target.getValuesSync({ validate: false })
              //       let count = 0
              //       for (let val of values) {
              //         if (val['tmmContractDtlId'] === value && val['tmmContractDtlId'] != undefined ) {
              //           if (++count >= 2) {
              //             callback(false, '${title}不能重复')
              //             return
              //           }
              //         }
              //       }
              //       callback(true) // true = 通过验证
              //     }
              //   }
              // ],
            },
            {
              title: '物料名称',
              key: 'tbdMaterialId',
              type: FormTypes.select,
              width:"200px",
              dictCode:"tbd_material,name,id",
              placeholder: '请从合同明细中选择',
              defaultValue: '',
              disabled:true,
              validateRules: [//此处进行验证
                {
                  required: true,//在前端设置此字段必填
                  message: '${title}不能为空',//在前端设置此字段不能为null，提示文本
                  // 自定义函数校验 handler,表单验证
                  handler(type, value, row, column, callback, target) {
                    //验证name不能重复
                    let { values } = target.getValuesSync({ validate: false })
                    let count = 0
                    for (let val of values) {
                      if (val['tbdMaterialId'] === value && val['tbdMaterialId'] != undefined ) {
                        if (++count >= 2) {
                          callback(false, '${title}不能重复')
                          return
                        }
                      }
                    }
                    callback(true) // true = 通过验证
                  }
                }
              ],
            },
            {
              title: '短文本',
              key: 'shortText',
              type: FormTypes.select,
              width:"200px",
              placeholder: '请从合同明细中选择',
              defaultValue: '',
              disabled:true,
            },
            {
              title: '数量',
              key: 'matlQty',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
              validateRules: [
                {
                  // 自定义函数校验 handler
                  handler(type, value, row, column, callback, target) {
                    if (value) {
                      callback()
                    } else {
                      callback(false, '${title}不能为空')
                    }
                  }
                }]
            },
            {
              title: '单价',
              key: 'matlPrice',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
              validateRules: [
                {
                  // 自定义函数校验 handler
                  handler(type, value, row, column, callback, target) {
                    if (value) {
                      callback()
                    } else {
                      callback(false, '${title}不能为空')
                    }
                  }
                }]
            },
            {
              title: '币别',
              key: 'payBb',
              type: FormTypes.select,
              dictCode:"fm_pay_bb",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: 'RMB',
              validateRules: [
                {
                  // 自定义函数校验 handler
                  handler(type, value, row, column, callback, target) {
                    if (value) {
                      callback()
                    } else {
                      callback(false, '${title}不能为空')
                    }
                  }
                }]
            },
            {
              title: '交货日期',
              key: 'deliveryDate',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '交货地点',
              key: 'deliveryPlace',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '备注',
              key: 'remark',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },

            {
              title: 'tmm_contract_id',
              key: 'tmm_contract_id',
              type:"hidden"
            },

            {
              title: 'tenant_id',
              key: 'tenant_id',
              type:"hidden"
            },

            {
              title: 'matl_qty',
              key: 'matl_qty',
              type:"hidden"
            },

            {
              title: 'matl_price',
              key: 'matl_price',
              type:"hidden"
            },

            {
              title: 'tbd_material_id',
              key: 'tbd_material_id',
              type:"hidden"
            },

            {
              title: 'short_text',
              key: 'short_text',
              type:"hidden"
            },

            {
              title: 'tmm_contract_dtl_id',
              key: 'tmm_contract_dtl_id',
              type:"hidden"
            },
          ]
        },
        url: {
          add: "/mm/order/add",
          edit: "/mm/order/edit",
          orderDtl: {
            list: '/mm/order/queryOrderDtlByMainId'
          },
        }
      }
    },
    methods: {
     /** 确定按钮点击事件 */
      PreHandleOk(){
        this.handleOk();
        this.realTimeList();
      },
      // 使短文本与物料信息相等
      checkText(e) {
        if (e.value !== '' && e.column.title === '物料名称') {
          let text = e.target.getSelectTranslateText(e.value, e.row, e.column)
          if(text!== '' && text !== undefined){
            e.target.setValues([
              {
                rowKey: e.row.id, // 行的id
                values: { // 在这里 values 中的 name 是你 columns 中配置的 key
                  'shortText': text ,
                }
              },
            ])
          }
          else{
            e.target.setValues([
              {
                rowKey: e.row.id, // 行的id
                values: { // 在这里 values 中的 name 是你 columns 中配置的 key
                  'shortText': '' ,
                }
              },
            ])
          }
        }
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'type','voucherTime','tcsProfileInfId','tbdCompanyId','purchaseOrgn','status','remark','tcsProfileInfCode','tcsProfileInfName')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.orderDtl.list, params, this.orderDtlTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          orderDtlList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'org_name','type','voucherTime','tcsProfileInfId','tcsProfileInfCode','tcsProfileInfName','tbdCompanyId','purchaseOrgn','status','remark'))
     },
    }
  }
</script>

<style scoped>
</style>