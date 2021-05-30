<template>
  <j-modal :title="title"
           :width="1200"
           :visible="visible"
           :maskClosable="false"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @ok="handleOk"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="招投标号"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingNo']"
                       placeholder="请输入招投标号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="分类"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 v-decorator="['biddingType', validatorRules.biddingType]"
                                 :trigger-change="true"
                                 dictCode="bm_bidding_type"
                                 placeholder="请选择分类" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="采购标题"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingTitle', validatorRules.biddingTitle]"
                       placeholder="请输入采购标题"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="采购类型"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 v-decorator="['biddingCategory',validatorRules.biddingCategory]"
                                 :trigger-change="true"
                                 dictCode="bm_bidding_category"
                                 placeholder="请选择采购类型" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="采购方式"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 v-decorator="['biddingWay',{initialValue:1}]"
                                 :trigger-change="true"
                                 dictCode="bm_purchase_type"
                                 placeholder="请选择采购方式" />
            </a-form-item>
          </a-col>
          <!--  v-show="false"-->
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="申请单位"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingDepaterment']"
                       placeholder="请输入申请单位"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="申请人"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingMan']"
                       placeholder="请输入申请人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="开标时间"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date placeholder="请选择开标时间"
                      v-decorator="['openBiddingDate']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="截标时间"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date placeholder="请选择截标时间"
                      v-decorator="['endBiddingDate']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="申请时间"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-date placeholder="请选择申请时间"
                      v-decorator="['biddingDate']"
                      :trigger-change="true"
                      style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24"
                 :sm="12"
                 v-show="false">
            <a-form-item label="状态"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list"
                                 v-decorator="['biddingFlag',{initialValue:1}]"
                                 :trigger-change="true"
                                 dictCode="bm_bidding_status"
                                 placeholder="请输入招标状态" />
            </a-form-item>
          </a-col>
          <!-- v-show="false"-->
          <a-col :xs="24"
                 :sm="12">
            <a-form-item label="第三方公司"
                         :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <a-input v-decorator="['biddingCompany']"
                       placeholder="请输入第三方公司"></a-input>
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

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey"
              @change="handleChangeTabs">
        <a-tab-pane tab="招标明细信息表"
                    :key="refKeys[0]"
                    :forceRender="true">
          <j-editable-table :ref="refKeys[0]"
                            :loading="biddingDtlTable.loading"
                            :columns="biddingDtlTable.columns"
                            :dataSource="biddingDtlTable.dataSource"
                            :maxHeight="300"
                            :rowNumber="true"
                            :rowSelection="true"
                            :actionButton="true" />
        </a-tab-pane>

        <a-tab-pane tab="招标企业信息表"
                    :key="refKeys[1]"
                    :forceRender="true">
          <j-editable-table :ref="refKeys[1]"
                            :loading="biddingEnterpriseTable.loading"
                            :columns="biddingEnterpriseTable.columns"
                            :dataSource="biddingEnterpriseTable.dataSource"
                            :maxHeight="300"
                            :rowNumber="true"
                            :rowSelection="true"
                            :actionButton="true" />
        </a-tab-pane>

        <a-tab-pane tab="相关附件"
                    :key="refKeys[2]"
                    :forceRender="true">
          <a-spin :spinning="confirmLoading">
            <j-form-container :disabled="false">
              <a-form :form="form"
                      slot="detail">
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="选择文件"
                                 :labelCol="labelCol"
                                 :wrapperCol="wrapperCol">
                      <j-upload v-decorator="['url']"
                                :trigger-change="true"></j-upload>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </j-form-container>
          </a-spin>
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

