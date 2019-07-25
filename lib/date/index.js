{
    class Date2 {
      constructor(date = new Date()) {
        this.date = new Date(date - 0)
      }
      //获取星期
      weekday(n) {
        if (n) {
          throw new Error('You can not set weekday')
        }
        return this._proxy('day')
      }
      //获取或者设置日
      //0 为上个月最后一天、-1是上个月最后的第二天以此类推
      day(n) {
        return this._proxy('date', n)
      }
      //获取或者设置年份
      year(n) {
        return this._proxy('fullYear', n)
      }
      //获取或者设置月份
      month(n) {
        return this._proxy('month', n, 1)
      }
      //获取月头
      get monthBeginning() {
        return this.day(1)
      }
      //后去月尾 将date设置到下一个月的第0天
      get monthEnding() {
        return this.month(this.month() + 1).day(0)
      }
      //获取上一个月
      get nextMonth() {
        let day = this.day()
        let month = this.month()
        let nextMonth = this.day(1).month(month + 1)
        //如果当前月的最后一日大于下个月的最后一日 ，那么获取下个月的最后一日
        if (day > nextMonth.monthEnding.day()) {
          return nextMonth.monthEnding
        } else {
          return nextMonth.day(day)
        }
      }
      //获取上一个月
      get previousMonth() {
        let day = this.day()
        let month = this.month()
        let nextMonth = this.day(1).month(month - 1)
        if (day > nextMonth.monthEnding.day()) {
          return nextMonth.monthEnding
        } else {
          return nextMonth.day(day)
        }
      }
      hours(n) {
        return this._proxy('hours', n)
      }
      minutes(n) {
        return this._proxy('minutes', n)
      }
      seconds(n) {
        return this._proxy('seconds', n)
      }
      milliseconds(n) {
        return this._proxy('milliseconds', n)
      }
      get clone() {
        return new Date2(this.date)
      }
  
      _proxy(name, n, offset = 0) {
        if (n === undefined) {
          return this.date[`get${capitalize(name)}`]() + offset
        } else {
          let d = this.clone
          d.date[`set${capitalize(name)}`](n - offset)
          return d
        }
      }
      //与实例在同一个月
      isSameMonthAs(date) {
        return this.year() === date.getFullYear() && this.month() === date.getMonth() + 1
      }
      //与实例在同一天
      isSameDayAs(date) {
        return this.isSameMonthAs(date) && this.day() === date.getDate()
      }
    }
    //将字符串的第一个转大写
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  
    window.Date2 = Date2
  }
  