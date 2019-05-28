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
   nickname:'',

   //判断是否提交过用户的信息
   iscommit:true
  },

  //加载也秒的时候赋值
   onShow()
   {
         //加载用户的头像以及名称信息
          this.toLog()

         //加载用户的个人信息
         this.todata()

       //只提交一次信息  
       if (this.data.college &&
       this.data.number &&
       this.data.major &&
       wx.getStorageSync('openid')&&
       this.data.iscommit
       ) 
       {
         this.toServer()
         this.setData({
           iscommit:false
         })
       }
   },

  //一开始进入个人的页面的时候就判断本地是否有cookies
  toLog()
  {
    let cookie = wx.getStorageSync('openid');   //openid
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
   let student_Info = wx.getStorageSync('student_Info');
    if (student_Info!=='')
   {
    this.setData({
      college: student_Info.xy,
      major: student_Info.major,
      number: student_Info.number
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
                wx.setStorageSync('openid', d.data)
              }
            })
         },

   /*退出登录的操作*/
   logout(){
     console.log(wx.getStorageSync('openid'))
     let openid = {
       openid: wx.getStorageSync('openid')
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
     wx.removeStorageSync('openid');
     wx.removeStorageSync('student_Data');
     wx.removeStorageSync('student_Info');

     this.setData({
       logfirm:false,
       avatarUrl:'',
       nickname:'',
     })
   },

    onGotUserInfo(e) {
     this.log()
    },
    
   //如果用户的信息不为空的时候提交到服务端。 
   toServer(){
     if (this.data.college && 
         this.data.number && 
         this.data.major && 
         wx.getStorageSync('openid'))
    {
      let userdata = {
        openid: wx.getStorageSync('openid'),
        college: this.data.college,
        major: this.data.major,
        number: this.data.number,
      }
      wx.request({
        url: userInfo,
        data: userdata,
        dataType: 'json',
        method: 'GET',
        success: (res) => {
          console.log(res.data)
        }
      })
    }
  }    
})

