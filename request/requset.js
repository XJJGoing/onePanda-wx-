//这里放入小程序的各种请求
const server = 'http://129.204.208.59:3000/';

//请求获取登录的接口
const openid = `${server}api/openid`;

//请求会话的api
const session = `${server}session`;

module.exports = {
  openid:openid,
  session:session  
}
