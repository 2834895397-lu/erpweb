<template>
  <j-modal
    :title="title"
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
          <!--<a-col :span="24">
            <a-form-item label="客商标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['csFlag', validatorRules.csFlag]" :trigger-change="true" dictCode="cs_flag" placeholder="请选择客商标识"/>
            </a-form-item>
          </a-col>-->
          <!--<a-col :span="24">
            <a-form-item label="经营大类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              &lt;!&ndash;<j-tree-select
                placeholder="请选择经营大类"
                v-decorator="['busiProduct']"
                dict="tbd_material,name,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child">
              </j-tree-select>&ndash;&gt;


              <j-dict-select-tag type="list" v-decorator="['busiProduct', validatorRules.busiProduct]"
                                 :trigger-change="true"

                                 @change="getBusiVariety" dictCode="tbd_material where pid = 0 ,name,id"
                                 placeholder="请选择经营大类"/>
            </a-form-item>
          </a-col>-->
          <a-col :span="24">
            <!--<a-form-item label="经营品种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['busiVariety', validatorRules.busiVariety]" :dictOptions="dictOption" placeholder="请选择经营品种"></j-search-select-tag>
            </a-form-item>-->
            <a-form-item label="经营品种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select
                placeholder="请选择经营品种"
                v-decorator="['busiVariety']"
                dict="tbd_material,name,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child">
              </j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="经营省市" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-tree-select
                placeholder="请选择经营省市"
                v-decorator="['busiPlace']"
                dict="place,province_or_city,id"
                pid-field="pid"
                pid-value="0"
                has-child-field="has_child">
              </j-tree-select>
              <!-- <a-input v-decorator="['busiPlace']" placeholder="请输入经营省市"></a-input>-->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {validateDuplicateValue} from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from "@/components/jeecg/JTreeSelect"
  import JSearchSelectTag from "@/components/dict/JSearchSelectTag"

  export default {
    name: "ProfileProductModal",
    components: {
      JSearchSelectTag,
      JTreeSelect,
      JDictSelectTag,
    },
    props: {
      mainId: {
        type: String,
        required: false,
        default: ''
      }
    },
    data() {
      return {
        form: this.$form.createForm(this),
        title: "操作",
        width: 800,
        visible: false,
        model: {},
        dictOption:[],
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        validatorRules: {
          csFlag: {
            rules: [
              {required: true, message: '请输入客商标识!'},
            ]
          },
          busiProduct: {
            rules: [
              {required: true, message: '请输入经营大类!'},
            ]
          },
          busiVariety: {
            rules: [
              {required: true, message: '请输入经营品种!'},
            ]
          },
        },
        url: {
          add: "/bcs/profileInf/addProfileProduct",
          edit: "/bcs/profileInf/editProfileProduct",
          /*queryBusiVariety: "/bcs/profileInf/queryBusiVariety"*/
        }

      }
    },
    created() {
    },
    methods: {
      /*getBusiVariety(e) {
        getAction(this.url.queryBusiVariety, {id: e}).then((res) => {
          if (res.code === 200){
            console.log("res",res.result)
            this.dictOption = res.result
          } else {
            this.$message.warning(res.message);
        }
        })
      },*/
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'createBy', 'createTime', 'updateBy', 'updateTime', 'sysOrgCode', 'delFlag', 'ver', 'csId', 'csFlag', 'busiProduct', 'busiVariety', 'busiPlace', 'tenantId'))
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
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
            formData['csId'] = this.mainId
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
      handleCancel() {
        this.close()
      },
      popupCallback(row) {
        this.form.setFieldsValue(pick(row, 'createBy', 'createTime', 'updateBy', 'updateTime', 'sysOrgCode', 'delFlag', 'ver', 'csId', 'csFlag', 'busiProduct', 'busiVariety', 'busiPlace', 'tenantId'))
      },


    }
  }
</script>
