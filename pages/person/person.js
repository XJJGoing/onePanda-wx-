const app = getApp()
const weChat = require('../../utils/wechat.js')
const userInfo = require('../../request/requset.js').userInfo
const logout = require('../../request/requset.js').logout
//引入userinfo
//const userInfo = require('../result/result.js').userInfo
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
      //加载用户的头像以及名称信息
      this.toLog()
      //加载用户的个人信息
      this.todata()

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
  //userdata函数,一进来就判断就否存在用户的个人信息
  todata()
  {
   let userdata = wx.getStorageSync('userdata');
   if(userdata!=='')
   {
    this.setData({
      college:userdata.college,
      major:userdata.major,
      number:userdata.number
    })
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
       let data;
           weChat.getCryptoData()
           .then(d=>{
             data = d.data
             return weChat.getMyOpenid(d)
            })
            .then(d=>{
              if (d) {
                console.log(d)
                console.log('从后端获取的', d)
                that.changeStatus(data)
                wx.setStorageSync('usercookie', d.data)
              }
            })
         },

   /*退出登录的操作*/
   logout(){
     console.log(wx.getStorageSync('usercookie'))
     let openid = {
       openid: wx.getStorageSync('usercookie')
     }
     wx.request({
       url: logout,
       data: openid,
       dataType:'json',
       mehtod:'GET',
       success:(res)=>{
         console.log(res.data)
       }
     })
     wx.removeStorageSync('usercookie');
     this.setData({
       logfirm:false,
       avatarUrl:'',
       nickname:'',
     })
   },
   
    onGotUserInfo(e) {
     this.log()
    },
})

