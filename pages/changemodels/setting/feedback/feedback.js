const app = getApp();
//引入接口
const feedback = require('../../../../request/requset.js').feedback;
Page
({
  data:{

  },
  //反馈问题的提价函数
  commit_1(e)
  {
    //这里增加对空消息的检索,为空消息的时候不提交到服务端
    if (e.detail.value.msg == "")
    {
      wx.showModal({
        title: '不能发送空消息哦！',
      })
    }
    else if (e.detail.value.msg !== "")
    {
      let feedback_data = {
        msg: e.detail.value.msg,
        msg1: e.detail.value.msg1
      }
      wx.request({
        url: feedback,
        data: feedback_data,
        dataType: 'json',
        method: 'GET',
          success: (res) => {
            wx.showModal({
              title: '发送成功',
              content: '感谢您对暂时没有名字的支持',
              confirmText: "继续反馈",
              cancelText: "以后再说",
              success: function (res)
              {
                //判断用户的点击按钮
                if (res.cancel)
                {
                  wx.navigateBack({
                    delta: 2
                  })
                }
              }
            })
          }
      })
    }
}

})