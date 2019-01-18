import dayjs from 'dayjs'

export const formatDate = (time, format) => {
  if (!time) {
    return ''
  }
  return dayjs(time).format(format)
}

// 判断是否是对象
export const isObject = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
}

// 判断是否是数组
export const isArray = val => {
  return Object.prototype.toString.call(val) === '[object Array]'
}

// 判断是否是数字
export const isNumber = val => {
  return Object.prototype.toString.call(val) === '[object Number]'
}

// 判断是否是字符串
export const isString = val => {
  return Object.prototype.toString.call(val) === '[object String]'
}

// 判断是否是字符串
export const isBoolean = val => {
  return Object.prototype.toString.call(val) === '[object Boolean]'
}