import { getAction } from "@/api/manage";
import JFormContainer from '@/components/jeecg/JFormContainer'
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'BiddingInfModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JDictSelectTag,
    JFormContainer,
    JUpload,
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
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        biddingTitle: {
          rules: [
            { required: true, message: '请输入采购标题!' },
          ]
        },
        biddingCategory: {
          rules: [
            { required: true, message: '请输入采购类型!' },
          ]
        },
        biddingFlag: {
          rules: [
            { required: true, message: '请输入状态!' },
          ]
        },
        biddingType: {
          rules: [
            { required: true, message: '请输入分类!' },
          ]
        },
      },
      refKeys: ['biddingDtl', 'biddingEnterprise',],
      tableKeys: ['biddingDtl', 'biddingEnterprise',],
      activeKey: 'biddingDtl',
      // 招标明细信息表
      biddingDtlTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '物料编号',
            key: 'materielNo',
            type: FormTypes.popup,
            popupCode: "tbd_material",
            destFields: "materielNo,materielName,measureUnit",
            orgFields: "code,name,tbd_unit_id",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '物料名称',
            key: 'materielName',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '计量单位',
            key: 'measureUnit',
            type: FormTypes.select,
            dictCode: "tbd_unit,name,id",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '数量',
            key: 'measureNum',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '备注',
            key: 'remark',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },

          {
            title: 'materiel_no',
            key: 'materiel_no',
            type: "hidden"
          },

          {
            title: 'materiel_name',
            key: 'materiel_name',
            type: "hidden"
          },

          {
            title: 'measure_unit',
            key: 'measure_unit',
            type: "hidden"
          },
        ]
      },
      // 招标企业信息表
      biddingEnterpriseTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '企业编码',
            key: 'enterpriceNo',
            type: FormTypes.popup,
            popupCode: "tcs_profile_inf",
            destFields: "enterpriceNo,enterpriseName",
            orgFields: "cs_code,cs_name",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            // 校验公司编码在同一个主表内不能重复出现
            validateRules: [//此处进行验证
              {
                required: false,//在前端设置此字段必填
                // message: '${title}不能为空',//在前端设置此字段不能为null，提示文本
                // 自定义函数校验 handler,表单验证
                handler (type, value, row, column, callback, target) {
                  //验证name不能重复
                  let { values } = target.getValuesSync({ validate: false })
                  let count = 0
                  for (let val of values) {
                    if (val['enterpriceNo'] === value && val['enterpriceNo'] != undefined) {
                      if (++count >= 2) {
                        callback(false, '${title}不能重复')
                        return
                      }
                    }
                    console.log(val['enterpriceNo'], 'val[\'enterpriceNo\']')
                  }
                  callback(true) // true = 通过验证
                }
              }
            ],
          },
          {
            title: '企业名称',
            key: 'enterpriseName',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '中标状态',
            key: 'biddingStatus',
            type: FormTypes.select,
            dictCode: "bm_bidding_flag",
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '0',
            disabled: true,
          },
          {
            title: '中标日期',
            key: 'biddingDate',
            type: FormTypes.date,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            /*disabled: true,*/
          },
          {
            title: '备注',
            key: 'remark',
            type: FormTypes.input,
            width: "200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },

          {
            title: 'enterprice_no',
            key: 'enterprice_no',
            type: "hidden"
          },

          {
            title: 'enterprise_name',
            key: 'enterprise_name',
            type: "hidden"
          },
        ]
      },
      url: {
        add: "/bm/biddingInf/add",
        edit: "/bm/biddingInf/edit",
        biddingDtl: {
          list: '/bm/biddingInf/queryBiddingDtlByMainId'
        },
        biddingEnterprise: {
          list: '/bm/biddingInf/queryBiddingEnterpriseByMainId'
        },
        getUrl: "/bd/attachedUrl/getAttachedUrlByRelationId",
      }
    }
  },
  methods: {
    //通过企业表中标状态判断主表状态
    /*handleChange({target }){
      target.getValues((error,values)=>{
        console.log(values)
        let i
        for ( i = 0; i < values.length; i++) {
          if (values[i].biddingStatus == 1) {
            this.$refs.biddingFlagRef.handleInput(2)
              return
          } else
            this.$refs.biddingFlagRef.handleInput()
          }

      })
    },*/

    getAllTable () {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter () {
      let fieldval = pick(this.model, 'biddingNo', 'biddingType', 'biddingTitle', 'biddingCategory', 'biddingWay', 'biddingDepaterment', 'biddingMan', 'openBiddingDate', 'endBiddingDate', 'biddingDate', 'biddingFlag', 'biddingCompany', 'remark')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.biddingDtl.list, params, this.biddingDtlTable)
        this.requestSubTableData(this.url.biddingEnterprise.list, params, this.biddingEnterpriseTable)

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
      }
    },
    /** 整理成formData */
    classifyIntoFormData (allValues) {
      let main = Object.assign(this.model, allValues.formValue)

      return {
        ...main, // 展开
        biddingDtlList: allValues.tablesValue[0].values,
        biddingEnterpriseList: allValues.tablesValue[1].values,
      }
    },
    validateError (msg) {
      this.$message.error(msg)
    },
    popupCallback (row) {
      this.form.setFieldsValue(pick(row, 'biddingNo', 'biddingType', 'biddingTitle', 'biddingCategory', 'biddingWay', 'biddingDepaterment', 'biddingMan', 'openBiddingDate', 'endBiddingDate', 'biddingDate', 'biddingFlag', 'biddingCompany', 'remark'))
    },

  }
}
</script>

<style scoped>
</style>