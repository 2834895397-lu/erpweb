<template>
  <j-modal
    :title="title"
    :width="width"
    :height="height"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="关闭">
        
        <a-breadcrumb>
          <a-breadcrumb-item href="#" v-for="(item,index) in breadCrumbs" @click.native="goBreadCrump(item.pid,index)"><!-- goBreadCrump(item.id,index) -->
            <a-icon v-if="item.icon != null" :type="item.icon" />
            <span>{{item.name}}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div style="min-height: 300px;margin-top: 20px;">
          <a-list :grid="{ gutter: 20, column: 4 }" :data-source="listData">
            <a-list-item slot="renderItem" slot-scope="item, index" v-if="item.isDirectory == 1">
              <a-card  @dblclick="handleIn(item)" >
                <a-icon type="folder" class="icon-modal-card"></a-icon>
                <div>
                  {{item.name}}
                </div>
              </a-card>
            </a-list-item>
          </a-list>
        </div>
        
  </j-modal>
</template>

<script>

  import { getAction, postAction } from '@/api/manage'
  
  export default {
    name: "FileMoveModal",
    data () {
      return {
        title:"移动",
        width:800,
        height:600,
        visible: false,
        originPid:"",
        moveIds:"",
        breadCrumbs:[],
        listData:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        url: {
          list: "/fms/fileInfo/list",
          move: "/fms/fileInfo/move",
        },
     
      }
    },
    methods: {
      //初始化
      init(originPid){
        this.breadCrumbs = [{
          icon:"home",
          name:"我的文档",
          pid:"0"
        }];
        this.originPid = originPid;
        this.loadData({pid:"0"});
        this.$nextTick(() => {
          this.visible = true;
        })
      },
      loadData(params){
        getAction(this.url.list,params).then(res=>{
          if(res.success){
            this.listData = [];//先清空原来数据
            for(let record of res.result){
              this.listData.push(record);
            }
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        let newPid = this.breadCrumbs[this.breadCrumbs.length - 1].pid;
        if(newPid == this.originPid){
          this.$message.info("移动的路径和原路径一致！");
          return;
        }
        let params = {ids:this.moveIds,pid:newPid};
        postAction(this.url.move,params).then(res=>{
          if(res.success){
            this.$message.info("移动完成")
            this.$emit('ok');
            this.close();
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      handleCancel () {
        this.close()
      },
      goBreadCrump(id,index){
        if(index != 0 && index == this.breadCrumbs.length - 1){//如果不是首页，是当前页面，则不跳转
          return;
        }
        this.loadData({pid:id});
        this.breadCrumbs = this.breadCrumbs.slice(0,index+1);
      },
      handleIn(item){
        let ids = this.moveIds.split(",");
        let flag = false;
        ids.forEach((id,index)=>{
          if(id == item.id){
            flag = true;
          }
        })
        if(flag){
          this.$message.error("不能移动到自己！");
        }else{
          this.loadData({pid:item.id});
          this.breadCrumbs.push({
            name:item.name,
            pid:item.id
          })
        }
      }
      
    }
  }
</script>

<style>
  .icon-modal-card{
    font-size: 40px;
  }
  
</style>