<template>
  
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">
    
    <a-breadcrumb>
      <a-breadcrumb-item href="#" v-for="(item,index) in breadCrumbs" @click.native="goBreadCrump(item.pid,index)"><!-- goBreadCrump(item.id,index) -->
        <a-icon v-if="item.icon != null" :type="item.icon" />
        <span>{{item.name}}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
    
    <a-table
      :columns="tableColumns" 
      :data-source="listData" 
      rowKey="id" 
      :pagination="false">
        <template slot="nameSlot" slot-scope="text,record">
          <a-icon type="folder" class="icon-modal-table"></a-icon>
          <a @click="handleIn(record)">{{ text }}</a>
        </template>
        
    </a-table>
    
    <div class="drawer-footer">
      <a-button @click="handleCancel"  class="drawer-footer-btn">关闭</a-button>
      <a-button type="primary" @click="handleOk"  class="drawer-footer-btn">确认</a-button>
    </div>
  </a-drawer>
  
</template>

<script>

  import { getAction, postAction } from '@/api/manage'
  
  export default {
    name: "FileMoveDrawer",
    data () {
      return {
        title:"移动",
        width:400,
        visible: false,
        originPid:"",
        moveIds:"",
        breadCrumbs:[],
        listData:[],
        tableColumns:[
          {
            title: '目录名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'nameSlot' },
          }
        ],
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
              if(record.isDirectory == 1){
                this.listData.push(record);
              }
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
  .icon-modal-table{
    font-size: 20px;
  }
  
  .drawer-footer-btn {
    margin-left: 30px;
    margin-bottom: 0px;
    float: right;
  }
  .drawer-footer{
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
  
</style>