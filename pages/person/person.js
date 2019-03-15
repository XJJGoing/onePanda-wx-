const app = getApp()
const weChat = require('../../utils/wechat.js')
//const session = require('../../request/requset.js').session
//引入登录的加载文件
Page
({
  data:{
   college:"",
   major:"",
   number:"",
   logfirm:false,
   avatarUrl:'',
   nickname:''
  },
  //加载也秒的时候赋值
   onLoad()
   {
      wx.showLoading({
       title: '正在加载',
       mask:true,
      })
      setTimeout(()=>{
       wx.hideLoading()
      },1000)
      this.toLog()
   },

  //一开始进入个人的页面的时候就判断本地是否有cookies
  toLog()
  {
    let cookie = wx.getStorageSync('usercookie');
    if (cookie){
      weChat.getCryptoData()
      .then(d=>{
        this.changeStatus(d.data)
      })  
      this.setData({
        logfirm:true
      })
      }else{
        logfirm:false
      }
  },

  //改变状态的函数
   changeStatus(d)
   {
     //console.log(d.userInfo.avatarUrl)
     this.setData({
       logfirm: true,
       avatarUrl: d.userInfo.avatarUrl,
       nickname: d.userInfo.nickName,
     })
   },


   //这个函数用于第一次登录的时候获取用code交换用户的信息，并且返回一个session_id
   log()
   {
     //使用第三方api的时候this的指针域会发生变化
       let that = this;
       wx.showModal({
       title: '获取用户信息',
       content: '获取用户的头像以及名称信息，保证保护用户隐私',
       confirmText:'同意',
       cancelText:'拒绝',
       success:function(res)
       {
         if(res.confirm)
         {
           //点击确认的时候获取用户的信息
           weChat.getCryptoData()
           .then(d=>{
             that.changeStatus(d.data)
             return weChat.getMyOpenid(d)
            })
            .then(d=>{
              console.log(d)
              console.log('从后端获取的',d)
              wx.setStorageSync('usercookie', d.cookies)
            })
         }
       }
     })
   },
})

