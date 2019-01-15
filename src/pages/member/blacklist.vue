<template>
  <div>
    <template>
      <el-data-table
        ref="dataTable"
        v-bind="tableConfig"
        :extraParams="extraParams"
      >
        <div
          slot="form"
          :prop="extraParams.username"
          class="el-form-item is-required"
        >
          <div class="el-form-item__label">会员账号</div>
          <el-input
            placeholder="请输入会员账号"
            v-model="extraParams.username"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser(extraParams.username)"
            ></el-button>
          </el-input>
        </div>
      </el-data-table>
    </template>
  </div>
</template>
<script>
import CONST from '~/const/const'
import FILTER from '~/const/filter'
let {STATUS, LEVEL} = CONST
let {formatDate} = FILTER

export default {
  name: '',
  data() {
    return {
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: true,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: '/deepexi-member-center/api/v1/memberBlacklists',
        // url: '/mock/api/v1/wyp/user',
        hasNew: true,
        hasEdit: false,
        hasView: false,
        hasDelete: true,
        single: false,
        extraButtons: [],
        columns: [
          {
            prop: 'memberDto.username',
            label: '会员账号'
          },
          {
            prop: 'memberDto.nickName',
            label: '会员昵称'
          },
          {
            prop: 'memberDto.levelId',
            label: '会员等级',
            formatter: row => LEVEL[row.memberDto.levelId]
          },
          {
            prop: 'memberDto.registerAt',
            label: '注册时间',
            formatter: row => {
              return formatDate(row.memberDto.registerAt, 'YYYY-MM-DD')
            }
          },
          {
            prop: 'createdAt',
            label: '拉黑日期',
            formatter: row => {
              return formatDate(row.createdAt, 'YYYY-MM-DD')
            }
          },
          {
            prop: 'deadline',
            label: '恢复日期',
            formatter: row => {
              return formatDate(row.deadline, 'YYYY-MM-DD')
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
              // type: 'daterange',
              placeholder: '请选择',
              // 'range-separator': '-',
              'value-format': 'yyyy-MM-dd'
              // 'default-time': ['00:00:00', '23:59:59']
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
        form: [
          // {
          //   $type: 'input',
          //   $id: 'username',
          //   label: '会员账号',
          //   $el: {
          //     placeholder: '请输入'
          //   },
          //   rules: [
          //     {
          //       required: true,
          //       message: '请输入会员账号',
          //       trigger: 'blur'
          //     }
          //   ]
          // },
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
                required: true,
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
                required: false,
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
      extraParams: {
        username: ''
      }
    }
  },
  mounted() {},
  methods: {
    // 查找会员账号
    searchUser(val) {
      // console.log(this.$refs.dataTable.$refs.dialogForm)
      if (val.length == 0) {
        this.$message('请输入会员账号')
        return
      }
      this.$axios
        .$get('/deepexi-member-center/api/v1/memberBlacklists', {
          params: {username: val}
        })
        .then(resp => {
          console.log(resp)
          if (resp.payload.content.length > 0) {
            let res = resp.payload.content[0]
            this.$refs.dataTable.$refs.dialogForm.updateForm({
              // id: 'nickName',
              // value: 'wyp',
              nickName: res.memberDto.nickName,
              phone: res.memberDto.phone,
              levelId: res.memberDto.levelId,
              registerAt: res.memberDto.registerAt
            })
          } else {
            this.$message('请输入存在的会员账号')
          }
        })
    }
  },
  watch: {
    '$refs.dataTable.dialogVisible': function() {
      console.log(1)
      if (this.$refs.dataTable.dialogVisible && this.$refs.dataTable.isNew) {
        console.log(this.$refs.dataTable.dialogVisible)
      }
    }
  }
}
</script>
