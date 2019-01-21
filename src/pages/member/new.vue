<template>
  <div id="newMember">
    <h2 class="mode">新增会员</h2>
    <h3 class="bg">基本信息</h3>
    <div class="basicInfo">
      <el-form-renderer
        label-width="100px"
        :content="content"
        ref="basicForm"
      ></el-form-renderer>
      <div class="buttonGrounp">
        <el-button type="primary" @click="confirm" :loading="loading"
          >保存</el-button
        >
        <el-button @click="cancel">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadToAli from '@femessage/upload-to-ali'
import {phone} from '~/const/validate'
import {membersAdd} from '~/const/api'

export default {
  name: 'newMember',
  data() {
    return {
      url: '/deepexi-member-center/api/v1/members/add', // 这个接口后台会员账号有重命名的验证
      content: [
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
          }
        },
        {
          $id: 'avatarUrl',
          component: uploadToAli,
          label: '头像'
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
            },
            {
              trigger: 'blur',
              validator: phone
            }
          ]
        },
        {
          $type: 'input',
          $id: 'weChat',
          label: '微信号',
          $el: {
            placeholder: '请输入'
          }
        },
        {
          $type: 'input',
          $id: 'qq',
          label: 'QQ',
          $el: {
            placeholder: '请输入'
          }
        },
        {
          $type: 'input',
          $id: 'email',
          label: '邮箱',
          $el: {
            placeholder: '请输入'
          },
          rules: [
            {
              required: false
            },
            {
              trigger: 'blur',
              type: 'email',
              message: '请正确的邮箱地址'
            }
          ]
        },
        {
          $id: 'sex',
          $type: 'radio-group',
          label: '性别',
          $el: {
            placeholder: '请选择'
          },
          rules: [
            {
              required: true,
              message: '请选择性别',
              trigger: 'change'
            }
          ],
          // $default: 'woman',
          $options: [
            // 注意：element radio-group 通过 label 而不是 value 来匹配值
            {label: '男', value: 'man'},
            {label: '女', value: 'woman'}
          ]
        },
        {
          $type: 'date-picker',
          $id: 'birthday',
          label: '生日',
          $el: {
            placeholder: '请输入',
            valueFormat: 'yyyy-MM-dd'
          },
          rules: [
            {
              required: false,
              message: '请选择生日日期',
              trigger: 'blur'
            }
          ]
        },
        {
          $id: 'status',
          $type: 'radio-group',
          label: '状态',
          $el: {
            placeholder: '请输入'
          },
          // $default: '',
          $options: [
            {label: '启动', value: 'enable'},
            {label: '禁用', value: 'disEnable'}
          ]
        }
      ],
      loading: false // 按钮load
    }
  },
  mounted() {},
  methods: {
    // 表单提交操作
    confirm() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          this.loading = true
          let data = {}
          data = Object.assign({}, this.$refs.basicForm.getFormValue())
          this.$axios
            .$post(membersAdd, data)
            .then(resp => {
              if (resp.code == '0') {
                this.$message({
                  message: '新增会员成功',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.$router.push('/member/list')
                  }
                })
                this.$refs.basicForm.resetFields()
              } else {
                this.$message.error(resp.msg)
              }
              this.loading = false
            })
            .catch(err => {
              this.$message.error('服务器错误，请重新新增')
              this.$refs.basicForm.resetFields()
              this.loading = false
            })
        } else {
          return false
        }
      })
    },

    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="stylus">
#newMember{
    .mode{
        padding-bottom: 20px;
    }
    .bg{
        line-height: 300%;
        padding-left: 50px;
        background: rgba(228, 228, 228, 1);
    }
    .basicInfo{
        width: 80%;
        margin: 0 auto;
        padding-top: 20px;
    }
    .buttonGrounp{
        text-align: center;
    }
    >>>.el-form-item.is-success .el-input__inner,
    >>>.el-form-item.is-success .el-input__inner:focus,{
        border-color: rgb(220, 223, 230);
    }
}
</style>
