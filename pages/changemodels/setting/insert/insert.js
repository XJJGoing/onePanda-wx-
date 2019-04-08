const managerLogin = require('../../../../request/requset.js').managerLogin

Page({
  data: {
    //账号
    key: '',
    //密码
    password: '',
    //密码的显示和隐藏
    isShowPassword: true
  },
  onLoad()
  {
    
  },

  //获取数据库中拥有的专业


  //账号有内容显示清除按钮
  bindKeyInput: function (e) {
    this.setData({
      key: e.detail.value,
    })
  },

  //密码有内容显示可见按钮
  bindPassInput: function (e) {
    this.setData({
      password: e.detail.value,
    })
  },

  //登陆跳转,跟数据库进行认证
  bindViewTap: function ()
  {
    let mangerData = {
      email:this.data.key,
      password:this.data.password
    }
    wx.request({
      url:managerLogin,
      data:mangerData,
      method:"POST",
      dataType:'json',
      success:(res)=>{
        console.log(res)
          console.log(res.data.status)
          let code = res.data.status;
          if (code == 1)
          {
            wx.navigateTo({
              url: './insertDetail/insertDetail',
            })
          } else if (code == 0)
          {
            wx.showModal({
              title: '账号或者密码错误，请重试',
            })
          }
      }
    })
  },

  //密码显示与隐藏切换
  toggleShowPassword: function (e) {
    this.setData({
      isShowPassword: !this.data.isShowPassword
    });
  },

  //清空账号函数
  eliminate: function () {
    this.setData({
      key: ""
    })
  },  

})