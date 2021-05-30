<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-upload style="float: left;"
          name="file"
          :headers="headers"
          :multiple="true"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          :data="{'biz':bizPath,'pid':breadCrumbs[breadCrumbs.length - 1].pid}"
          :action="url.upload"
          @change="handleUpload"
        >
          <a-button type="primary" size="large"> <a-icon type="upload" /> 上传文件 </a-button>
      </a-upload> 
      <a-upload style="float: left;"
          name="file"
          :headers="headers"
          :directory="true"
          :multiple="true"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          :data="{'pid':breadCrumbs[breadCrumbs.length - 1].pid}"
          :action="url.upload"
          @change="handleUpload"
        >
          <a-button type="primary" size="large"> <a-icon type="upload" /> 上传文件夹 </a-button>
      </a-upload> 
      <!-- <a-button type="primary" size="large" icon="upload" @click="handleUpload()">上传</a-button> -->
      <a-button type="primary" size="large" icon="download" @click="handleDownload()">下载</a-button>
      <!-- <a-button type="primary" size="large" icon="share-alt" @click="handleShare()">分享</a-button> -->
      <a-button type="primary" size="large" icon="delete" @click="handleDeleteBatch()">删除</a-button>
      <a-button type="primary" size="large" icon="folder-add" @click="handleCreateDirectory()">新建文件夹</a-button>
      <a-button type="primary" size="large" icon="switcher" @click="handleSwitchStyle()">切换风格</a-button>
      <a-button type="primary" size="large" icon="swap" @click="handleMove()">移动</a-button>
      <!-- 右侧搜索框 -->
      <a-input-search placeholder="请输入文件名搜索" style="width: 200px;float:right;" @search="handleSearch" />
      
    </div>
    
    <!-- 面包屑导航区域 -->
    <div  class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item href="#" v-for="(item,index) in breadCrumbs" @click.native="goBreadCrump(item.pid,index)"><!-- goBreadCrump(item.id,index) -->
            <a-icon v-if="item.icon != null" :type="item.icon" />
            <span>{{item.name}}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
    </div>

    <!-- list区域-begin -->
    <div>
      <!-- 平铺风格 -->
      <a-list v-if="style == 'tile'" :grid="{ gutter: 20, column: 8 }" :data-source="listData">
        <a-list-item slot="renderItem" slot-scope="item, index" >
          <a-card :bordered="item.bordered" @dblclick="handleDblClick(item)" >
            <a-icon v-if="item.isDirectory == 1" type="folder" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'txt'" type="file-text" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'doc' || item.suffix == 'docx'" type="file-word" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'pdf'" type="file-pdf" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'xls' || item.suffix == 'xlsx'"  type="file-excel" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'pptx' || item.suffix == 'ppt'"  type="file-ppt" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'zip'" type="file-zip" class="icon-card"></a-icon>
            <a-icon v-else-if="item.suffix == 'jpg'" type="file-image" class="icon-card"></a-icon>
            <a-icon v-else type="file-unknown" class="icon-card"></a-icon>
            <div v-if="item.renamable">
              <a-input ref="nameInput" v-model="item.name" @keyup.enter.native="$event.target.blur" @blur="saveItem(item)"></a-input>
            </div>
            <div v-else>
              {{item.name}}
            </div>
          </a-card>
        </a-list-item>
      </a-list>
      
      <!-- Table列表风格 -->
      <a-table 
        v-else 
        :columns="tableColumns" 
        :data-source="listData" 
        :scroll="{x: true}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onTableChange}" 
        rowKey="id" 
        :pagination="pagination"
        @change="handleTableChange">
          <template slot="nameSlot" slot-scope="text,record">
            <a-icon v-if="record.isDirectory == 1" type="folder" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'txt'" type="file-text" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'doc' || record.suffix == 'docx'" type="file-word" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'pdf'" type="file-pdf" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'xls' || record.suffix == 'xlsx'"  type="file-excel" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'pptx' || record.suffix == 'ppt'"  type="file-ppt" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'zip'" type="file-zip" class="icon-table"></a-icon>
            <a-icon v-else-if="record.suffix == 'jpg'" type="file-image" class="icon-table"></a-icon>
            <a-icon v-else type="file-unknown" class="icon-table"></a-icon>
            <a-input ref="nameInput" v-if="record.renamable" v-model="record.name" style="width: 200px;" @keyup.enter.native="$event.target.blur" @blur="saveItem(record)"></a-input>
            <a v-else @click="handleDblClick(record)">{{ text }}</a>
          </template>
          
          <template slot="action" slot-scope="text, record">
            <span>
              <a @click="handleRename(record)" :disabled="record.renamable">重命名</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item v-if="record.isDirectory != 1">
                    <a @click="handleSearchChangeLog(record)" :disabled="record.renamable">变更记录</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </template>
      </a-table>
      
      <!-- 文件操作记录抽屉 -->
       <a-drawer
        :title="changeLogDrawer.title"
        :width="720"
        placement="right"
        :closable="false"
        :visible="changeLogDrawer.visible"
        @close="onCloseDrawer"
      >
        <div v-for="(val,key) in changeLogDrawer.changeLogs">
          <a-table
            :columns="changeLogDrawer.tableColumns" 
            :data-source="val" 
            rowKey="id" 
            :pagination="changeLogDrawer.pagination">
            <template slot="title" slot-scope="currentPageData">
              <a @click="downloadHistory(val)">{{key}}</a>
            </template>
          </a-table>
        </div>
      </a-drawer>
      
      <file-move-drawer 
        :breadCrumbs="breadCrumbs" 
        :listData="listData" 
        ref="fileMoveDrawer" 
        @ok="reload">
      </file-move-drawer>
      
    </div>
    
  </a-card>
