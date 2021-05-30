<template>
  <div class="body">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="库存地">
              <j-tree-select
                dict="tbd_node,name,id"
                pid-field="pid"
                pidValue="0"
                placeholder="请输入库存地"
                v-model="queryParam.toTbdNodeId"
              ></j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="物料">
              <j-tree-select
                dict="tbd_material,name,id"
                pid-field="pid"
                pidValue="0"
                placeholder="请输入物料"
                v-model="queryParam.tbdMaterialId"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="日期">
              <j-date
                placeholder="请选择开始日期"
                class="query-group-cust"
                v-model="queryParam.voucherDate_begin"
              ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date
                placeholder="请选择结束日期"
                class="query-group-cust"
                v-model="queryParam.voucherDate_end"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="getMatBalance" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    查询总条数为: {{ dataSource.length }}
    <div>
      <!-- <a-button @click="getMatBalance" icon="reload">刷新</a-button> -->
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" :style="{ width: '1300px', height: '550px' }"></div>
      <!-- <img src="@/assets/index.png" alt="首页" style="width: 100%; height: 100%" /> -->
    </div>
  </div>
</template>
<script>
import { getAction } from '@/api/manage'
import JTreeSelect from '@/components/jeecg/JTreeSelect.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@comp/jeecg/JDate'
export default {
  name: 'Analysis',
  components: { JTreeSelect, JDate },
  mixins: [JeecgListMixin],
  data() {
    return {
      queryParam: {},
      inCount: [],
      outCount: [],
      nodeAndMaterial: [],
      dataSource: [],
      url: {
        statistics: '/sm/matlBalance/list',
        list: '/sm/matlBalance/list',
      },
    }
  },
  mounted() {
    this.getMatBalance()
  },
  methods: {
    /**
     * 清除数据
     */
    clearData() {
      this.nodeAndMaterial = []
      this.inCount = []
      this.outCount = []
      this.dataSource = []
      this.voucherDate_begin = ''
      this.voucherDate_end = ''
    },

    /**
     * 设置轴
     */
    setTicks({ dataSource }) {
      dataSource.forEach((data) => {
        let dateArr = data.voucherDate.split('-')
        let date = dateArr[1] + '-' + dateArr[2]
        this.nodeAndMaterial.push(date + '\n' + data.toTbdNodeId_dictText + '\n' + data.tbdMaterialId_dictText)
        this.inCount.push(data.inQty)
        this.outCount.push(data.outQty)
        console.log(dataSource)
      })
    },

    /**
     * 获取日结存
     */
    getMatBalance() {
      let param = {
        toTbdNodeId: this.queryParam.toTbdNodeId,
        tbdMaterialId: this.queryParam.tbdMaterialId,
        voucherDate_begin: this.queryParam.voucherDate_begin,
        voucherDate_end: this.queryParam.voucherDate_end,
      }
      getAction(this.url.statistics, param).then((res) => {
        this.clearData()
        this.dataSource = res.result.records
        this.setTicks(this)
        this.draw()
        if (res.result.records.length == 0) {
          this.$message.error('查询数据为空!')
        } else {
          this.$message.success('获取数据成功!')
        }
      })
    },

    draw() {
      var myChart = this.$echarts.init(document.getElementById('main'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        legend: {
          data: ['流量', '出库', '入库'],
          itemGap: 5,
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.nodeAndMaterial,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位(千)',
            axisLabel: {
              formatter: (a) => {
                a = +a
                return isFinite(a) ? this.$echarts.format.addCommas(+a / 1000) : ''
              },
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%',
          },
        ],
        series: [
          {
            name: '出库',
            type: 'bar',
            data: this.outCount,
          },
          {
            name: '入库',
            type: 'bar',
            data: this.inCount,
          },
        ],
      }
      myChart.setOption(option)
    },
  },
}
</script>