//index.js
const item1 = require('../../request/requset.js').item1;
const server = require('../../request/requset.js').server;
const app = getApp()
Page
({
  data:{
    item1:"",
    detail1:"",
    name1:"",
    item2:"",
    detail2:"",
    name2:""
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
        console.log(res.data)
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
  }
  
})
