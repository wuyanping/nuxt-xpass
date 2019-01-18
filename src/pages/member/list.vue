<template>
  <div id="memberList">
    <el-data-table v-bind="tableConfig" :headerButtons="headerButtons">
    </el-data-table>
  </div>
</template>
<script>
import {SEX, USERSTATUS, LEVEL} from '~/const/const'
import {formatDate, isArray} from '~/const/filter'

export default {
  name: 'memberList',
  data() {
    return {
      headerButtons: [
        {
          text: '新增会员',
          style: 'background-color:#409EFF;border:none;color:#fff',
          atClick: () => {
            this.$router.push('/member/new')
            return Promise.resolve(false)
          }
        }
      ],

      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: true,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: '/deepexi-member-center/api/v1/members',
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: true,
        single: true,
        columns: [
          {
            prop: 'id',
            label: '会员ID'
          },
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
            prop: 'sex',
            label: '性别',
            formatter: row => {
              return row.sex ? SEX[row.sex] : ''
            }
          },
          {
            prop: 'status',
            label: '会员状态',
            formatter: row => {
              return row.status ? USERSTATUS[row.status] : ''
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
          }
        ],

        searchForm: [
          {
            $type: 'input',
            $id: 'username',
            label: '会员账号',
            $el: {
              placeholder: '请输入账号'
            }
          },
          {
            $type: 'input',
            $id: 'nickName',
            label: '会员昵称',
            $el: {
              placeholder: '请输入昵称'
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
            inputFormat: row => {
              return [row.registerAtStart, row.registerAtEnd]
            },
            outputFormat: val => {
              return {
                registerAtStart: val[0],
                registerAtEnd: val[1]
              }
            }
          },
          {
            $type: 'input',
            $id: 'id',
            label: '会员ID',
            $el: {
              placeholder: ' '
            }
          },
          {
            $el: {placeholder: '全部'},
            label: '会员等级',
            $id: 'levelId',
            $type: 'select',
            $options: [
              {
                value: 1,
                label: '全部'
              },
              {
                value: 2,
                label: 'v1'
              }
            ]
          },
          {
            $el: {placeholder: '全部'},
            label: '会员状态',
            $id: 'states',
            $type: 'select',
            $options: [
              {
                value: 1,
                label: '全部'
              },
              {
                value: 2,
                label: '正常'
              }
            ]
          }
        ],
        form: [
          {
            $type: 'input',
            $id: 'username',
            label: '会员账号',
            $el: {
              placeholder: '请输入'
            }
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
#memberList{
    >>>.el-form-item.is-success .el-input__inner,
    >>>.el-form-item.is-success .el-input__inner:focus,{
        border-color: rgb(220, 223, 230);
    }
}
</style>
