<template>
  <div>
    <template>
      <button @click="getMember">getMember</button>
      <el-data-table
        ref="dataTable"
        v-bind="tableConfig"
        :extraParams="extraParams"
        :onNew="onNew"
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
      memberUrl: '/deepexi-member-center/api/v1/memberBlacklists',
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
            formatter: row => {
              console.log(row.memberDto)
              return row.memberDto !== null ? LEVEL[row.memberDto.levelId] : ''
            }
          },
          {
            prop: 'memberDto.registerAt',
            label: '注册时间',
            formatter: row => {
              return row.memberDto !== null
                ? formatDate(row.memberDto.registerAt, 'YYYY-MM-DD')
                : ''
            }
          },
          {
            prop: 'createdAt',
            label: '拉黑日期',
            formatter: row => {
              return row.memberDto !== null
                ? formatDate(row.createdAt, 'YYYY-MM-DD')
                : ''
            }
          },
          {
            prop: 'deadline',
            label: '恢复日期',
            formatter: row => {
              return row.memberDto !== null
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
      extraParams: {
        username: '',
        memberId: ''
      }
    }
  },
  mounted() {},
  methods: {
    getMember() {
      this.$axios.$get('/deepexi-member-center/api/v1/members').then(resp => {
        console.log(resp)
      })
    },

    onNew(data, row) {
      console.log('onNew --- ')
      console.log(data, row)
      return this.$axios.$post(this.memberUrl, {
        memberId: data.memberId ? data.memberId : '',
        deadline: data.deadline ? data.deadline : '',
        reason: data.reason ? data.reason : ''
      })
    },
    // 查找会员账号
    searchUser(val) {
      // console.log(this.$refs.dataTable.$refs.dialogForm)
      if (val.length == 0) {
        this.$message('请输入会员账号')
        return
      }
      this.$axios
        .$get('/deepexi-member-center/api/v1/members', {
          params: {username: val}
        })
        .then(resp => {
          console.log(resp)
          if (resp.payload.content.length > 0) {
            let res = resp.payload.content[0]
            this.$refs.dataTable.$refs.dialogForm.updateForm({
              // id: 'nickName',
              // value: 'wyp',
              nickName: res.nickName,
              phone: res.phone,
              levelId: res.levelId,
              registerAt: res.registerAt
            })
            this.extraParams.memberId = res.id
            console.log('this.extraParams---')
            console.log(this.extraParams)
          } else {
            this.$message('请输入存在的会员账号')
          }
        })
    },
    loadAll() {
      return [
        {value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号'},
        {
          value: 'Hot honey 首尔炸鸡（仙霞路）',
          address: '上海市长宁区淞虹路661号'
        },
        {
          value: '新旺角茶餐厅',
          address: '上海市普陀区真北路988号创邑金沙谷6号楼113'
        },
        {value: '泷千家(天山西路店)', address: '天山西路438号'},
        {
          value: '胖仙女纸杯蛋糕（上海凌空店）',
          address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101'
        },
        {value: '贡茶', address: '上海市长宁区金钟路633号'},
        {
          value: '豪大大香鸡排超级奶爸',
          address: '上海市嘉定区曹安公路曹安路1685号'
        },
        {value: '茶芝兰（奶茶，手抓饼）', address: '上海市普陀区同普路1435号'},
        {value: '十二泷町', address: '上海市北翟路1444弄81号B幢-107'},
        {value: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号'},
        {value: '阿姨奶茶/豪大大', address: '嘉定区曹安路1611号'},
        {value: '新麦甜四季甜品炸鸡', address: '嘉定区曹安公路2383弄55号'},
        {
          value: 'Monica摩托主题咖啡店',
          address: '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F'
        },
        {
          value: '浮生若茶（凌空soho店）',
          address: '上海长宁区金钟路968号9号楼地下一层'
        },
        {value: 'NONO JUICE  鲜榨果汁', address: '上海市长宁区天山西路119号'},
        {value: 'CoCo都可(北新泾店）', address: '上海市长宁区仙霞西路'},
        {
          value: '快乐柠檬（神州智慧店）',
          address: '上海市长宁区天山西路567号1层R117号店铺'
        },
        {
          value: 'Merci Paul cafe',
          address: '上海市普陀区光复西路丹巴路28弄6号楼819'
        },
        {
          value: '猫山王（西郊百联店）',
          address: '上海市长宁区仙霞西路88号第一层G05-F01-1-306'
        },
        {value: '枪会山', address: '上海市普陀区棕榈路'},
        {value: '纵食', address: '元丰天山花园(东门) 双流路267号'},
        {value: '钱记', address: '上海市长宁区天山西路'},
        {value: '壹杯加', address: '上海市长宁区通协路'},
        {
          value: '唦哇嘀咖',
          address: '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元'
        },
        {value: '爱茜茜里(西郊百联)', address: '长宁区仙霞西路88号1305室'},
        {
          value: '爱茜茜里(近铁广场)',
          address:
            '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺'
        },
        {
          value: '鲜果榨汁（金沙江路和美广店）',
          address: '普陀区金沙江路2239号金沙和美广场B1-10-6'
        },
        {value: '开心丽果（缤谷店）', address: '上海市长宁区威宁路天山路341号'},
        {value: '超级鸡车（丰庄路店）', address: '上海市嘉定区丰庄路240号'},
        {value: '妙生活果园（北新泾店）', address: '长宁区新渔路144号'},
        {value: '香宜度麻辣香锅', address: '长宁区淞虹路148号'},
        {value: '凡仔汉堡（老真北路店）', address: '上海市普陀区老真北路160号'},
        {value: '港式小铺', address: '上海市长宁区金钟路968号15楼15-105室'},
        {value: '蜀香源麻辣香锅（剑河路店）', address: '剑河路443-1'},
        {value: '北京饺子馆', address: '长宁区北新泾街道天山西路490-1号'},
        {
          value: '饭典*新简餐（凌空SOHO店）',
          address: '上海市长宁区金钟路968号9号楼地下一层9-83室'
        },
        {
          value: '焦耳·川式快餐（金钟路店）',
          address: '上海市金钟路633号地下一层甲部'
        },
        {value: '动力鸡车', address: '长宁区仙霞西路299弄3号101B'},
        {value: '浏阳蒸菜', address: '天山西路430号'},
        {value: '四海游龙（天山西路店）', address: '上海市长宁区天山西路'},
        {
          value: '樱花食堂（凌空店）',
          address: '上海市长宁区金钟路968号15楼15-105室'
        },
        {value: '壹分米客家传统调制米粉(天山店)', address: '天山西路428号'},
        {
          value: '福荣祥烧腊（平溪路店）',
          address: '上海市长宁区协和路福泉路255弄57-73号'
        },
        {
          value: '速记黄焖鸡米饭',
          address: '上海市长宁区北新泾街道金钟路180号1层01号摊位'
        },
        {value: '红辣椒麻辣烫', address: '上海市长宁区天山西路492号'},
        {value: '(小杨生煎)西郊百联餐厅', address: '长宁区仙霞西路88号百联2楼'},
        {value: '阳阳麻辣烫', address: '天山西路389号'},
        {
          value: '南拳妈妈龙虾盖浇饭',
          address: '普陀区金沙江路1699号鑫乐惠美食广场A13'
        }
      ]
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
