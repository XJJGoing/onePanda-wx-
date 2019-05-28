const wechat = require('./utils/wechat.js')
const insert_student = require('./request/requset.js').insert_student
App
({
    //发送请求的登录的函数
    stu_login(student_Data, callback) {
      wx.showLoading({
        title: '登录中...',
        success: () => {
          wx.request({
            url: insert_student,
            method: 'GET',
            dataType: 'json',
            data: student_Data,
            success: (res) => {
              wx.hideLoading();
              console.log('从服务端返回来的数据',res.data)
              if (res.data.msg === '0') 
              {
                //并且移出本地存储的账号和密码(这样也是为了后面用户改密码的时候使用)
                wx.removeStorageSync('student_Data')
                wx.removeStorageSync('Stu_cookie')
                let msg = '0';
                callback(msg)
              } else if (res.data.cookie) {
                wx.setStorageSync('student_Data', student_Data);
                let student_Info = {
                  xy: res.data.xy,
                  major:res.data.major,
                  number:res.data.number
                }
                wx.setStorageSync('student_Info', student_Info);
               //wx.setStorageSync('Stu_cookie', res.data);
                let msg = '1';
                callback(msg);
              }
            }
          })
        }
      })
    },

})

