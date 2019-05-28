//引用时间调用函数
const utils = require('../../utils/util.js')
const partice = require('../../request/requset.js').partice
Page({
  data: {
    question:[],
    //做题的类型
    major:"",
    book:"",
    kind:"",
    //因为wxml中不支持字符串条件判断渲染,所以定义个kind_number
    kind_number:"",
    index: 0,
    correct:"",
    time:"",
    //options的个数
    options_lenght:"",
    //定义checked
    checked1:"",
    checked2:"",
    //定义input
    input:"",
    bc_default: '#FBFBFB',
    bc_select: '#98FB98',
    bc_correct:"F0F0F0",
    resolve:"",
    bcA: '',
    bcB: '',
    bcC: '',
    bcD:'',

    //作对的提和做错的题目的颜色
    color:"",
    trueColor:"#AAFE0C",
    falseColor:"#DC443B",

    //去判断是否有题目，没有的话就显示暂无题目
    tojudge:"",
  },
  
  //统计做题时间的函数
  timeing(date)
  {
    let arryDate = utils.formatTime2(date)
    //console.log(arryDate);
    let newDate = arryDate[0]*60+arryDate[1]*60+arryDate[2];
    this.setData({
      time:newDate
    })
  },

  //离开页面的监听函数,计算做题的时间,写在跳转函数中（异步问题）
  onLeave()
  {
    let oldTime = this.data.time;
    this.timeing(new Date());
    let newTime = this.data.time
    if(oldTime - newTime <= 60)
    {
       this.setData({
        time:1
       })
    }
    else
    {
        let insertTime = (oldTime-newTime)/60;
        this.setData({
          time:insertTime
        })
    }
  },

  //当页面加载的时候从数据库获取数据
   getData(major,book,kind,callback)
   {
     let that = this;
     this.setData({
       major:major,
       book:book,
       kind:kind
     })
     let particeDetail = {
       major:major,
       book:book,
       kind:kind
     }
     wx.showLoading({
       title: '获取题目中..',
       success:()=>
       {
         wx.request({
           url:partice,
           data:particeDetail,
           dataType:'json',
           method:'GET',
           success:(res)=>
           {
             wx.hideLoading();
             //获取到题目,并判断是否为空
           //  console.log(res.data.arry)
             if(res.data.arry.length){
               that.setData({
                 question: res.data.arry,
                 tojudge:true
               })
             }else{
               that.setData({
                 tojudge:false
               })
             }
             callback();
           }
         })
       }
     })  
   },

  onLoad(options)
  {
    let that = this;
    let kind = options.kind

    //统计时间,统计做题的时间
    this.timeing(new Date())
     if(kind == "选择题")
     {
       //获得题目(存在异步问题用回调函数解决)
       //减一因为options有个id
       this.getData(options.major, options.book, options.kind,()=>{
          //此方法用于返回一个对象中属性组成的数组
         let arry = Object.getOwnPropertyNames(that.data.question[that.data.index].options[0])
        // console.log(arry.length - 1);
         this.setData({
           kind_number: 1,
           options_lenght: arry.length - 1
         })
       })
     }

     //判断题
     else if(kind == "判断题")
     {
       this.getData(options.major, options.book, options.kind, ()=>{
         this.setData({
           kind_number: 2,
         })
       })
     }

     else if(kind == "简答题")
     {
       this.getData(options.major, options.book, options.kind, () => {
         this.setData({
           kind_number: 3,
         })
       })
     }
  },

  //对为各种题型的上下一题的函数
  forOptions(index)
  {
      //得到选择选项这个对象的属性并形成一个arry数组
      let arry = Object.getOwnPropertyNames(this.data.question[index].options[0])
      this.setData({
        index: index,
        bcA: this.data.bc_default,
        bcB: this.data.bc_default,
        bcC: this.data.bc_default,
        bcD: this.data.bc_default,
        correct: "",
        resolve: "",
        //选择题的长度
        options_lenght: arry.length - 1
      });
  },
  
  forJudge(index)
  {
    this.setData({
      index:index,
      correct:"",
      resolve:"",
      checked1:"",
      checked2:""
    })
  },

  forInput(index)
  {
    this.setData({
      index:index,
      correct:"",
      resolve:"",
      input:""
    })
  },

  //输入完成的函数
  finish_input()
  {
   if(this.data.input == this.data.question[this.data.index].correct){
     this.setData({
       correct:"恭喜你回答正确"
     })
   }else{
     this.setData({
       correct:this.data.question[this.data.index].correct
     })   
   } 
  },

  //下一题的函数
  nextQuestion() 
  {
    let that = this;
    let index = this.data.index+1;
    if(index <= this.data.question.length-1 )
    {
      if (this.data.kind_number == 1) {
        this.forOptions(index)
      } else if (this.data.kind_number == 2) {
        this.forJudge(index)
      }else{
        this.forInput(index)
      }
    }
    else {
      this.gotonext()
    }
  },
  

  //上一题的函数
  lastQuestion() 
  {
    let that = this;
    let index = this.data.index-1;
    if (index >= 0) 
    {
      if(this.data.kind_number ==1 ){
        this.forOptions(index)
      }else if(this.data.kind_number ==2 ){
        this.forJudge(index)
      }else{
        this.forInput(index)
      }
    }else{
      wx.showModal({
        title: "已经到顶了哦!",
      })
    }
  },

  btnOpClick(e){
    let that = this;
    let select = e.currentTarget.id;
    let answer = this.data.question[this.data.index].correct;
    switch(select)
    {
      case "A" :
        that.setData({
          bcA: that.data.bc_select,
          bcB: that.data.bc_default,
          bcC: that.data.bc_default,
          bcD:that.data.bc_default,
        })
        break;
      case "B": 
        that.setData({
          bcA: that.data.bc_default,
          bcB: that.data.bc_select,
          bcC: that.data.bc_default,
          bcD: that.data.bc_default,
        })
        break;
      case "C": 
        that.setData({
          bcA: that.data.bc_default,
          bcB: that.data.bc_default,
          bcC: that.data.bc_select,
          bcD: that.data.bc_default,
        })
        break;
      case "D":
        that.setData({
          bcA: that.data.bc_default,
          bcB: that.data.bc_default,
          bcC: that.data.bc_default,
          bcD: that.data.bc_select,
        })
        break;
    }
    if(select == answer){
      this.setData({
        correct:"恭喜你答对了",
        resolve:this.data.question[this.data.index].resolve
      })
    }else{
      this.setData({
         correct:answer,
         resolve: this.data.question[this.data.index].resolve
      })
    }
  },
  
  //判断题的单选框的函数
  change(e){
    let choose = e.detail.value
    let answer = this.data.question[this.data.index].correct
    let resolve = this.data.question[this.data.index].resolve
    if(choose == "true"){
      this.setData({
        checked1:true
      })
    }else{
      this.setData({
        checked2:true
      })
    }
    
    if(choose == answer)
    {
      this.setData({
        correct:"恭喜你答对了",
        resolve:resolve
      })
    }
    else
    {
      this.setData({
        correct:answer,
        resolve:resolve
      })
    }
  },


  //跳转函数
  gotonext() 
  {
    let that = this;
    wx.showModal({
      title: '是否提交',
      content: '结束本次将会对统计做题的时间，计入学习的时间',
      cancelText:"再看看",
      success(res)
      {
        if(res.confirm)
        {
          that.onLeave()
          //console.log(that.data.time)
          wx.redirectTo({
            url: '../result/result?time='+that.data.time,
          })
        }
      }
    })
  },

})
