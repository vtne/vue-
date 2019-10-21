exports.install = function (Vue, options) {
  // 此函数用于获取月份的最后一天
  Vue.prototype.getLastDay = function (year, month) {
    var newDay = year
    var newMonth = month++
    if (month > 12) {
      newMonth -= 12
      newDay++
    }
    var newDate = new Date(newDay, newMonth, 1)
    return (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate()
  }
  // 此函数用于不足10前面补0
  Vue.prototype.supplement = function (val) {
    return val < 10 ? '0' + val : val
  }
  // 初始化日期格式
  Vue.prototype.getDay = function (time, format) {
    if (time == null || time === undefined || time === '') {
      return ''
    } else if (!(time == null || time === undefined || time === '')) {
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours() + 1)
          case 'mm':
            return tf(t.getMinutes())
        }
      })
    }
  }
  // 非空判断
  Vue.prototype.isNull = function (a) {
    if (a === null || a === undefined || a === '') {
      return ''
    } else {
      return a
    }
  }
}
