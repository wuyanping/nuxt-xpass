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
        <AsynFilterSelect
          @updateForm="updateForm"
          @updateData="updateData"
          :value="username"
          :asynUpdataFormItem="asynUpdataFormItem"
        ></AsynFilterSelect>
      </div>

      <el-form-renderer
        label-width="100px"
        :content="content"
        ref="blacklistForm"
      ></el-form-renderer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {STATUS, LEVEL} from '~/const/const'
import {formatDate, isArray} from '~/const/filter'
import AsynFilterSelect from '~/components/asynFilterSelect'

export default {
  name: 'blacklist',
  components: {
    AsynFilterSelect
  },
  data() {
    return {
      // 黑名单地址
      memberUrl: '/deepexi-member-center/api/v1/memberBlacklists',
      // el-data-table 配置
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: false,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: '/deepexi-member-center/api/v1/memberBlacklists',
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
              if (row) {
                return [row.registerAtStart, row.registerAtEnd]
              }
            },
            // 输出的日期格式
            outputFormat: val => {
              if (val) {
                return {
                  registerAtStart: val[0],
                  registerAtEnd: val[1]
                }
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
        dialogVisible: false
      },
      loading: false,
      // 额外的参数
      extraParams: {
        memberId: ''
      },
      username: '',
      // 异步需要更新的表单字段
      asynUpdataFormItem: ['nickName', 'phone', 'levelId', 'registerAt'],
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
  methods: {
    // 更新表单
    updateForm(val) {
      this.$refs.blacklistForm.updateForm(val)
    },

    // 更新data的数据
    updateData({key, val}) {
      this[key] = val
    },

    // 取消表单提交
    cancel() {
      this.$refs.blacklistForm.resetFields()
      this.username = ''
      this.dialogConfig.dialogVisible = false
    },

    // 表单提交
    confirm() {
      console.log(this.username)
      if (this.username.trim().length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入会员账号'
        })
        this.$refs.blacklistForm.validate()
        return
      }
      this.$refs.blacklistForm.validate(valid => {
        if (valid) {
          this.loading = true
          let data = this.$refs.blacklistForm.getFormValue()
          this.$axios
            .$post(this.memberUrl, {
              memberId: this.extraParams.memberId
                ? this.extraParams.memberId
                : '',
              deadline: data.deadline ? data.deadline : '',
              reason: data.reason ? data.reason : ''
            })
            .then(resp => {
              this.loading = false
              this.$refs.dataTable.getList()
              this.$refs.dataTable.showMessage(true)
              this.cancel()
            })
            .catch(err => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus">
#blacklist{
    >>>.el-form-item.is-success .el-input__inner,
    >>>.el-form-item.is-success .el-input__inner:focus,{
        border-color: rgb(220, 223, 230);
    }
    .ml{
        margin-left: 20px;
    }
}
</style>
