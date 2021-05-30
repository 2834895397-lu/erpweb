<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-form-model :model="form" ref="ruleForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="作业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['jobDesc']" v-model="form.jobDesc" placeholder="请输作业名称"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
    </a-form-model>
  </j-modal>

</template>

<script>
  import { notification } from 'ant-design-vue'
  import { httpAction, getAction } from '@/api/manage'

  export default {
    name: 'PsJobPlanMain',
    components: {

    },
    data () {
      return {
        title: '作业名称',
        width: 800,
        visible: false,
        headStyle: {height: '70px'},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: {
          id: '',
          projectWbsId: '',
          jobDesc: ''
        }
      }
    },
    watch: {
    },
    computed: {
    },
    activated() {
    },
    created() {
    },
    methods: {
      init (val, sw) {
        console.log(val)
        if(sw){
          this.form.projectWbsId = val.id
          this.form.jobDesc = val.name
        }else {
          this.form.id = val.id
          this.form.projectWbsId = val.parentId
          this.form.jobDesc = val.name
        }
        this.visible = true
      },
      handleOk () {
        this.visible = false
        const that = this;
        this.$refs.ruleForm.validate((err, values) => {
          if (err) {
            var httpurl = (this.form.id === '')? '/ps/tpsProjectJob/add' : '/ps/tpsProjectJob/edit'
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
              this.handleCancel()
              that.confirmLoading = false
            })
          } else {
            notification.error({ message: '系统提示', description: "请输入必填字段信息", duration: 4 });
            return false;
          }
        });
      },
      handleCancel () {
        this.visible = false
        this.$emit('ok');
      }
    }
  }
</script>

<style scoped>

</style>