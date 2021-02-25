//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    //登录
    wx.login({
      success: res => {
        let code = res.code
        wx.getUserInfo({
          success: function(res){
            console.log(res)
            const {nickName, city, province, avatarUrl, gender, country} = res.userInfo
            // let nickname = res.userInfo.nickName;
            // let avatarurl = res.userInfo.avatarUrl;
            // let gender = res.userInfo.gender;
            // let country = res.userInfo.country;
            if(code){
              wx.request({
                url: 'http://localhost:9001/api/v1/user/wxLogin',
                method: 'POST',
                data: {
                  'nickname': nickName,
                  'avatarurl': avatarUrl,
                  'gender': gender,
                  'code': code,
                  'country': country,
                  'city': city,
                  'province': province
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res){
                  console.log('success')
                }
              })
            }else{
              console.log("获取用户登录态失败！")
            }
          }
        })
        
      }
    })

  },
  globalData: {
    userInfo: null,
    jwtToken: ''
  }
})