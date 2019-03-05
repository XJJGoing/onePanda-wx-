const app = getApp();
Page
({
  data:{
  },
  //反馈问题的提价函数
  commit_1(e)
  {
    //这里首先提交到服务端上面，并且存入到数据库当中
    //这里增加对空消息的检索,为空消息的时候不提交到服务端
    if(e.detail.value.msg ===" ")
    {
      
    }
    //console.log(e.detail.value)
    //这里就是一些模态窗口的设置
    wx.showModal({
        title: '发送成功',
        content: '感谢您对暂时没有名字的支持',
        confirmText:"继续反馈",
        cancelText:"以后再说",
        success:function(res)
        {
          if(res.cancel)
          {
            wx.navigateBack({
              delta:2
            })
          }
        }
      })
  }

})