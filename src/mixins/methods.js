// 客户端鉴权
export default {
  methods: {
    showMessage(type = 'success', tip = '') {
      switch (type) {
        case 'success':
          this.$message({
            type: 'success',
            message: tip ? tip : '操作成功'
          })
          break
        case 'error':
          this.$message({
            type: 'error',
            message: tip ? tip : '操作失败'
          })
          break
        case 'warning':
          this.$message({
            type: 'warning',
            message: tip ? tip : '操作失败'
          })
          break
      }
    }
  }
}
