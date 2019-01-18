<template>
  <div id="blacklist">
    <el-data-table ref="dataTable" v-bind="tableConfig"> </el-data-table>

    <!-- 弹框 -->
    <el-dialog
      :title="dialogConfig.title"
      :visible.sync="dialogConfig.dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="el-form-item is-required ml">
        <div class="el-form-item__label">会员账号</div>
        <!-- 输入会员账号可自动进行搜索，选择后其他基本信息根据会员账号自动读取 -->
        <asynSelect
          @updateForm="updateForm"
          @updateData="updateData"
          :value="username"
        ></asynSelect>
      </div>

      <el-form-renderer
        label-width="100px"
        :content="content"
        ref="blacklistForm"
      ></el-form-renderer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {STATUS, LEVEL} from '~/const/const'
import {formatDate, isArray} from '~/const/filter'
import AsynSelect from '~/components/asynSelect'

export default {
  name: 'blacklist',
  components: {
    AsynSelect
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
              return [row.registerAtStart, row.registerAtEnd]
            },
            // 输出的日期格式
            outputFormat: val => {
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
                value: v,
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
        ]
      },
      // 额外的参数
      extraParams: {
        memberId: ''
      },
      username: '',
      // asynOptions: [], // 异步过滤好的option
      // asynList: [], // 异步获取的list
      // loading: false,
      timer: null,
      // 异步需要更新的表单字段
      asynUpdataFormItem: ['nickName', 'phone', 'levelId', 'registerAt'],
      dialogConfig: {
        title: '新增黑名单',
        dialogVisible: false
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
              required: true,
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
              required: false,
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
    // 点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose() {
      // this.dialogConfig.dialogVisible = false
    },

    // 取消表单提交
    cancel() {
      this.dialogConfig.dialogVisible = false
    },

    // 更新表单
    updateForm(val) {
      this.$refs.blacklistForm.updateForm(val)
    },

    // 更新data的数据
    updateData({key, val}) {
      this[key] = val
    },

    // 自定义表单提交
    confirm() {
      // this.dialogConfig.dialogVisible = false
      // 清空额外参数
      // this.extraParams = {
      //   username: '',
      //   memberId: ''
      // }

      console.log(this.username)
      if (this.username.trim().length < 0) {
        this.$message({
          type: 'warning',
          message: '请输入会员账号'
        })
        return
      }
      this.$refs.blacklistForm.validate(valid => {
        if (valid) {
          let data = this.$refs.blacklistForm.getFormValue()
          console.log(this.$refs.blacklistForm.getFormValue())
          alert('submit!')
          this.$axios
            .$post(this.memberUrl, {
              memberId: this.extraParams.memberId
                ? this.extraParams.memberId
                : '',
              deadline: data.deadline ? data.deadline : '',
              reason: data.reason ? data.reason : ''
            })
            .then(resp => {
              this.$message({
                message: '添加黑名单成功'
              })
            })
            .catch(err => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

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
            this.$refs.dataTable.$refs.dialogForm.updateForm(obj)
            this.extraParams.memberId = res.id
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
      this.$refs.dataTable.$refs.dialogForm.updateForm(obj)
      this.searchMember(this.extraParams.username)
    },

    // 可清空的单选模式下用户点击清空按钮时触发
    clear() {
      console.log('clear --- ')
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
