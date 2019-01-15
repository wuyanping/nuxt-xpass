import dayjs from 'dayjs'

function formatDate(time, format) {
  if (!time) {
    return ''
  }
  return dayjs(time).format(format)
}

export default {
  formatDate: formatDate
}
