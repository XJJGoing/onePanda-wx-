const insert = require('../../../../../../request/requset.js').insert
Page
({
  data:{
    bookId:"",
    kind:["选择题","判断题","简答题"],
    index:"",
    //item 为0表示选择题 item为1表示判断题 item为2表示简答题
    item:"",
  },

  onLoad(options)
  {
    this.setData({
      bookId:options.bookId
    })
  },
  
  //选中的题型
  bindPickChange(e){
    console.log(e)
    let index = e.detail.value
    console.log("选中的类型",index)
    this.setData({
      index:index,
      item:index
    })
  },
  

  //绑定单选框的函数
  correctChoose(e){
   let correct = e.detail.value;
   return correct;
  },

  //绑定表单提交的函数（选择题）
  form_submit0(e){
        let that = this;
        let question = e.detail.value.question;
        let chooseA = e.detail.value.chooseA;
        let chooseB = e.detail.value.chooseB;
        let chooseC = e.detail.value.chooseC;
        let chooseD = e.detail.value.chooseD;
        let resolve = e.detail.value.resolve;
        let correct = e.detail.value.correct;
        if(this.data.bookId&&question&&chooseA&&chooseB&&correct&&this.data.item==0)
        {
         let insert_choose = {
           item:this.data.item,
           bookId:this.data.bookId,
           question:question,
           chooseA:chooseA,
           chooseB:chooseB,
           chooseC:chooseC,
           chooseD:chooseD,
           correct:correct,
           resolve:resolve
         }
          //发送请求
          wx.showLoading({
            title: '提交中...',
            success()
            {
              that.toInsert(insert, insert_choose, 'json', 'GET', (data) => {
                console.log(data)
              })
               wx.hideLoading()
               wx.showToast({
                 title: '提交成功',
                 icon:'success',
                 duration:1000
               })
            }
          })
        }
        else
        {
         wx.showModal({
           title: '请完善信息',
           content: '选择题AB两项必填写正确答案必须填写',
         })
        }
    },

    //绑定判断题提交的函数(判断题)
    form_submit1(e)
    {
      let that = this;
      let question = e.detail.value.question;
      let correct = e.detail.value.correct;
      if(this.data.item==1&&question&&correct)
      {
        let insert_choose = {
            item:this.data.item,
            bookId:this.data.bookId,
            question:question,
            correct:correct
        }
         
        //发送请求
        wx.showLoading({
          title: '提交中...',
          success() {
            that.toInsert(insert, insert_choose, 'json', 'GET', (data) => {
              console.log(data)
            })
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
      else
      {
        wx.showModal({
          title: '请完善信息',
          content: '必须有问题以及正确的答案',
        })
      }
    },

    //填空题的提交函数
    form_submit2(e)
    {
      let that = this;
      let question = e.detail.value.question;
      let correct = e.detail.value.correct;
      if(question&&correct&&this.data.bookId&&this.data.item==2)
      {
        let insert_choose = {
          item:this.data.item,
          bookId:this.data.bookId,
          question:question,
          correct:correct
        }
        
        //发请求
        wx.showLoading({
          title: '提交中...',
          success() {
            that.toInsert(insert, insert_choose, 'json', 'GET', (data) => {
              console.log(data)
            })
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }

      else
      {
          wx.showModal({
            title: '请完善信息',
            content: '必须有问题以及正确的答案',
          })
      }
    },


    //提交请求的函数,
    toInsert(url,data,dataType,method,callback)
    {
      wx.request({
        url: url,
        data:data,
        dataType:dataType,
        method:method,
        success:(res)=>{
         callback(res.data)
        }   
      })
    }

})