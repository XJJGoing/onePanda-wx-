const insert_student = require('../../../../request/requset.js').insert_student;
const exam = require('../../../../request/requset.js').exam;
const stu_login = getApp().stu_login;  //登录的函数
Page({
  data: {
    userName: '',
    userPassword: '',

    //密码的显示和隐藏
    isShowPassword: true,

    //用来判断登录成功后重定向的界面
    item:'',
  },

  formSubmit(e) {
    var objData = e.detail.value;
    if (objData.userName && objData.userPassword) 
    {
      let student_Data = {
          userName:objData.userName,
          userPassword:objData.userPassword
      }

      //登录回调函数
      stu_login(student_Data,(msg)=>{
        console.log(msg)
        //msg等于1表示登录成功
       if(msg === '1')
       {
         switch (this.data.item) 
         {
           case '1':
             wx.redirectTo({
               url: '../course/course',
             })
             break;
           case '2':
             wx.redirectTo({
               url: '../grade/grade',
             })
             break;
           case '3':
             wx.redirectTo({
               url: '../extra-act/extra-act',
             })
             break;
         }
       }

       else if (msg === '0') {  //封装的stu_login的跳转服务端验证登录的函数对客户端内存已经做出处理
       wx.showToast({
           title: '学号或密码错误',
           icon: 'none',
           image: '',
           duration: 1000
         })
       }

      })
    }
 },
 
  onLoad(option){
    //获取本地数据,这里的Stu_cookie只是作为一个状态量;
    let student_Data = wx.getStorageSync('student_Data');
    console.log("选择的id",option.id)
    let id = option.id;
    this.setData({
      item:id
    })
    if(student_Data){
      console.log(option.id)
      switch(option.id)
      {
        case '1':
        wx.redirectTo({
          url: '../course/course',
        })
        break;
        case '2':
        wx.redirectTo({
          url: '../grade/grade',
        })
        break;
        case '3':
        wx.redirectTo({
          url: '../extra-act/extra-act',
        })
        break;
      } 
    }
  },
  
  //学号有内容显示清除按钮
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

  //密码显示与隐藏切换
  toggleShowPassword: function (e) {
    this.setData({
      isShowPassword: !this.data.isShowPassword
    });
  },

  //清空账号函数
  eliminate: function () {
    this.setData({
      userName: ""
    })
  },

})