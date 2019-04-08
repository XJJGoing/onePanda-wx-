Page({
data:
{
  url:"",
  detail:"",
  name:"",
},
onLoad(opiton)
{
  let data =opiton;
  this.toChange(data);
},

//改变状态的函数
toChange(data)
{
  this.setData({
    detail:data.detail,
    name:data.name,
  })
}

})