//index.js
const item1 = require('../../request/requset.js').item1;
const server = require('../../request/requset.js').server;
Page
({
  data:{
    item1:"",
    detail1:"",
    name1:"",
    item2:"",
    detail2:"",
    name2:"",
  }, 

  onLoad()
  {
   this.toUpdate()
  },

  //加载更新的图片
  toUpdate()
  {
    let that = this;
    wx.request({
      url: item1,
      method:'GET',
      dataType:'json',
      success:(res)=>
      {
       // console.log(res.data)
        let updateData = res.data;
        that.setData({
          item1:server+updateData.url1,
          detail1:updateData.introduce1,
          name1:updateData.name1,
          item2:server+updateData.url2,
          detail2:updateData.introduce2,
          name2:updateData.name2
        })
      }
    })
  },
  
  //进入登录相应的页面的函数
  enter_course() {
     //进入课程
      wx.navigateTo({
        url: 'addFun/enter/enter?id=1'
      })
    },
    //进入成绩
    enter_grade() {
      wx.navigateTo({
        url: 'addFun/enter/enter?id=2'
      })
    },

    //进入校车
    enter_bus(){
      wx.navigateTo({
        url: 'addFun/bus/bus',
      })
    },

    //进入体育打开
    enter_pe(){
      wx.navigateTo({
        url: 'addFun/enter/enter?id=3'
      })
    },
    
    //进入暂时未开放
    enter(){
      wx.showModal({
        title: "提醒",
        content:"前方正在施工",
      })
    }
})
