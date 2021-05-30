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
            <a-form-item label="合同号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractNo']" placeholder="请输入合同号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="合同名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractName']" placeholder="请输入合同名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="合同类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type',validatorRules.type]" :trigger-change="true" dictCode="tmm_contract_type" placeholder="请选择合同类型"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择签订日期" v-decorator="['signDate',validatorRules.signDate]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="签订地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['signPlace']" placeholder="请输入签订地点"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="合同有效期起" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择合同有效期起" v-decorator="['validDateFrom',validatorRules.validDateFrom ]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="合同有效期止" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择合同有效期止" v-decorator="['validDateTo',validatorRules.validDateTo]" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="完结标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['contEndFlag',{initialValue:'0'}]" disabled="disabled" :trigger-change="true" dictCode="tmm_cont_end_flag" placeholder="请选择完结标识"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="供方名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-popup :multi="false" v-decorator="['tcsProfileInfName',validatorRules.tcsProfileInfName]" :triggerChange="true" code="tbd_supply_id" org-fields="cs_name,id,cs_code" dest-fields="tcsProfileInfName,tcsProfileInfId,tcsProfileInfCode" placeholder="请选择供方" @callback="popupCallback"/>
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
              <j-select-depart v-decorator="['tbdCompanyId',validatorRules.tbdCompanyId]"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['purchaseOrgn',validatorRules.purchaseOrgn]" :trigger-change="true" dictCode="tbd_purchase_org,org_name
,depart_id,del_flag='0'" placeholder="请选择采购组织"/>
            </a-form-item>
<!--            <a-form-item label="采购组织" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <j-popup :multi="false" v-decorator="['purchaseOrgn',validatorRules.purchaseOrgn]" :triggerChange="true" code="tmm_contract_purchase" org-fields="org_id" dest-fields="purchaseOrgn" placeholder="请选择采购组织" @callback="popupCallback"/>-->
<!--            </a-form-item>-->
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
        <a-tab-pane tab="采购合同明细表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="contractDtlTable.loading"
            :columns="contractDtlTable.columns"
            :dataSource="contractDtlTable.dataSource"
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
  import JDate from '@/components/jeecg/JDate'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JSearchSelectTag from "../../../components/dict/JSearchSelectTag";
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import {httpAction} from "@api/manage";
  import { VALIDATE_NO_PASSED, validateFormAndTables } from '@/utils/JEditableTableUtil'

  export default {
    name: 'ContractModal',
    mixins: [JEditableTableMixin],
    // ERP子表定点刷新
    inject:{
      realTimeList:{
        type: Function
      },
    },
    components: {
      JSearchSelectTag,
      JDate,
      JDictSelectTag,
      JSelectDepart
    },
    data() {
      return {
        msg:[],
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
              { required: true, message: '请输入合同类型!'},
            ]
          },
          signDate: {
            rules: [
              { required: true, message: '请输入签订日期!'},
            ]
          },
          validDateFrom: {
            rules: [
              { required: true, message: '请输入合同有效期起!'},
            ]
          },
          validDateTo: {
            rules: [
              { required: true, message: '请输入合同有效期止!'},
            ]
          },
          tcsProfileInfId: {
            rules: [
              { required: true, message: '请输入供方ID!'},
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
        refKeys: ['contractDtl', ],
        tableKeys:['contractDtl', ],
        activeKey: 'contractDtl',
        // 采购合同明细表
        contractDtlTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '采购申请单据号',
              key: 'planNumber',
              type: FormTypes.popup,
              popupCode:"tmm_plan_dtl",
              destFields:"tenantId,planNumber,tbdMaterialId,matlQty,shortText,tmmPurchasePlanDtlId",
              orgFields:"tenant_id,plan_number,tbd_material_id,matl_qty,short_text,id",
              width:"200px",
              placeholder: '请选择申请单据号',
              defaultValue: '',
            },
            {
              title: '采购申请明细表',
              key: 'tmmPurchasePlanDtlId',
              // type: FormTypes.popup,
              type:"hidden",
              // popupCode:"tmm_plan_dtl",
              // destFields:"tenantId,tbdMaterialId,matlQty,shortText,tmmPurchasePlanDtlId",
              // orgFields:"tenant_id,tbd_material_id,matl_qty,short_text,id",
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
              //         if (val['tmmPurchasePlanDtlId'] === value && val['tmmPurchasePlanDtlId'] != undefined ) {
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
              dictCode:"tbd_material,name,id",
              width:"200px",
              placeholder: '请从申请单据号选择',
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
              type: FormTypes.input,
              width:"200px",
              placeholder: '请从申请单据号选择',
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
              title: '备注',
              key: 'remark',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },

            {
              title: 'tenant_id',
              key: 'tenant_id',
              type:"hidden"
            },

            {
              title: 'tbd_material_id',
              key: 'tbd_material_id',
              type:"hidden"
            },

            {
              title: 'matl_qty',
              key: 'matl_qty',
              type:"hidden"
            },

            {
              title: 'short_text',
              key: 'short_text',
              type:"hidden"
            },

            {
              title: 'tmm_purchase_plan_dtl_id',
              key: 'tmm_purchase_plan_dtl_id',
              type:"hidden"
            },
          ]
        },
        url: {
          add: "/mm/contract/add",
          edit: "/mm/contract/edit",
          contractDtl: {
            list: '/mm/contract/queryContractDtlByMainId'
          },
          getTcsProfileInfId:'/mm/contract/getTcsProfileInfId',
        }
      }
    },
    methods: {
     /** 确定按钮点击事件 */
      PreHandleOk(){
        this.handleOk();
        this.realTimeList();
      },
      handleOk() {
        /** 触发表单验证 */
        this.getAllTable().then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        }).then(allValues => {
          if (typeof this.classifyIntoFormData !== 'function') {
            throw this.throwNotFunction('classifyIntoFormData')
          }
          let formData = this.classifyIntoFormData(allValues)
          // 发起请求
          return this.request(formData)
        }).catch(e => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
            this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
          } else {
            console.error(e)
          }
        })
      },
      request(formData) {
          let url = this.url.add, method = 'post'
        if (this.model.id) {
          url = this.url.edit
          method = 'put'
        }
        this.confirmLoading = true
        httpAction(url, formData, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
           this.msg= res.message;
            // for (let i = 0; i < this.msg.length; i++) {
              this.$message.error(this.msg)
            // }

          }
        }).finally(() => {
          this.confirmLoading = false
        })
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
        let fieldval = pick(this.model,'contractNo','contractName','type','voucherTime','signDate','signPlace','validDateFrom','validDateTo','tcsProfileInfId','tcsProfileInfCode','tcsProfileInfName','tbdCompanyId','purchaseOrgn','status','remark','contEndFlag')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.contractDtl.list, params, this.contractDtlTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          contractDtlList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'org_name','contractNo','contractName','type','voucherTime','signDate','signPlace','validDateFrom','validDateTo','tcsProfileInfId','tcsProfileInfCode','tcsProfileInfName','tbdCompanyId','purchaseOrgn','status','remark'))
     },

    },

  }
</script>

<style scoped>
</style>