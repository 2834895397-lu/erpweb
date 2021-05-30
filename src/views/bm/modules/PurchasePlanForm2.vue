<template>
  <j-modal :title="title"
           :width="width"
           :visible="visible"
           switchFullscreen
           :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
           @ok="PreHandleOk"
           @cancel="handleCancel"
           cancelText="关闭">

    <div>
      <!-- :data-source="mockData" -->
      <a-transfer :data-source="mockData"
                  :target-keys="targetKeys"
                  :disabled="disabled"
                  :show-search="showSearch"
                  :render="item => item.planNo"
                  :show-select-all="true"
                  @change="onChange">
        <template slot="children"
                  slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }">
          <a-table :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          "
                   :columns="direction === 'left' ? leftColumns : rightColumns"
                   :data-source="filteredItems"
                   size="small"
                   :style="{ pointerEvents: listDisabled ? 'none' : null }"
                   :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })
          " />
        </template>
      </a-transfer>

    </div>
  </j-modal>
</template>

<script>
import difference from 'lodash/difference';
import JDate from "@comp/jeecg/JDate";
import { getAction, postAction } from '@api/manage'

const mockData = []; //未选中记录
const originTargetKeys = [];//选中记录
/**左边选择框 */
const leftTableColumns = [
  {
    dataIndex: 'planNo',
    title: '采购申请号',
  },
  {
    dataIndex: 'planDate',
    title: '凭证日期',
  },
  {
    dataIndex: 'materielNo',
    title: '物料编号',
  },
  {
    dataIndex: 'materielName',
    title: '物料名称',
  },
  {
    dataIndex: 'measureUnitName',
    title: '计量单位',
  },
  {
    dataIndex: 'measureNum',
    title: '数量',
  },
];
/**右边选择框 */
const rightTableColumns = [
  {
    dataIndex: 'planNo',
    title: '采购申请号',
  },
  {
    dataIndex: 'planDate',
    title: '凭证日期',
  },
  {
    dataIndex: 'materielNo',
    title: '物料编号',
  },
  {
    dataIndex: 'materielName',
    title: '物料名称',
  },
  {
    dataIndex: 'measureUnitName',
    title: '计量单位',
  },
  {
    dataIndex: 'measureNum',
    title: '数量',
  },
];

export default {
  name: 'PurchasePlanForm2',
  components: { JDate },
  // ERP子表实时刷新
  inject: {
    realTimeList: {
      type: Function
    },
  },
  props: {
    pId: {
      type: Array,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      title: '参考采购申请',
      width: 1100,
      height: 900,
      disableSubmit: false,
      loading: false,
      queryParam: {},
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      url: {
        getPurchaseDetail: '/bm/biddingInf/purchaseDetail',
        addMaterialDtl: '/bm/biddingInf/addMaterialDtl',
        listPlanNo: '/bm/biddingInf/listPlanNo'
      },
      purchaseData: [],//采购明细记录
      biddingDtlList: [],


      mockData,
      targetKeys: originTargetKeys,
      disabled: false,
      showSearch: true,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
    };
  },
  methods: {
    /** 确定按钮点击事件 */
    PreHandleOk () {
      this.handleOk();
      this.realTimeList();
    },
    //采购申请明细查询
    loadData () {
      if (this.pId.length != 1) {
        this.$message.warning('请勾选一条记录')
        return
      }
      this.mockData = [];
      this.originTargetKeys = [];
      //获取参考明细记录
      getAction(this.url.getPurchaseDetail + '?id=' + this.pId[0]).then(res => {
        if (res.length == 0) {
          this.$message.warning('没有采购申请!!!')
          this.selectedRowKeys = []
          this.visible = false
          return
        } else {
          this.visible = true;
          this.purchaseData = res;
          for (let i = 0; i < res.length; i++) {
            this.mockData.push({
              key: i.toString(),
              planNo: res[i].planNo,
              planDate: res[i].planDate,
              materielNo: res[i].materielNo,
              materielName: res[i].materielName,
              measureUnitName: res[i].measureUnitName,
              measureNum: res[i].measureNum,
              disabled: false,
            });
          }
        }
      })
      this.onChange();
    },
    onChange (nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },

    //点击确定
    handleOk () {
      this.biddingDtlList = [];
      if (this.targetKeys.length == 0) {
        this.$message.error("请勾选要添加的数据!")
        return
      }
      for (let i = 0; i < this.targetKeys.length; i++) {
        this.biddingDtlList.push(this.purchaseData[this.targetKeys[i]]);
      }
      console.log(this.biddingDtlList);
      postAction(this.url.addMaterialDtl + '?id=' + this.pId[0], this.biddingDtlList).then(res => {
        if (res.success) {
          this.$message.success(res.result)
          this.realTimeList();
        } else {
          this.$message.error('添加失败!')
        }
      })
      this.mockData = [];
      this.originTargetKeys = [];
      this.visible = false
      this.onClearSelected();
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.onClearSelected();
    },
    handleCancel () {
      this.close()
    }

  },
};
</script>