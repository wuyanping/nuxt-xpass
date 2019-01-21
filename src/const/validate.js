/**
 * 手机验证
 */
export const phone = (rule, value, callback) => {
  value = value + ''
  let length = value.length
  if (
    !(
      length == 11 &&
      /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
        value
      )
    )
  ) {
    callback(new Error('请输入正确的手机格式'))
  } else {
    callback()
  }
}
