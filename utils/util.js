 //获取当前时间的js
 const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//就是时间采用的都是两位数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//暴露该组件
module.exports = {
  formatTime: formatTime
}
