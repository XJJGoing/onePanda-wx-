const app = getApp()
//引入登录的加载文件
const logs = require('../logs/logs.js')
let college = this.data.college
let major = this.data.major
let number = this.data.number
Page
({
  data:{
   college:"",
   major:"",
   number:""
  },
  //加载也秒的时候赋值
   onLoad(options)
   {
     console.log(options.value)
   },
})

