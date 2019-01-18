require('dotenv').config()

const env = process.env
const isProd = env.MODE == 'prod'

// 不能以斜杠结尾
let apiServer = process.env.API_SERVER
// 必须以斜杠结尾
let publicPath = process.env.PUBLIC_PATH || 'http://cdn.deepexi.com/'

let MOCK_SERVER = 'http://yapi.deepexi.io:5002/mock/691'

const config = {
  projectNo: env.PROJECT_NO,
  aliIconFont: '',
  env: {
    mock: {
      '/security': 'http://yapi.demo.qunar.com/mock/9638',
      // '/deepexi-member-center': 'http://yapi.deepexi.io:5002/mock/682'
      '/deepexi-member-center': 'http://119.29.28.59',
      // security 单独处理
      '/deepexi-enterprise-contact/security': MOCK_SERVER,
      '/deepexi-enterprise-contact': MOCK_SERVER
    },
    dev: {
      '/security': 'http://your.dev.server'
    }
  }
}

let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  mode: 'spa',
  env: {
    PROJECT_NO: config.projectNo,
    NO_LOGIN: process.env.NO_LOGIN,
    OSS_KEY: process.env.OSS_KEY,
    OSS_SECRET: process.env.OSS_SECRET,
    OSS_BUCKET: process.env.OSS_BUCKET,
    OSS_REGION: process.env.OSS_REGION
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  build: {
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Optimus',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'},
      {
        hid: 'description',
        name: 'description',
        content: '开发平台'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png'
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.styl',
      lang: 'stylus'
    }
  ],
  srcDir: 'src/',
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    }
  ],
  modules: ['@nuxtjs/axios'],
  axios
}
