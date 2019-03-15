/**
 * Promise化小程序接口
 */
const openid = require('../request/requset.js').openid;
class Wechat {
  /**
   * 登陆
   * @return {Promise} 
   */
  static login() {
    return new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
  };

  /**
   * 获取用户信息
   * @return {Promise} 
   */
  static getUserInfo() {
    return new Promise((resolve, reject) => wx.getUserInfo({ success: resolve, fail: reject }));
  };

  /**
   * 发起网络请求*/
  static request(url, params, method = "GET", type = "json") {
     console.log("向后端传递的参数", params);
     return new Promise((resolve, reject) => {
      let opts = {
        url: url,
        data: Object.assign({}, params),
        method: method,
        header: { 'Content-Type': type },
        success: resolve,
        fail: reject
      }
      console.log("请求的URL", opts.url);
      wx.request(opts);
    });
  };

  /**
   * 获取微信数据,传递给后端
   */
  static getCryptoData() {
    let code = "";
    return this.login()
      .then(data => {
        code = data.code;
        console.log("login接口获取的code:", code);
        return this.getUserInfo();
      })
      .then(data => {
        //传递两个参数过去，一个为code(这个要以对象的形式传)，另外一个为userInfo
        console.log("getUserInfo接口", data);
        let obj = {
          js_code:code,
          nickName:data.userInfo.nickName,
          avatarUrl:data.userInfo.avatarUrl,
          gender:data.userInfo.gender,
          city:data.userInfo.city,
          data:data
        };
        return Promise.resolve(obj);
      })
      .catch(e => {
        console.log(e);
        return Promise.reject(e);
      })
  };

  /**
   * 从后端获取openid
   * @param {object} params 
   */
  static getMyOpenid(params) {
    let url = openid;
    return this.request(url, params, "POST", "application/x-www-form-urlencoded");
  };
}
module.exports = Wechat;