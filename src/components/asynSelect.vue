<template>
  <div>
    <el-select
      v-model="selectValue"
      filterable
      remote
      clearable
      placeholder="输入会员账号可自动搜索"
      :remote-method="remoteMethod"
      default-first-option
      :loading="loading"
      @change="change"
      @clear="clear"
    >
      <el-option
        v-for="item in asynOptions"
        :key="item.id"
        :label="item.username"
        :value="item.username"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'IconFont',
  props: {
    value: {
      type: String
    },
    rendererRef: {
      type: Object
    },
    a: {
      type: String
    }
  },
  data() {
    return {
      selectValue: this.value,
      asynOptions: [], // 异步过滤好的option
      asynList: [], // 异步获取的list
      loading: false,
      // 异步需要更新的表单字段
      asynUpdataFormItem: ['nickName', 'phone', 'levelId', 'registerAt']
    }
  },
  mounted() {
    console.log('this.mounted----')
    console.log(this.rendererRef)
    console.log(this.a)
    this.$emit('updateForm')
  },
  methods: {
    // 查找会员账号，自动补全其他会员信息
    searchMember(val) {
      if (val.length == 0) {
        return
      }
      this.$axios
        .$get(`/deepexi-member-center/api/v1/members/getMember/${val}`, {
          params: {}
        })
        .then(resp => {
          // console.log(resp)
          if (resp.payload !== null) {
            console.log('会员存在')
            let res = resp.payload
            let obj = {}
            this.asynUpdataFormItem.forEach(item => {
              obj[item] = res[item]
            })
            // this.$refs.dataTable.$refs.dialogForm.updateForm(obj)
            this.$emit('updateForm', obj)
            // this.extraParams.memberId = res.id
            this.$emit('updateData', {
              key: 'extraParams',
              val: {memberId: res.id}
            })
          } else {
            this.$message({
              type: 'warning',
              message: '会员账号不存在！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'warning',
            message: '服务器错误'
          })
        })
    },

    // select 值改变的时候触发 远程搜索方法
    remoteMethod(query) {
      console.log('remoteMethod --- ')
      console.log(query)
      console.log(this.extraParams)
      this.$emit('updateData', {
        key: 'username',
        val: query
      })
      // 如果select的值 === 原来的值的时候，不用清空关联数据。为了防止select 一foucs 就清空关联数据
      // if (!(query.trim() === this.extraParams.username.trim())) {
      // let obj = {}
      // this.asynUpdataFormItem.forEach(item => {
      //     obj[item] = ''
      // })
      // this.$refs.dataTable.$refs.dialogForm.updateForm(obj)
      // }
      if (query !== '') {
        // this.extraParams.username = query
        this.loading = true
        this.timer = setTimeout(() => {
          this.$axios
            .$get('/deepexi-member-center/api/v1/members/list')
            .then(resp => {
              this.loading = false
              this.asynList = resp.payload
              this.asynOptions = this.asynList.filter(item => {
                return (
                  item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
                )
              })
            })
        }, 200)
      } else {
        this.asynOptions = []
      }
    },

    // 选中值发生变化时触发
    change() {
      console.log('change --- ')
      let obj = {}
      this.asynUpdataFormItem.forEach(item => {
        obj[item] = ''
      })
      // let dataTable = this.$parent
      console.log(this)
      this.$emit('updateForm', obj)
      // this.$parent.$refs.dialogForm.updateForm(obj)
      this.searchMember(this.selectValue)
    },

    // 可清空的单选模式下用户点击清空按钮时触发
    clear() {
      console.log('clear --- ')
    }
  }
}
</script>
<style></style>
