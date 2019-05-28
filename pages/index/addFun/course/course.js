
const course = require('../../../../request/requset.js').course;
Page({
  data: {
    //学号
    key: '',
    //密码
    password: '',
    //密码的显示和隐藏
    isShowPassword: true,
   
    //备注
    bz:"",

    //可选择的学期
    term:"",

    //现在的学期
    nowTerm:"",

    //可选择的周次
    zc:"",

    //默认显示的zc
    show_zc:"第1周",
 
   //选择的学期
    index1:'',

   //选择的周次
    index2:'',

   //周次
    week:"",

    //课程的背景颜色 --最后一个为灰色
    bgcolor: ["#659BCC", "#076362", "#58CECE", "#FC71B5","#C9B1E5",
      "#F07E1E", "#747CBB", "#9C1DFA", "#FDFDD7","#D2D2D2" 
    ],
    
    //第一次处理后课程的信息。
    classinfo:[],

    //第二次处理后的课程信息。
    classinfo2:[],

  },

  //一开始的时候去获取可选择的学期、周次、和全部的课程的函数
  toGetAll(){
    let that = this;
    let stuData = {
      userName: wx.getStorageSync('student_Data').userName,
      userPassword: wx.getStorageSync('student_Data').userPassword
    }
    wx.showLoading({
      title: '获取中..',
      success:()=>{
        wx.request({
          url: course,
          data: stuData,
          dataType: 'json',
          method: 'GET',
          success: (res) => {
            wx.hideLoading();
            console.log(res.data)

            //获取到后台爬取的课程之后单独解析每个课程的周次
            if(res.data.course&&res.data.term&&res.data.zc){
              that.setData({
                term: res.data.term,
                zc:res.data.zc,
                bz:res.data.BZ.detail,
                nowTerm:res.data.nowTerm,
                show_zc:res.data.zc[res.data.now_zc],
                week:res.data.now_zc+1
              })
              that.sc_course(res.data.course,()=>{
                console.log("第一次处理的课程表",that.data.classinfo)
                let arry1 = that.sc_course2(that.data.classinfo,1)
                let arry2 = that.sc_course2(that.data.classinfo, 2)
                let arry3 = that.sc_course2(that.data.classinfo, 3)
                let arry4 = that.sc_course2(that.data.classinfo, 4)
                let arry5 = that.sc_course2(that.data.classinfo, 5)
                let allArry = [];
                    allArry.push(arry1,arry2,arry3,arry4,arry5)
                 that.setData({
                   classinfo2:allArry
                 })   
              })
            }
          },
          fail: () => {
            wx.showToast({
              title: '网络连接错误',
              duration: 1000,
              icon: 'loading'
            })
          }
        })
      }
    })
  },
 
  //生成课表(对课表的第一次处理--把周次弄成一个数组)
  sc_course(course,callback)
  {
    let courseArry = [];
    for(let i=0;i<course.length;i++){
      let zc_arry = [];    //最终的周次arry
      let str1 = course[i].zc.replace('\(周\)',"")
      //先生成周的数组
      let weekArry = str1.split(',');
      for(let j=0;j<weekArry.length;j++){  
        let weekArry2 = weekArry[j].split('-');
        if(weekArry2.length>1){                //周次，就是带有横杠的循环周次
           for(let k=parseInt(weekArry2[0]);k<=parseInt(weekArry2[1]);k++){
              zc_arry.push(k); 
           }
        }else{
          zc_arry.push(parseInt(weekArry2[0]))
        }
      }
      let insert_course = {};
          insert_course.number = course[i].number;
          insert_course.name = course[i].name ;
          insert_course.teacher = course[i].teacher;
          insert_course.zc = zc_arry;              //替换后的周次的数组
          insert_course.zc1 = course[i].zc;         //保留原来的周次，用作显示
          insert_course.xq = course[i].xq;
      if (course[i].name === "体育1" || 
          course[i].name === "体育2" || 
          course[i].name === "体育3" || 
          course[i].name === "体育4"){
            insert_course.room = ""
          }else{
            insert_course.room = course[i].room;
          }
          insert_course.zindex = -1;
          insert_course.jc = course[i].jc;
          insert_course.bg = "#D2D2D2";      //默认暗色,然后根据周次去点亮
          courseArry.push(insert_course);
    }
    this.setData({
      classinfo:courseArry
    })
    callback()
  },

  //对课表的第二次处理筛选处理
  sc_course2(course,k){

    //采用数组中嵌套数组的方法进行显示
    //即一个数组中有5个元素分别对应5个数组，每个数组表示一节即一行
    let courseArry = [];            //获取jc全部为k
    let courseArry2 = [];           //获取jc为k并且排序好的jc为一的课程，且改变色后
    for(let i = 0;i<course.length;i++){
      if(course[i].jc===k){
        courseArry.push(course[i])
      }
    }
    console.log("排序前",courseArry)
    let item;
    for(let i = 0;i<courseArry.length;i++){
      for(let j=0;j<courseArry.length;j++){
        if(courseArry[i].xq===courseArry[j].xq){
          if(courseArry[i].zc[0]<courseArry[j].zc[0]){
             item = courseArry[j];
             courseArry[j] = courseArry[i];
             courseArry[i] = item
          }
        }
      }
    }
   
    //再次分别获取星期几的前几位
    let t1 = [];
    let t2 = [];
    let t3 = [];
    let t4 = [];
    let t5 = [];
    let t6 = [];
    let t7 = [];

    //将排序后的课程进行分离存入上面
    for(let i=0;i<courseArry.length;i++){
       switch(courseArry[i].xq){
         case 1:
           t1.push(courseArry[i])
           break;
         case 2:
           t2.push(courseArry[i])
           break;
         case 3:
           t3.push(courseArry[i])
           break;
         case 4:
           t4.push(courseArry[i])
           break;
         case 5:
           t5.push(courseArry[i])
           break;
         case 6:
           t6.push(courseArry[i])
           break;
         case 7:
           t7.push(courseArry[i])
           break;            
       }
    }
    
    //逐步添加，为空的时候为没定义
    courseArry2.push(t1[0])
    courseArry2.push(t2[0])
    courseArry2.push(t3[0])
    courseArry2.push(t4[0])
    courseArry2.push(t5[0])
    courseArry2.push(t6[0])
    courseArry2.push(t7[0])
   
    console.log("变色前", courseArry2)
    console.log("当前周次",this.data.week)
    
   //为所在的周次的课程上色
   for(let i=0;i<courseArry2.length;i++){
      if(courseArry2[i]&&courseArry2[i].zc.indexOf(this.data.week)>=0){
        //有课程并且该课程在该周存在的时候 indexof未找到会返回 -1
            courseArry2[i].bg = this.data.bgcolor[i];     //亮色
      }else if(courseArry2[i]&&courseArry2[i].zc.indexOf(this.data.week)<0){ 

        //存在课程但是该课程，但是该课程不是本周的时候，进行寻找classinfo用时候有该jc、且为本周的课程、并且为该星期、有的就直接进行替换 、因为第一周获取的已经是全部的课程了，所以不会再增加任何课程了。只有替换。

        for(let j =0;j<this.data.classinfo.length;j++){
          if (this.data.classinfo[j].jc===k&&   
             this.data.classinfo[j].zc.indexOf(this.data.week)>=0&&
             courseArry2[i].xq === this.data.classinfo[j].xq
            ){
                courseArry2[i] = this.data.classinfo[j];
                courseArry2[i].bg = this.data.bgcolor[i]
             }
        } 

      } 
    }
      console.log("变色后", courseArry2)    
      return courseArry2  //返回处理后的数组  
  },


 //绑定用户选择学期
  changeTerm(e){
    console.log(e.detail.value);
    this.setData({
      index1:e.detail.value,
      nowTerm:this.data.term[e.detail.value]
    })
    
    let that = this;
    //获取的学生的信息
    let stuData = wx.getStorageSync('student_Data');
    stuData.term = this.data.term[e.detail.value];
    wx.showLoading({
      title: '获取中...',
      success:()=>{

        //发送请求
        wx.request({
          url: course,
          method: "POST",
          dataType: 'json',
          data: stuData,
          success:res=>{
            wx.hideLoading();
              if (res.data.course&&res.data.BZ) {
                that.setData({
                  bz: res.data.BZ.detail
                })
                that.sc_course(res.data.course, () => {
                  let arry1 = that.sc_course2(that.data.classinfo, 1)
                  let arry2 = that.sc_course2(that.data.classinfo, 2)
                  let arry3 = that.sc_course2(that.data.classinfo, 3)
                  let arry4 = that.sc_course2(that.data.classinfo, 4)
                  let arry5 = that.sc_course2(that.data.classinfo, 5)
                  let allArry = [];
                  allArry.push(arry1, arry2, arry3, arry4, arry5)
                  that.setData({
                    classinfo2: allArry
                  })
                })
              }else{
                that.setData({
                  classinfo2:"",
                  bz:"",
                })
              }
          }
        })
      },

      fail:()=>{
         wx.showToast({
           title: '网络错误...',
           duration:500,
           icon:'loading'
         })
      }
    })
    
  },

//绑定用户更换周次的时候
 changeZc(e){
   console.log(e.detail.value)
   let choose = e.detail.value;
   let arry = [];

   //改变周次的时候一开始将全部的课程的颜色变回灰色，
   for(let i = 0;i<this.data.classinfo.length;i++){
     arry[i] = this.data.classinfo[i];
     arry[i].bg = "#D2D2D2";
   }
   this.setData({
     week:parseInt(choose)+1,
     index2:choose,
     classinfo:arry,
     show_zc:this.data.zc[choose]
   })
   
   let arry1 = this.sc_course2(this.data.classinfo, 1)
   let arry2 = this.sc_course2(this.data.classinfo, 2)
   let arry3 = this.sc_course2(this.data.classinfo, 3)
   let arry4 = this.sc_course2(this.data.classinfo, 4)
   let arry5 = this.sc_course2(this.data.classinfo, 5)
   let allArry = [];
   allArry.push(arry1, arry2, arry3, arry4, arry5)
   this.setData({
     classinfo2: allArry
   })   
   
 },

 //显示用户点击的具体的课程信息
 detail(e){
   console.log(e);
   if(e.currentTarget.id!=="++++")
   { //当id存在的时候
   let str = e.currentTarget.id.split('+')
   console.log(str)
   let name = str[0];
   let room = str[1];
   let teacher = str[2];
   let number = str[3];
   let zc = str[4];
   wx.showModal({
     title: '课程信息',
     content: `课程号：${number}\r\n名称：${name}\r\n 老师:${teacher}\r\n教室:${room} \r\n周次:${zc}`,
   })
   }else{
     return
   }
 },
  

  onShow() {
    this.toGetAll();
  },
 
})