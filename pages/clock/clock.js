const app = getApp()
//const session = require('../../request/requset.js').session
//签到的api
const clock = require('../../request/requset.js').clock
//开始做题的api
const partice = require('../../request/requset.js').partice
const util = require('../../utils/util.js')
//引入登录的加载文件
Page
  ({
    data: {
      item: "",
      major: "",
      kind: "",
      book: "",
      days:"",
      time:'',
      judge:'',
      hadLogin:false
    },
    onLoad()
    {
    },

    onShow()
    {
      let hadUser = wx.getStorageSync('openid');
      if (hadUser) {
        this.setData({
          hadLogin: true
        })
        this.getUserDate();
      } else {
        this.setData({
          hadLogin: false
        })
        wx.showLoading({
          title: '请先登录',
          duration: 1000,
        })
      }
    },

    //每次加载这个页面就获取用户签到天数以及练习的时长
    getUserDate()
    {
      let openid = {
        openid:wx.getStorageSync('openid')
      }
      let that = this;
       wx.request({
        url: clock,
        data:openid,
        method:'POST',
        dataType:'json',
        success:(res)=>
        {
          if(res.data.status == 1)
          {
            that.setData({
              judge: false
            })
          }else if(res.data.status == 0){
            that.setData({
              judge:true
            })
          }
           that.setData({
            days:res.data.days,
            time:res.data.time,
          })
        }
      })
    },
     
    //点击签到函数
    toclock()
    {
     let that = this;
     let nowData = util.formatTime(new Date());
     wx.setStorageSync('nowData', nowData);
     let openid = wx.getStorageSync('openid')
     console.log(nowData)
     let clockData =
      {
        openid:openid,
      }
      wx.showLoading({
        title: '加载中',
        success:()=>{
          wx.request({
            url: clock,
            data: clockData,
            dataType: 'json',
            method: "GET",
            success: (res) => {
              wx.showToast({
                title: '签到成功',
                image: '../public/icon/icon2.png',
                mask: true,
                duration: 500,
              })
              that.getUserDate()
            }
          })
        }
      })  
    },

    //点击开始做题的提交函数
    start()
    {
      let that = this;
      if(this.data.major&&this.data.kind&&this.data.book)
      {
        let particeDetail = {
          major:this.data.major,
          book:this.data.book,
          kind: this.data.kind,
       }
        wx.navigateTo({
          url: '../detail/detail?major='+particeDetail.major
                +"&book=" +particeDetail.book
                +"&kind="+particeDetail.kind,
        })
      }else{
        wx.showToast({
          title: '请完善如上信息',
          image:'../public/icon/icon1.png',
           mask:true,
          duration:1000,
        })
      }
    }

  })