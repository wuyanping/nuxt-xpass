<template>
  <div>
    <template>
      <el-data-table v-bind="tableConfig"></el-data-table>
    </template>
  </div>
</template>
<script>
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
        url: '/deep-member-center/api/v1/memberBlacklists',
        hasNew: true,
        hasEdit: true,
        hasView: false,
        hasDelete: true,
        single: false,
        extraButtons: [],
        columns: [
          {
            prop: 'memberId',
            label: '会员账号'
          },
          {
            prop: 'nickName',
            label: '会员昵称'
          },
          {
            prop: 'levelId',
            label: '会员等级'
          },
          {
            prop: 'registerAt',
            label: '注册时间'
          },
          {
            prop: 'createdAt',
            label: '拉黑日期'
          },
          {
            prop: 'deadline',
            label: '恢复日期'
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
            $type: 'input',
            $id: 'registerAt',
            label: '注册时间',
            $el: {
              placeholder: '请输入'
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
            $type: 'input',
            $id: 'levelId',
            label: '会员等级',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'input',
            $id: 'status',
            label: '会员状态',
            $el: {
              placeholder: '请输入'
            }
          }
        ],
        form: [
          {
            $type: 'input',
            $id: 'username',
            label: '会员账号',
            $el: {
              placeholder: '请输入'
            },
            rules: [
              {
                required: true,
                message: '请输入会员账号',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'nickName',
            label: '昵称',
            $el: {
              placeholder: '请输入'
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
              placeholder: '请输入'
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
            $id: 'name',
            label: '会员等级',
            $el: {
              placeholder: '请输入'
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
            $id: 'phone',
            label: '注册时间',
            $el: {
              placeholder: '请输入'
            },
            rules: [
              {
                required: true,
                message: '请输入注册时间',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'deadline',
            label: '拉黑截至日期',
            $el: {
              placeholder: '请输入'
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
    }
  },
  mounted() {},
  methods: {}
}
</script>
