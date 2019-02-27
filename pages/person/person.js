const app = getApp()
//引入登录的加载文件
const logs = require('../logs/logs.js');
Page
({
  data:{
   college:"经济管理学院",
   major:"信息管理与信息系统",
   number:"172210409226"
  },

  //绑定改变个人信息的函数
   changemodels:(event)=>{
    //使用event.target.value拿到点击 按钮事件传输过来的id
    //form-item1为学院
    //form-item2为专业
    //form-item3为学号
     if (event.target.id === "form-item1"){
       wx.navigateTo({
         url: '../changemodels/college/college',
         data:"学院"
       })
     }

  }



})

