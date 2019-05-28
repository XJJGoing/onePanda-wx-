//获取全局的变量
const userInfo = require('../../../request/requset.js').userInfo;
const app = getApp()
Page
  ({
    data: {
      item: "",
      //定义index,即为选中的下标
      index:"",
      college: "",
      major: "",
      number: "",

      //设置第一部分的高度
      first_Height: 400,
      //设定一个下面部分的宽度
      second_Height: 0,

      //添加arry1以及arry2的时候请1 1对应（后面的程序是这样设计的）
      arry1: ["经济管理学院", 
              "电信学院", 
              "土木工程与建筑学院", 
              "计算机学院",
              "粮食学院"
              ],
      arry2:
       [
          [
            "信息管理与信息系统",
            "财务管理",
            "会计学",
            "工商管理",
            "中澳工商管理",
            "工业工程",
            "金融工程",
            "经济学",
            "物流管理"
          ],
          [
            "电气工程及其自动化",
            "电子信息科学与技术",
            "电子信息工程",
            "水声工程",
            "测控技术与仪器",
            "自动化"

          ],
          [
            "建筑学",
            "土木工程",
            "工程管理"
          ],
          [
            "软件工程",
            "物联网应用",
            "计算机科学与应用"
          ],
          [
            "粮食工程",
            "食品质量与安全"
          ]
      ],

      //设置一个中间数组用来定位选中的item之后显示的东西
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
      if(this.data.item === "学院")
       {
          this.setData({
            middle:this.data.arry1
          })
       }
       //判断专业
       else if(this.data.item === "专业" )
       {
          //获取前面的页面
          let pages = getCurrentPages()
          let currentPages = pages[pages.length-1];
          let prePages = pages[pages.length-2];

          //判断是否为空,//为空的时候跳转页面回去上一页面，并且将colleg的信息改为请选择，学院

          if (prePages.data.college == "")
          {
              prePages.setData({
                college: "请选择学院"
              })
              wx.navigateBack({
                delta: 2
              })
          }
          else
          {
            //判断出来之前选择的学院的名称,用来确定第二个数组要传输哪个参数过去
            let mm ;
            for(let i=0;i<this.data.arry1.length;i++)
            {
                if(this.data.arry1[i] === prePages.data.college)
                {mm = i ;break;}
            }
            //将专业赋值给中间数组
            currentPages.setData({
              middle:this.data.arry2[mm]
            })
          }
       }
    },


    /*picker选择器的绑定改动的函数*/
    bindPickerChange(e) 
    {
      //生成新的变量，并改变college的值
      this.setData({
        index: e.detail.value
      })
    },

    //表单提交函数
     commit_1(e)
     {
       //将提交上来的表单数据，choose选中的数据，并且跳转到之前的页面使用getCurrentPages API
       //获取到数据
       //console.log(e.detail.value.choose)
       let pages = getCurrentPages()
       let currentPage = pages[pages.length-1]
       let prePage = pages[pages.length-2]
       let choose = e.detail.value.choose
       
       //判断选中的item
       if (this.data.item === "学院" )
       {
          prePage.setData({
            college:choose
          })
       }
       else if(this.data.item === "专业")
       {
         prePage.setData({
           major:choose
         })
       }
       else if(this.data.item === "学号")
       {
         prePage.setData({
           number:choose
         })
       }
    /*这里同时也要添加要服务端即添加reques请求,并且将数据存储到本地,判断消息不全为空的时提交*/
       if(prePage.data.college&&prePage.data.number&&prePage.data.major)
       {
         let userdata = {
           openid:wx.getStorageSync('openid'),
           college:prePage.data.college,
           major:prePage.data.major,
           number:prePage.data.number,
         }
           wx.request({
             url: userInfo,
             data: userdata,
             dataType: 'json',
             method: 'GET',
             success: (res) => {
               console.log(res.data)
             }
           })
       }
      wx.navigateBack({
        delta:2
      })
   },
   
   //存储原来的数据以方便修改
   todata()
  {
    let userdata = wx.getStorageSync('userdata');
    if(userdata!== '')
    {
      this.setData({
        college: userdata.college,
        major: userdata.major,
        number: userdata.number
      })
    }
  },

  })


