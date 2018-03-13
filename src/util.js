const util = {
  clientSize: function (node) {
    node = node || document.body
    return {
      w: node.clientWidth,
      h: node.clientHeight,
    }
  },
  now: Date.now || function () {
    return new Date().getTime()
  },
  merge: function (obj) {
    var i = 1, target, key

    for (; i < arguments.length; i++) {
      target = arguments[i]
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key]
        }
      }
    }

    return obj
  },
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  getEvent: function (event) {
    return event ? event : window.event
  },
  getDOMFromEvent: function (event) {
    return event.target
  },
  //函数去抖（对于连续的事件响应我们只执行一次回调）
  debounce: function (func, wait, immediate) {
    // immediate默认为false
    var timeout, args, context, timestamp, result

    var later = function () {
      // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
      var last = util.now() - timestamp

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }

    return function () {
      context = this
      args = arguments
      timestamp = util.now()
      // 第一次调用该方法时，且immediate为true，则调用func函数
      var callNow = immediate && !timeout
      // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }

      return result
    }
  },
  //函数节流（间隔一定时间触发回调来控制函数调用频率）
  throttle: function (func, wait, options) {
    /* options的默认值
     *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
     *  options.leading = true
     * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
     *  options.trailing = true 
     * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
     */
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function () {
      previous = options.leading === false ? 0 : util.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function () {
      var now = util.now()
      if (!previous && options.leading === false) previous = now
      // 计算剩余时间
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      // 当到达wait指定的时间间隔，则调用func函数
      // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
      if (remaining <= 0 || remaining > wait) {
        // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        // options.trailing=true时，延时执行func函数
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  },
  scroll: function (dom, top, duration) {
    if (window.requestAnimationFrame) {
      var cosParameter = top - dom.scrollTop,
        scrollCount = 0,
        oldTimestamp = this.now()
      function step(newTimestamp) {
        scrollCount += Math.PI / (duration / (newTimestamp - oldTimestamp))
        if (scrollCount >= Math.PI) {
          dom.scrollTop = top
        }
        console.log(dom.scrollTop, top)
        if (dom.scrollTop >= top) return
        dom.scrollTop = Math.round(cosParameter + cosParameter * Math.cos(scrollCount))
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    } else {
      dom.scrollTop = top
    }
  },
}
export default util