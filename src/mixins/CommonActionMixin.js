import { postAction, deleteAction } from '../api/manage'

/**
 * 针对于内嵌主表封装的操作: 审核, 批量删除, 单挑删除  对应的事件触发绑定下列事件即可
 */

export const commonActionMixin = {
  methods: {
    //审核
    check() {
      if (!this.url.check) {
        this.$message.error('请设置url.check属性!')
        return
      }
      let unCheckRows = []
      const { selectedRowKeys, selectionRows } = this
      for (let i = 0; i < selectedRowKeys.length; i++) {
        if (selectionRows[i].status === '0') {
          unCheckRows.push(selectionRows[i])
        }
      }
      //如果需要审核, 则打包数据发送到后台
      if (unCheckRows.length > 0) {
        let promise = new Promise((resolve, reject) => {
          //可以是多条记录, 后台用集合接收
          postAction(this.url.check, unCheckRows).then(res => {
            if (res.success) {
              resolve(res.result)
            } else {
              reject(' failure')
            }
          })
        })
        promise.then((res) => {
          this.loadData()
          if ('审核成功!' !== res) {
            this.$message.warning(res)
          } else {
            this.$message.success(res)
          }
          this.clearSelected()
        })
      } else {
        this.$message.warning('没有待审核的记录')
      }
    },
    //批量删除
    preBatchDel() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      let ids = ''
      const { selectionRows } = this
      let pushRows = selectionRows.filter(item => {
        //0为未审核
        if (item.status === '0') {
          ids += item.id + ','
          return item
        }
      })
      if (ids.length == 0) {
        this.$message.warning('请选择未审核的记录删除!')
        return
      }
      deleteAction(this.url.deleteBatch, { ids: ids }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
          this.clearSelected()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })

    },
    //单条删除, 和多条删除公用后台统一请求, 后台用集合接收
    preDel(record) {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (record.status == 1) {
        this.$message.warning('请选择未审核的记录删除!')
        return
      }
      deleteAction(this.url.deleteBatch, { ids: record.id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
          this.clearSelected()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })

    },

    clearSelected() {
      this.selectionRows = []
      this.selectedRowKeys = []
    }
  }
}
