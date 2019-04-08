const app = getApp()
const chooseInfo = require('../../../../../request/requset.js').chooseInfo
Page({
  data:{
    //item1为协议
    //item2为界面
    item1:"",
    item2:"",
    index:"",
    majors:"",
    books:"",
    kinds:["选择题","判断题","简答题"]
  },

  //获取数据库中所有的专业。
  getMajors(callback)
  {
    let major = [];
    let particeDetail = {
        item:"专业"
    }
    let that = this;
    wx.request({
      url: chooseInfo,
      data:particeDetail,
      dataType:'json',
      success:(res)=>{
       let arry = res.data.arry;
        for (let i = 0; i < arry.length;i++){
         major[i]=arry[i].name
       }
       callback(major)
    }
  })
 },

  //根据选中的专业已经拥有的书籍,并且设置书籍的ID
  getBooks(){
   let that = this;
   let particeDeatail = {
       major:this.data.majors[this.data.index],
       item:"书籍"
   }
   wx.showLoading({
     title: '获取书籍中...',
     success(){
       wx.request({
         url: chooseInfo,
         data: particeDeatail,
         dataType: 'json',
         method: 'GET',
         success: (res) => {
           wx.hideLoading()
           if(!res.data.arry[0]){
              wx.showToast({
                title: '暂无书籍',
                icon:'loading',
                duration:1500
              })
              that.setData({
                books:"",
              })
           }
           else{
              console.log(res.data.arry)
              let book = []
              for (let i = 0; i < res.data.arry.length; i++) {
                book[i] = res.data.arry[i]
              }
              that.setData({
                books: book,
              })
              console.log(that.data.books)
           }
         }
       })
     }
   })

},

  onLoad(){
   this.setData({
     item1:true,
     item2:false
   })
    this.getMajors((data)=>{
      this.setData({
        majors:data
      })
    })
  },

  //不同意的函数
  dischange(){
   this.setData({
     item2:false
   })
   wx.navigateBack({
     delta:2
   })
  },

  //同意的函数则进行页面的渲染
  change(){
   this.setData({
     item1:false,
     item2:true
   })
  },
  
  //绑定选择的专业并且改变其中的index下标
  bindPickChange(e)
  {
    console.log(e.detail.value)
    let index = e.detail.value
    this.setData({
      index:index
    })

    //0不能够通过if else语句所以这里使用+1
    if(this.data.index+1)
    {
       this.getBooks()
    }
   },

   //绑定跳转的函数：
   navigataor(e){
     console.log(e)
     let bookId;
     let bookName = e._relatedInfo.anchorTargetText;
     
     //遍历寻找booksId
      for(let i=0;i<this.data.books.length;i++){
        if(bookName == this.data.books[i].name)
          bookId = this.data.books[i]._id
      }
     wx.navigateTo({
       url: './insert_old/insert_old?bookId='+bookId,
     })
   }
})