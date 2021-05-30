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
            <a-form-item label="采购申请类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['type', validatorRules.type]" :trigger-change="true" dictCode="tmm_plan_type" placeholder="请选择采购申请类型"/>
            </a-form-item>
            <!--引用封装的组件-->
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
            <a-form-item label="采购申请来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-decorator="['applyFrom']" dictCode="tmm_apply_from_type" :trigger-change="true" placeholder="请输入采购申请来源"/>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="采购申请来源号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['applyFromNo']" placeholder="请输入采购申请来源号"></a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :xs="24" :sm="12">-->
<!--            <a-form-item label="采购申请单据号" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['planNumber']" placeholder="请输入采购申请单据号"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
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
        <a-tab-pane tab="采购申请明细表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="planDtlTable.loading"
            :columns="planDtlTable.columns"
            :dataSource="planDtlTable.dataSource"
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

  export default {
    name: 'PlanModal',
    mixins: [JEditableTableMixin],
    // ERP子表定点刷新
    inject:{
      realTimeList:{
        type: Function
      },
    },
    components: {
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
              { required: true, message: '请输入申请类型!'},
            ]
          },
          purchaseOrgn:{
            rules:[
              { required: true, message: '请输入采购组织!'},
            ]
          }
        },
        refKeys: ['planDtl', ],
        tableKeys:['planDtl', ],
        activeKey: 'planDtl',
        // 采购申请明细表
        planDtlTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '物料名称',
              key: 'tbdMaterialId',
              type: FormTypes.sel_search,
              dictCode:"tbd_material,name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
              validateRules: [//此处进行验证
                {
                  required: false,//在前端设置此字段必填
                  // message: '${title}不能为空',//在前端设置此字段不能为null，提示文本
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
                      // console.log(val['tbdMaterialId'],'val[\'tbdMaterialId\']')
                      // console.log(val['shortText'],'val[\'shortText\']')
                      if(val['tbdMaterialId'] != val['shortText']){
                        val['tbdMaterialId'] = undefined
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
              placeholder: '请输入${title}',
              defaultValue: '',
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
            // {
            //   title: '采购申请来源',
            //   key: 'applyFrom',
            //   type: FormTypes.select,
            //   dictCode:"tmm_apply_from_type",
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue: '',
            // },
            // {
            //   title: '采购申请来源号',
            //   key: 'applyFromNo',
            //   type: FormTypes.input,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue: '',
            // },
            {
              title: '备注',
              key: 'remark',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/mm/plan/add",
          edit: "/mm/plan/edit",
          planDtl: {
            list: '/mm/plan/queryPlanDtlByMainId'
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
        let fieldval = pick(this.model,'type','purchaseOrgn','voucherTime','status','remark','planNumber','applyFrom','applyFromNo')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.planDtl.list, params, this.planDtlTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          planDtlList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'type','purchaseOrgn','voucherTime','status','remark'))
     },

    }
  }
</script>

<style scoped>
</style>