const exam = require('../../../../request/requset.js').exam
const app = getApp().stu_login;
Page({
   data:{
     date_arry:"",
     index:"",
     item:"请选择学期",
     exam_arry:"",
     term_number:"",
     term_jd:'',
     all_jd:'',
   },
   onShow() {
    this.toGetDate()
   },

  bindPickerChange(e){
    let index = e.detail.value;
    this.setData({
      index:e.detail.value,
      item:this.data.date_arry[index]
    })
    if(this.data.item){
      this.toGetGrade();
    }
  },

  //页面加载的时候发送，请求获取可选时间的函数
  toGetDate(){
    let that = this;
    let stuData = {
      userName: wx.getStorageSync('student_Data').userName,
      userPassword: wx.getStorageSync('student_Data').userPassword
    }
    wx.request({
      url: exam,
      method: 'GET',
      data: stuData,
      dataType: "json",
      success: (res) => {
        //登录失败的时候(密码修改，清空本机记录的缓存)
        if (res.data.msg) {
          wx.removeStorageSync('student_Data');
          wx.redirectTo({
            url: '../enter/enter',
          })
        } else {
          let arry = []
          console.log(res.data.data);
          //对可选日期进行处理
          for(let i=0 ;i<10;i++){
            if(i==0){
              arry[i] = 'all';
            }else{
              arry[i] = res.data.data[i]
            }
          }
          that.setData({
            date_arry:arry
          })
        }
      }
    })
  },

  //根据具体选定的时间到服务端获取成绩
  toGetGrade(){
    let that = this;
    let stuData = {
      userName: wx.getStorageSync('student_Data').userName,
      userPassword: wx.getStorageSync('student_Data').userPassword,
      item:this.data.item
    }
    wx.showLoading({
      title: '查询中...',
      success:()=>{
        wx.request({
          url: exam,
          method: 'POST',
          data: stuData,
          dataType: "json",
          success: (res) => {
            wx.hideLoading();
            console.log(res);
            if (res.data.msg) {  //登录失败，用户可能已经修改过密码
              wx.removeStorageSync('student_Data');
              wx.redirectTo({
                url: '../enter/enter',
              })
            } else {

              let arry = [];
              console.log(res.data.exam)
              for (let i = 0; i < res.data.exam.length; i++) {
                let obj = {
                  number: res.data.exam[i].number,
                  name: res.data.exam[i].name,
                  xf: res.data.exam[i].xf,
                  grade: res.data.exam[i].grade
                }
                arry.push(obj)
              }

              //计算学期课程的数目、学期的绩点、综合全部学期的绩点
              let count = 0;
              let count_xf = 0;
              if (arry.length) {
                for (let i = 0; i < arry.length; i++) {
                  let cj = 0;
                  let xf = 0;
                  switch (arry[i].grade) {
                    case '优':
                      cj = 95;
                      break;
                    case '良':
                      cj = 85;
                      break;
                    case '中':
                      cj = 75;
                      break;
                    case '及格':
                      cj = 65;
                      break;
                    case '不及格':
                      cj = 0;
                      break;
                    case '通过':
                      cj = 75;
                      break;
                    case '不通过':
                      cj = 0;
                      break;
                    case '合格':
                      cj = 60;
                      break;
                    default:
                      cj = parseFloat(arry[i].grade);
                      break;
                  }

                  //对体育成绩做出处理
                  xf = arry[i].xf;
                  if (arry[i].name === '体育1' ||
                    arry[i].name === '体育2' ||
                    arry[i].name === '体育3' ||
                    arry[i].name === '体育4' ||
                    parseInt(arry[i].grade) < 60
                  ) {
                    cj = 0;
                    xf = 0;
                  }
                  //计算绩点：
                  let cj2 = parseFloat(cj);
                  count += parseFloat(xf) * ((cj2 / 10) - 5)
                  count_xf += parseFloat(xf);
                }
              }
              let middle_jd = parseFloat(count) / parseFloat(count_xf);
              let term_jd = middle_jd.toFixed(2)
              that.setData({
                exam_arry: arry,
                term_number: arry.length,
                term_jd: term_jd
              })
            }
          }
        })
      }
    }) 
 }
})