</template>

<script>
  
  import Vue from 'vue'
  import axios from 'axios'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getAction, postAction, deleteAction, getFileAccessHttpUrl } from '@/api/manage'
  import FileMoveDrawer from "./modules/FileMoveDrawer"

  export default {
    name: "FileInfoList",
    components:{
      FileMoveDrawer
    },
    data () {
      return {
        style:"list",//页面显示风格 tile平铺，list列表
        headers:{},
        listData:[],//页面数据
        pagination:false,//关闭分页
        selectedRows:[],//选中行
        selectedRowKeys:[],
        bizPath:'fms',//业务模块，区分FDFS存储路径
        changeLogDrawer:{
          changeLogs:{},
          title:"",
          visible:false,
          pagination:false,
          tableColumns:[
            {
              title: '文件MD5',
              dataIndex: 'md5',
            },
            {
              title: '创建日期',
              dataIndex: 'createTime',
            },
            {
              title: '操作',
              dataIndex: 'content'
            }
          ]
        },
        breadCrumbs:[{
          icon:"home",
          name:"我的文档",
          pid:"0"
        }],
        tableColumns:[
          {
            title: '文件名',
            dataIndex: 'name',
            scopedSlots: { customRender: 'nameSlot' },
          },
          {
            title: '创建日期',
            dataIndex: 'createTime',
            sorter: true,
          },
          {
            title: '文件大小',
            dataIndex: 'size',
          },
          {
            title: '创建人',
            dataIndex: 'createBy',
          },
          {
            title: '修改日期',
            dataIndex: 'updateTime',
            sorter: true,
          },
          {
            title: '修改人',
            dataIndex: 'updateBy',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list:"/fms/fileInfo/list",
          save:"/fms/fileInfo/save",
          upload:window._CONFIG['domianURL']+"/fms/fileInfo/uploadAndSave",
          delete: "/fms/fileInfo/delete",
          deleteBatch: "/fms/fileInfo/deleteBatch",
          download:"/fms/fileInfo/download",
          queryChangeLogs:"/fms/fileInfo/queryChangeLogs",
        }
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      //---------------------------- begin 图片左右换位置 -------------------------------------
      this.headers = {"X-Access-Token":token};
      //初始化页面数据(不分页)
      this.loadData({pid:"0"});
    },
    methods: {
      onTableChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      loadData(params){
        getAction(this.url.list,params).then(res=>{
          if(res.success){
            this.listData = [];//先清空原来数据
            for(let record of res.result){
              record.renamable = false;//重命名状态
              this.listData.push(record);
              this.$nextTick(() => {
                this.onClearSelected();
              })
            }
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      reload(){//刷新，默认加载当前面包屑路径的所有文件
        this.loadData({pid:this.breadCrumbs[this.breadCrumbs.length - 1].pid});
      },
      handleUpload(){//暂时用作上传完毕的钩子,待优化
        this.reload();
      },
      handleDownload(){//点击下载按钮
        if (this.selectedRows.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          let ids = "";
          for (let a = 0; a < this.selectedRows.length; a++) {
            ids += this.selectedRows[a].id + ",";
          }
          let fileName = 'download.zip';
          let url = window._CONFIG['domianURL'] + this.url.download + "?ids=" + ids;
          if (this.selectedRows.length == 1 && this.selectedRows[0].isDirectory != 1) {
            fileName = this.selectedRows[0].name;
            url += "&isZip=false";
          }
          axios({
                  method:'get',//请求方式
                  url:url,
                  headers:this.headers,
                  responseType:'blob'//服务器返回的数据类型
          }).then(response=>{
              const content = response.data //返回的内容
              const blob = new Blob([content]) //创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
              const url = window.URL.createObjectURL(blob)//URL.createObjectURL(object)表示生成一个File对象或Blob对象
              let dom = document.createElement('a')//设置一个隐藏的a标签，href为输出流，设置download
              dom.style.display = 'none'
              dom.href = url
              dom.setAttribute('download',fileName)//指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
              document.body.appendChild(dom)
              dom.click()
          })
        } 
      },
      handleDeleteBatch(){//点击删除按钮
        if (this.selectedRows.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRows.length; a++) {
            ids += this.selectedRows[a].id + ",";
          }
          var that = this;
          this.$confirm({
            title: "确认删除",
            content: "是否删除选中数据?",
            onOk: function () {
              deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.reload();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          }); 
        }
      },
      handleDelete(item) {
        var that = this;
        deleteAction(that.url.delete, {id: item.id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.reload();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectedRows = [];
      },
      handleCreateDirectory(){//新建文件夹
        this.checkOtherSaving();//校验其他需要保存的
        this.listData.push({
          id:'',
          pid:this.breadCrumbs[this.breadCrumbs.length - 1].pid,
          name:'新建文件夹',
          renamable:true,
          isDirectory:1,
        });
        this.$nextTick(() => {
          this.$refs.nameInput.focus();
          this.$refs.nameInput.select();
        });
        
      },
      handleDblClick(item){//双击文件夹事件
        if(item.isDirectory == 1){
          this.loadData({pid:item.id});
          this.breadCrumbs.push({
            name:item.name,
            pid:item.id
          })
        }else{
          this.handlePreview(item);
        }
      },
      handleTableChange(pagination, filters, sorter){
        if(sorter.field){
          this.loadData({pid:this.breadCrumbs[this.breadCrumbs.length - 1].pid,sortedField:sorter.field,sortedOrder:sorter.order});
        }
      },
      checkOtherSaving(){
        for(let item of this.listData){
          if(item.renamable){//如果有未保存的直接保存
            this.saveItem(item)
          }
        }
      },
      saveItem(item){//保存文件重命名信息（或者新建文件夹）
        item.fileInfoId = item.id;
        postAction(this.url.save,item).then(res=>{
          if(res.success){
            item.renamable=false;
            this.$nextTick(() => {
              this.reload()
            })
          }else{
            this.$message.error(res.message)
          }
        })
      },
      goBreadCrump(id,index){
        if(index != 0 && index == this.breadCrumbs.length - 1){//如果不是首页，是当前页面，则不跳转
          return;
        }
        this.loadData({pid:id});
        this.breadCrumbs = this.breadCrumbs.slice(0,index+1);
      },
      handleSwitchStyle(){
        if(this.style == "tile"){
          this.style = "list";
        }else{
          this.style = "tile";
        }
      },
      //文件名搜索
      handleSearch(value){
        let valueLike = "*" + value + "*";
        this.loadData({name:valueLike});
      },
      //重命名
      handleRename(item){
        if(item.renamable){
          return;
        }
        item.renamable = true;
        this.$nextTick(() => {
          this.$refs.nameInput.focus();
          this.$refs.nameInput.select();
        });
      },
      //预览文件
      handlePreview(record) {
        if (record && record.url) {
          let url = window._CONFIG['onlinePreviewFdfsURL'] + '?url=' + window._CONFIG['fdfsBaseURL'] + record.url;
          window.open(url, '_blank')
        }
      },
      //文件上传钩子，校验文件大小
      beforeUpload(file) {
        if(file.size > 20971520){
          this.$message.warning("文件大于20M！");
          return false;
        }
        return true;
      },
      //查询文件变更记录
      handleSearchChangeLog(record){
        getAction(this.url.queryChangeLogs, {fileInfoId: record.id}).then((res) => {
          if (res.success) {
            this.changeLogDrawer.title = record.name;
            this.changeLogDrawer.changeLogs = res.result;
            this.changeLogDrawer.visible = true;
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      onCloseDrawer(){
        this.changeLogDrawer.visible = false;
      },
      //下载历史文件
      downloadHistory(val){
        let url = getFileAccessHttpUrl(val[0].url);
        window.open(url);
      },
      //移动
      handleMove(){
        if (this.selectedRows.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRows.length; a++) {
            ids += this.selectedRows[a].id + ",";
          }
          this.$refs.fileMoveDrawer.moveIds = ids;
          this.$refs.fileMoveDrawer.init(this.breadCrumbs[this.breadCrumbs.length - 1].pid);
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  
  .icon-table{
    font-size: 24px;
  }
  
  .icon-card{
    font-size: 120px;
  }
  
</style>