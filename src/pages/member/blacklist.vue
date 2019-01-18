<template>
  <div id="blacklist">
    <template>
      <el-data-table
        ref="dataTable"
        v-bind="tableConfig"
        :extraParams="extraParams"
        :onNew="onNew"
      >
        <!-- 表单新增的 -->
        <div
          slot="form"
          :prop="extraParams.username"
          class="el-form-item is-required ml"
        >
          <div class="el-form-item__label">会员账号</div>
          <!-- 输入会员账号可自动进行搜索，选择后其他基本信息根据会员账号自动读取 -->
          <el-select
            v-model="extraParams.username"
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
      </el-data-table>
    </template>
  </div>
</template>
<script>
import {STATUS, LEVEL} from '~/const/const'
import {formatDate, isArray} from '~/const/filter'

export default {
  name: 'blacklist',
  data() {
    return {
      // 黑名单地址
      memberUrl: '/deepexi-member-center/api/v1/memberBlacklists',
      // el-data-table 配置
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: true,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: '/deepexi-member-center/api/v1/memberBlacklists',
        hasNew: true,
        hasEdit: false,
        hasView: false,
        hasDelete: true,
        single: false,
        extraButtons: [],
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
                value: v,
                label: STATUS[v]
              }
            }),
            $el: {
              placeholder: '请选择'
            }
          }
        ],
        formAttrs: {
          'label-width': '120px'
        },
        form: [
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
      },
      // 额外的参数
      extraParams: {
        username: '',
        memberId: ''
      },
      asynOptions: [], // 异步过滤好的option
      asynList: [], // 异步获取的list
      loading: false,
      timer: null,
      // 异步需要更新的表单字段
      asynUpdataFormItem: ['nickName', 'phone', 'levelId', 'registerAt']
    }
  },
  mounted() {},
  methods: {
    // 自定义表单提交
    onNew(data, row) {
      console
      // 清空额外参数
      this.extraParams = {
        username: '',
        memberId: ''
      }
      return this.$axios.$post(this.memberUrl, {
        memberId: data.memberId ? data.memberId : '',
        deadline: data.deadline ? data.deadline : '',
        reason: data.reason ? data.reason : ''
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
        margin-left: 40px;
    }
}
</style>
