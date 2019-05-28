const learnTime = require('../../request/requset.js').learnTime
Page
({
  data:
  {
    use_time:"",
  },

  onLoad(options)
  {
    console.log(options.time)
    let time = parseInt(options.time)
    this.setData({
      use_time:time
    })
    this.toServer(time)
  },
   
  //将做题的时间提交到服务端
  toServer(time)
  {
    let timeData = {
      openid:wx.getStorageSync('openid'),
      time: time
    }
    wx.request({
      url: learnTime,
      dataType:'json',
      data:timeData,
      success:(res)=>{
        console.log(res.data)
      }
    })
  },
  
    /*继续做题的页面跳转*/
    work() {
      wx.switchTab({
        url: '../clock/clock'
      })
    },
    /*打卡的页面跳转*/
    share(){
      wx.redirectTo({
        url: 'result-share/result-share'
      })
    }    

})