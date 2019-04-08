
//获取全局的变量
const app = getApp()
const chooseInfo = require('../../request/requset').chooseInfo
//引用一下 clock页面的js文件，因为要用里面的data数据
Page
  ({
    data: {
      item: "",
      //定义index,即为选中的下标
      index: "",
      major: "",
      kind: "",
      book: "",

      //设置第一部分的高度
      first_Height: 400,
      //设定一个下面部分的宽度
      second_Height: 0,
      arry1:["选择题","判断题","简答题"],
      arry2:["暂无书籍"],
      middle: []

    },

    onLoad(option) 
    {
      //这里使用that的原因 是因为在微信小程序中 使用官方的api的时候，this指针作用域会改变
      let that = this
      //获得点击的item
      this.setData({
        item: option.item
      }),

        //获取系统信息
        wx.getSystemInfo({
          success: function (res) {
            that.setData({ second_Height: res.windowHeight - that.data.first_Height })
          }
        })

      //对选中进来的进行判断
      if (this.data.item == "专业") {
        this.getInfo("专业",(data)=>{
          this.toSort(data.arry)
        })
      }
      else if (this.data.item == "书籍") 
      {
        let pages = getCurrentPages()
        let currentPages = pages[pages.length - 1];
        let prePages = pages[pages.length - 2];
        if (prePages.data.major == "" || prePages.data.major == "请选择专业") {
          prePages.setData({
            major: "请选择专业"
          })
          wx.navigateBack({
            delta: 2
          })
        }
        else {
          //用判断出来的专业，向服务端进行请求
            this.getInfo("书籍",(data)=>{
             if(data.arry.length==0){
               //this.toSort(this.data.arry2)
               this.setData({
                 middle:this.data.arry2
               })
             }else{
               this.toSort(data.arry)
             }

          })
        }

      }

      else if (this.data.item == "题型") {
        //获取前面的页面
        let pages = getCurrentPages()
        let currentPages = pages[pages.length - 1];
        let prePages = pages[pages.length - 2];
        if (prePages.data.book == "" || 
            prePages.data.book == "请选择书籍" ||  
            prePages.data.book =="暂无书籍"
            ) {
          prePages.setData({
            book: "请选择书籍"
          })
          wx.navigateBack({
            delta: 2
          })
        }
        else {
          //将书籍赋值给中间数组
          currentPages.setData({
            middle: this.data.arry1
          })
        }
      }
    },
   

   ////从服务端获取所选择的信息
   getInfo(choose,callback)
   {
     let pages = getCurrentPages()
     let currentPages = pages[pages.length - 1];
     let prePages = pages[pages.length - 2];

     let item = {
       item: choose,
       major:prePages.data.major,
       book:prePages.data.book,
       kind:prePages.data.kind
     }
     wx.request({
       url: chooseInfo,
       method:"GET",
       dataType:'json',
       data: item,
       success:(res)=>
       {
          callback(res.data)
       }
     })
   },

   //实现将返回的数组进行分类存入中间键中
   toSort(data)
   {
     let aa = [];
     for(let i=0;i<data.length;i++)
       aa[i] = data[i].name;
     this.setData({
       middle:aa
     })
   },


    /*picker选择器的绑定改动的函数*/
    bindPickerChange(e) {
      //生成新的变量，并改变课程的值
      this.setData({
        index: e.detail.value
      })
    },

    //表单提交函数
    commit_1(e) {
      //将提交上来的表单数据，choose选中的数据，并且跳转到之前的页面使用getCurrentPages API
      //获取到数据
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      let prePage = pages[pages.length - 2]
      let choose = e.detail.value.choose

      //判断选中的item
      if (this.data.item == "专业") {
        prePage.setData({
          major: choose
        })
      }

      else if (this.data.item == "书籍") {
        prePage.setData({
          book: choose
        })
      }

      else if (this.data.item == "题型") {
        prePage.setData({
          kind: choose
        })
      }
      wx.navigateBack({
        delta: 2
      })
    }
  })

