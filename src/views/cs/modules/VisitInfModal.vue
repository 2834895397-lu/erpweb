<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <visit-inf-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></visit-inf-form>
  </j-modal>
</template>

<script>

  import VisitInfForm from './VisitInfForm'
  export default {
    inject: ['reload'],
    name: 'VisitInfModal',
    components: {
      VisitInfForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
        this.loadData();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
        this.reload();
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>