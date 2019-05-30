const lines = require('../../request/requset.js').lines

//promise函数进行排名的流程控制
const line2 = (line)=>{
      return new Promise((resolve,reject)=>{
        for (let i = 1; i < line.length; i++) {
          for (let j = i; j > 0; j--) {
            if (line[i].time === line[j - 1].time &&
              line[i].days > line[j - 1].days
            ) {
              let temp = {};
              temp = line[i];
              line[i] = line[j];
              line[j] = temp;
            }
          }
        }
        reject(line)
    })
}


Page({
  data:{
    //暂存一个就是进行全部排名后的
    beforeInline:"",

    line:"",
    my:"",
    myOrder:"",
    color:"black",
    selectColor:'#3AA94D',
    
    colorItem1:"#3AA94D",
    colorItem2:"",
    colorItem3:"",
    width:"",
    height:"",

    //需要跳过的个数
    skip:0,

  },
  onPullDownRefresh(){
   wx.showNavigationBarLoading({
     success:()=>{
       wx.hideNavigationBarLoading();
       wx.stopPullDownRefresh();
       this.onLoad();
     },
     fail:()=>{
       wx.showToast({
         title: '刷新失败',
         icon:'../public/icon/icon1.png',
         duration:1000
       })
     }
   });
  },

  onLoad(){
    this.getSystem();

    let that = this;
    let skip = {
        skip:this.data.skip
    }

    wx.showLoading({
      title: '获取中',
      success:()=>{
        wx.showToast({
          title: '获取成功',
          icon:'../public/icon/icon2.png',
          duration:500,
        })
        that.request(that.data.skip,'GET',(data)=>{
          that.getLine(data.line, (line) => {
            //再次根据学习的天数进行二次排名
            that.getLine2(line,(line)=>{
              that.setData({
                beforeInline:line,
                line:line
              })
              that.getMyLine(line)
            })
           })
        })
       }
    })
  },

  //获取系统的宽和高的函数
  getSystem(){
     wx.getSystemInfo({
       success:(res)=>{
         this.setData({
           width:res.windowWidth,
           height:res.windowHeight
         })
       }
     })
  },

  //获取我的排名的函数
  getMyLine(line){
    let that = this;
    
    //这个变量用来判断获取的数组是否存在本机的openid，没有的judge为false
    let judge = false;
    if(wx.getStorageSync('openid')){
       line.forEach((item,index)=>{
        if(wx.getStorageSync('openid') === item._id){
          that.setData({
            my:item,
            myOrder:index+1
          })
          judge = true;
        }
        else if(!judge){
          that.setData({
            my:"",
            myOrder:""
          })
        }
      })
    }
  },


  //进行排名的函数
  getLine(line,callback){
    //形成一个新的数组用作返回
    let newLine = [];
            //根据获取到的进行名词排名
            for(let i = 1 ;i<line.length;i++){
              for(let j = 0;j<i;j++){
                if(parseInt(line[i].time)>parseInt(line[j].time)){
                  let temp;
                  temp = line[i];
                  line[i] = line[j];
                  line[j] = temp;
                }
              }
            }
      callback(line)
  },

  //二次排名(根据天数排名)
  getLine2(line,callback){
    for (let i = 1; i < line.length; i++) {
      for (let j = 0; j < i; j++) {
        if (line[i].time === line[j].time&&
            line[i].days>line[j].days         
        ) {
          let temp = {};
          temp = line[i];
          line[i] = line[j];
          line[j] = temp;
        }
      }
    }
    callback(line)
  },

  //按照情况排名的函数
  change(item){
    let arry = [];
      if (item === "全部") {
        this.setData({
          line: this.data.beforeInline,
          colorItem1:this.data.selectColor,
          colorItem2:this.data.color,
          colorItem3:this.data.color
        })
        this.getMyLine(this.data.beforeInline)
      }

      else if (item === "学院") {
        if (wx.getStorageSync('student_Info').xy) {
          for (let i = 0; i < this.data.beforeInline.length; i++) {
            if (this.data.beforeInline[i].college[0] === wx.getStorageSync('student_Info').xy) {
              arry.push(this.data.beforeInline[i])
            }
            if (i === this.data.beforeInline.length - 1) {
              this.setData({
                line: arry,
                colorItem1: this.data.color,
                colorItem2: this.data.selectColor,
                colorItem3: this.data.color
              })
              this.getMyLine(arry);
            }
          }

        } else {
          wx.showToast({
            title: '请完善您的信息',
            image: '../public/icon/icon1.png',
            duration: 1000
          })
        }
      }

      else if (item === "专业") {
        if (wx.getStorageSync('student_Info').major) {
          for (let i = 0; i < this.data.beforeInline.length; i++) {
            if (this.data.beforeInline[i].major[0] === wx.getStorageSync('student_Info').major) {
              arry.push(this.data.beforeInline[i])
            }
            if (i === this.data.beforeInline.length - 1) {
              this.setData({
                line: arry,
                colorItem1: this.data.color,
                colorItem2: this.data.color,
                colorItem3: this.data.selectColor
              })
              this.getMyLine(arry);
            }
          }

        } else {
          wx.showToast({
            title: '请完善您的信息',
            image: '../public/icon/icon1.png',
            duration: 1000
          })
        }
      }
  },

  //改变排名方式的函数
  changeOrder(e){

    //按照情况排名的函数
    let choose = e.currentTarget.id;
    switch(choose){
       case "全部":
           this.change("全部")
        break;
       case "学院":
           this.change("学院")
          break;
       case "专业":
          this.change("专业")
           break;          
    } 
  },
  
  //获取更多的排名的函数
  toMore(){
    console.log("进来了")
  },

  //请求的函数
  request(skip1,method,callback){
    let skip = {
      skip:skip1
    }
    wx.request({
      url: lines,
      data:skip,
      method:method,
      dataType:'json',
      success:(res)=>{
       wx.hideLoading()
       //console.log(res)
       callback(res.data)
      }
    })

  } 
})
