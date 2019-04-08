const learnTime = require('../../request/requset.js').learnTime
Page
({
  data:
  {
    use_time:"",
  },

  onLoad(options)
  {
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
      openid:wx.getStorageSync('usercookie'),
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
  }
})