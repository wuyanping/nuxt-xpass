<template>
  <div id="blacklist">
    <el-data-table ref="dataTable" v-bind="tableConfig"> </el-data-table>

    <!-- 弹框 -->
    <el-dialog
      :title="dialogConfig.title"
      :visible.sync="dialogConfig.dialogVisible"
      :before-close="cancel"
      :close-on-click-modal="false"
    >
      <div class="el-form-item is-required ml">
        <div class="el-form-item__label">会员账号</div>
        <el-select
          v-model="selectConfig.value"
          filterable
          remote
          clearable
          :placeholder="selectConfig.placeholder"
          :remote-method="remoteMethod"
          default-first-option
          :loading="selectConfig.loading"
          @change="change"
        >
          <el-option
            v-for="item in selectConfig.asynOptions"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </div>

      <el-form-renderer
        label-width="120px"
        :content="content"
        ref="blacklistForm"
      ></el-form-renderer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
          :disabled="dialogConfig.confirmDisable"
          :loading="dialogConfig.confirmButtonLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {STATUS, LEVEL} from '~/const/const'
import {formatDate, isArray} from '~/const/filter'
import {memberBlacklists, getMember, memberslist} from '~/const/api'
// import methodsMixin from '~/mixins/methods'

export default {
  name: 'blacklist',
  data() {
    return {
      // el-data-table 配置
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: false,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: memberBlacklists,
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: true,
        single: false,
        extraButtons: [],
        headerButtons: [
          {
            text: '新增黑名单',
            style: 'background-color:#409EFF;border:none;color:#fff',
            atClick: () => {
              this.dialogConfig.dialogVisible = true
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {
            prop: 'username',
            label: '会员账号'
          },
          {
            prop: 'nickName',
            label: '会员昵称'
          },
          {
            prop: 'levelList',
            label: '会员等级',
            formatter: row => {
              let levelList = ''
              if (isArray(row.levelList) && row.levelList.length > 0) {
                levelList = row.levelList.map(item => {
                  return item.name
                })
                levelList = levelList.join()
              }
              return levelList
            }
          },
          {
            prop: 'registerAt',
            label: '注册时间',
            formatter: row => {
              return row.registerAt !== null
                ? formatDate(row.registerAt, 'YYYY-MM-DD')
                : ''
            }
          },
          {
            prop: 'createdAt',
            label: '拉黑日期',
            formatter: row => {
              return row.createdAt !== null
                ? formatDate(row.createdAt, 'YYYY-MM-DD')
                : ''
            }
          },
          {
            prop: 'deadline',
            label: '恢复日期',
            formatter: row => {
              return row.deadline !== null
                ? formatDate(row.deadline, 'YYYY-MM-DD')
                : ''
            }
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'username',
            label: '会员账号',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'input',
            $id: 'nickName',
            label: '会员昵称',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'date-picker',
            $id: 'registerAt',
            label: '注册时间',
            $el: {
              type: 'daterange',
              placeholder: '请选择',
              'range-separator': '-',
              'value-format': 'yyyy-MM-dd',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期'
            },
            // 输入的日期格式
            inputFormat: row => {
              if (
                !(
                  row.registerAtStart == undefined ||
                  row.registerAtEnd == undefined
                )
              ) {
                return [row.registerAtStart, row.registerAtEnd]
              }
            },
            // 输出的日期格式
            outputFormat: val => {
              if (!val) {
                return {registerAtStart: '', registerAtEnd: ''}
              }
              return {
                registerAtStart: val[0],
                registerAtEnd: val[1]
              }
            }
          },
          {
            $type: 'input',
            $id: 'memberId',
            label: '会员ID',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'select',
            $id: 'levelId',
            label: '会员等级',
            rules: [
              {required: false, message: '请选择会员等级', trigger: 'blur'}
            ],
            $options: Object.keys(LEVEL).map(v => {
              return {
                value: v == 'all' ? '' : v,
                label: LEVEL[v]
              }
            })
          },
          {
            $type: 'select',
            $id: 'status',
            label: '会员状态',
            rules: [
              {required: false, message: '请选择会员状态', trigger: 'blur'}
            ],
            $options: Object.keys(STATUS).map(v => {
              return {
                value: v == 'all' ? '' : v,
                label: STATUS[v]
              }
            }),
            $el: {
              placeholder: '请选择'
            }
          }
        ],
        from: []
      },
      // 弹框配置
      dialogConfig: {
        title: '新增黑名单',
        dialogVisible: false,
        confirmDisable: false,
        confirmButtonLoading: false
      },
      // disabled: false,
      // 额外的参数
      extraParams: {
        memberId: ''
      },
      // 异步过滤下拉框配置
      selectConfig: {
        value: '',
        placeholder: '输入会员账号可自动搜索，选择后其他信息会自动读取',
        asynOptions: [], // 异步过滤好的option
        asynList: [], // 异步获取的list
        loading: false,
        asynUpdataFormItem: ['nickName', 'phone', 'levelId', 'registerAt'] // 异步需要更新的表单字段
      },

      // 新增表单内容
      content: [
        {
          $type: 'input',
          $id: 'nickName',
          label: '昵称',
          $el: {
            placeholder: '请输入',
            disabled: true
          },
          rules: [
            {
              required: false,
              message: '请输入昵称',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'phone',
          label: '手机号',
          $el: {
            placeholder: '请输入',
            disabled: true
          },
          rules: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'levelId',
          label: '会员等级',
          $el: {
            placeholder: '请输入',
            disabled: true
          },
          rules: [
            {
              required: false,
              message: '请输入会员等级',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'registerAt',
          label: '注册时间',
          $el: {
            placeholder: '请输入',
            disabled: true
          },
          rules: [
            {
              required: false,
              message: '请输入注册时间',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'date-picker',
          $id: 'deadline',
          label: '拉黑截至日期',
          $el: {
            placeholder: '请输入',
            valueFormat: 'yyyy-MM-dd'
          },
          rules: [
            {
              required: true,
              message: '请输入拉黑截至日期',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'reason',
          label: '拉黑原因',
          $el: {
            placeholder: '请输入'
          },
          rules: [
            {
              required: true,
              message: '请输入拉黑原因',
              trigger: 'blur'
            }
          ]
        }
      ]
    }
  },
  mounted() {},
  // mixins: [methodsMixin],
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
    },

    // 取消表单提交
    cancel() {
      this.selectConfig = {
        ...this.selectConfig,
        value: '',
        asynOptions: []
      }
      this.$refs.blacklistForm.resetFields()
      this.dialogConfig.dialogVisible = false
    },

    // 表单提交
    confirm() {
      if (this.selectConfig.value.length === 0) {
        this.showMessage('warning', '请输入会员账号')
        this.$refs.blacklistForm.validate(valid => false)
        return
      }
      this.$refs.blacklistForm.validate(valid => {
        if (valid) {
          this.dialogConfig.confirmButtonLoading = true
          let data = this.$refs.blacklistForm.getFormValue()
          let {deadline, reason} = data
          let params = {}
          params = {
            ...this.extraParams,
            deadline,
            reason
          }
          this.$axios
            .$post(memberBlacklists, params)
            .then(resp => {
              this.dialogConfig.confirmButtonLoading = false
              this.$refs.dataTable.getList()
              this.showMessage('success')
              this.cancel()
            })
            .catch(err => {
              this.dialogConfig.confirmButtonLoading = false
            })
        } else {
          return false
        }
      })
    },

    // 查找会员账号，自动补全其他会员信息
    searchMember(val) {
      if (val.length == 0) {
        return
      }
      let url = `${getMember}/${val}`
      this.dialogConfig.confirmDisable = true
      this.$axios
        .$get(url)
        .then(resp => {
          if (resp.payload !== null) {
            let res = resp.payload
            let obj = this.asynUpdataForm(res)
            this.$refs.blacklistForm.updateForm(obj)
            this.extraParams.memberId = res.id
          } else {
            this.showMessage('warning', '会员账号不存在！')
          }
          this.dialogConfig.confirmDisable = false
        })
        .catch(err => {
          this.showMessage('error', '服务器错误')
          this.dialogConfig.confirmDisable = false
        })
    },

    // select 值改变的时候触发 远程搜索方法
    remoteMethod(query) {
      if (query !== '') {
        this.selectConfig.loading = true
        let params = {
          black: true
        }
        setTimeout(() => {
          this.$axios.$get(memberslist, {params}).then(resp => {
            let data = resp.payload
            this.filterMember(data, query)
          })
        }, 200)
      } else {
        this.selectConfig.asynOptions = []
      }
    },

    // 过滤会员
    filterMember(data, query) {
      this.selectConfig.loading = false
      this.selectConfig.asynList = data
      this.selectConfig.asynOptions = this.selectConfig.asynList.filter(
        item => {
          return item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
        }
      )
    },

    // 选中值发生变化时触发
    change() {
      let obj = this.asynUpdataForm()
      this.$refs.blacklistForm.updateForm(obj)
      this.searchMember(this.selectConfig.value)
    },

    asynUpdataForm(data) {
      let obj = {}
      if (!data) {
        this.selectConfig.asynUpdataFormItem.forEach(item => {
          obj[item] = ''
        })
      } else {
        this.selectConfig.asynUpdataFormItem.forEach(item => {
          obj[item] = data[item]
        })
      }
      return obj
    }
  }
}
</script>
<style lang="stylus">
#blacklist{
    .el-form-item.is-success .el-input__inner,
    .el-form-item.is-success .el-input__inner:focus,{
        border-color: rgb(220, 223, 230);
    }
    .ml{
        margin-left: 43px;
    }
}
</style>
