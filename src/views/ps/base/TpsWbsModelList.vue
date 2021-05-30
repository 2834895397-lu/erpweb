<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <a-layout>
      <a-layout-sider width="450" style="background: #fff">
        <a-card title="WBS模板分类" style="padding-right:15px;border-radius: 5px">
          <div style="margin-bottom: 15px" v-if="tag !== ''">
            <a-tag color="#2db7f5" style="font-size:13px">wbs模板名称：{{tag}}</a-tag>
          </div>
          <div class="buttonGroup">
            <a-button icon="plus" type="primary" @click="addWBSNode" v-has="'ps:wbsmodel:add'" :disabled="bu[0]">新增</a-button>
            <a-button icon="edit" type="primary" @click="editWBSNode" v-has="'ps:wbsmodel:edit'" :disabled="bu[1]">修改</a-button>
            <a-button icon="minus" @click="removeWBSNode" v-has="'ps:wbsmodel:delete'" :disabled="bu[2]">删除</a-button>
          </div>
          <a-tree
            ref="tree"
            v-model="treeKeys"
            :selectedKeys="treeKeys"
            showLine
            :replaceFields="fields"
            :auto-expand-parent="autoExpandParent"
            :tree-data="treeData"
            @select="onSelect"/>
        </a-card>
      </a-layout-sider>

      <a-layout style="padding: 0 8px 8px;background-color: #fff">
        <a-layout-content :style="{ background: '#fff', margin: 0 }">
          <a-card title="WBS模板名称" style="padding-right:15px;border-radius: 5px">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4}">
            <a-form-model-item label="上级WBS元素：" ref="parentId">
              <a-tree-select
                :disabled="(edit||tree)"
                @change="clear"
                showSearch
                allowClear
                v-decorator="['parentId']"
                treeNodeFilterProp='title'
                :replaceFields="fields"
                v-model="form.parentId"
                style="width: 360px"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择上级WBS元素"
                tree-default-expand-all>
              </a-tree-select>
            </a-form-model-item>
            <a-form-model-item label="WBS模板名称：" prop="id"  ref="id" hidden>
              <a-input style="width: 360px" :disabled="edit" v-model="form.id" v-decorator="['id']">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="WBS模板名称：" prop="wbsModelName"  ref="wbsModelName">
              <a-input style="width: 360px" :disabled="(edit||fi[0])" v-decorator="['wbsModelName']" v-model="form.wbsModelName" placeholder="请输入WBS模板名称">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="WBS元素名称："  prop="wbsDesc" ref="wbsDesc">
              <a-input style="width: 360px" :disabled="(edit||fi[1])" v-decorator="['wbsDesc']" v-model="form.wbsDesc" placeholder="请输入WBS元素名称">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="WBS所属类型：" prop="wbsTypeCode"  ref="wbsTypeCode">
              <a-row type="flex">
                <a-col :span="16" :order="3">
                  <a-select :disabled="(disabled||edit)" v-model="form.wbsTypeCode" allowClear v-decorator="['wbsTypeCode']" :options="wbsTypes" style="width: 360px" placeholder="请选择WBS所属类型">
                    <a-select-option v-for="type in wbsTypes" :key="type.key" :title="type.title" :value="type.value">
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="3" :order="4">
                  <a-checkbox @change="onChange" :disabled="edit" v-model="checkbox">不选择</a-checkbox>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-form-model>
            <div class="buttonGroup">
              <a-button type="primary" size="large" @click="submit" :disabled="edit" v-has="'ps:wbsmodel:add'||'ps:wbsmodel:add'"> 确定 </a-button>
              <a-button size="large" :disabled="edit" @click="cancel">取消</a-button>
            </div>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { notification } from 'ant-design-vue'
  import { axios } from '@/utils/request'
  import { httpAction, getAction } from '@/api/manage'

  export default {
    name: 'TpsWbsModelList',
    mixins:[mixinDevice],
    components: {
    },
    data () {
      return {
        fi: [false, false],
        bu: [false, false, false],
        edit: true,
        tree: true,
        tag: '',
        list: [],
        description: '工作分解模板管理页面',
        dictOptions:{},
        checkbox: false,
        treeData: [],
        fields: {children:'children', title:'name', key:'id', value: 'id'},
        autoExpandParent: true,
        wbsTypes: [],
        treeKeys: [],
        disabled: false,
        form: {
          id: '',
          parentId: '',
          wbsTypeCode: '',
          wbsModelName: '',
          wbsDesc: ''
        },
        rules: {
        }
      }
    },
    watch: {
    },
    created() {
      this.wbsModelTree()
      this.options()
    },
    computed: {
    },
    methods: {
      initDictConfig(){
      },
      wbsModelTree () {
        axios({
          url: '/ps/tpsWbsModel/wbsModelTree',
          method: 'get',
          params: {'tenantid': this.tenantid }
        }).then((res) => {
          if (res.code === 200) {
            this.treeData = res.result
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      clear (){
        this.$refs.ruleForm.resetFields()
        this.treeKeys = []
        this.tag = ''
        this.form.parentId = ''
      },
      addWBSNode () {
        this.edit = false
        this.form.id = ''
        this.form.wbsTypeCode = ''
        this.form.wbsDesc = ''
        this.form.parentId = this.treeKeys
        this.fi = [true, false]
        if(this.form.parentId.length === 0){
          this.fi = [false, false]
        }
        this.bu = [false, true, true]
      },
      editWBSNode (){
        if(this.form.id === ''){
          this.$message.warning('请选择记录进行修改');
          return
        }
        this.fi = [true, false]
        if(this.form.parentId.length === 0){
          this.fi = [false, false]
        }
        this.bu = [true, false, true]
        this.edit = false
      },
      removeWBSNode () {
        axios({
          url: '/ps/tpsWbsModel/deleteBatch',
          method: 'DELETE',
          data: { ids: this.treeKeys }
        }).then((res) => {
          if (res.code === 200) {
            this.wbsModelTree()
            notification.success({ message: '系统提示', description: res.message, duration: 4 })
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      submit () {
        const that = this;
        this.$refs.ruleForm.validate((err, values) => {
          if (err) {
            var httpurl = (this.form.id === '')? '/ps/tpsWbsModel/add' : '/ps/tpsWbsModel/edit'
            var method = (this.form.id === '')? 'POST' : 'PUT'
            that.form.parentId = Array.isArray(that.form.parentId) ? that.form.parentId[0] : that.form.parentId
            let formData = Object.assign(that.form, values)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message)
              }else{
                that.$message.warning(res.message)
              }
            }).finally(() => {
              this.cancel()
              this.wbsModelTree()
              that.confirmLoading = false
            })
          } else {
            notification.error({ message: '系统提示', description: "请输入必填字段信息", duration: 4 });
            return false;
          }
        });
      },
      cancel () {
        this.$refs.ruleForm.resetFields();
        this.edit = true
        this.treeKeys = []
        this.tag = ''
        this.form.parentId = ''
        this.bu = [false, false, false]
      },
      onSelect(selectedKeys, info) {
        this.cancel()
        if(info != null && info.selectedNodes.length > 0){
          var props = info.selectedNodes[0].data.props
          this.treeKeys = selectedKeys
          if (props.parentId === '0') {
            this.form.parentId = ''
            this.form.wbsDesc = props.wbsDesc
          }else {
            this.form.parentId = props.parentId
          }
          this.form.wbsModelName = props.wbsModelName
          this.treeKeys = selectedKeys
          this.form.id = props.id
          this.tag = props.wbsModelName
          this.form.wbsTypeCode = props.wbsTypeCode
          this.form.wbsDesc = props.wbsDesc
        }
      },
      onChange(){
        this.disabled = !this.disabled
        this.form.wbsTypeCode = ''
      },
      options () {
        axios({
          url: '/ps/tpsWbsModel/option',
          method: 'get',
          params: { 'tenantid': this.tenantid }
        }).then((res) => {
          if (res.code === 200) {
            this.wbsTypes = res.result.select
          } else {
            notification.error({ message: '系统提示', description: res.message, duration: 4 })
          }
        })
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.wbsModelTree();
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .buttonGroup{
    text-align: center;
    margin-bottom: 15px;
  }
  .buttonGroup > button {
    margin: 0 15px;
  }
</style>