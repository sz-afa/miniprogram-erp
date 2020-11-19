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
        let code = res.code
        wx.getUserInfo({
          success: function(res){
            let nickname = res.userInfo.nickName;
            let avatarurl = res.userInfo.avatarUrl;
            let gender = res.userInfo.gender;
            if(code){
              wx.request({
                url: 'http://localhost:9001/api/vi/user/wxLogin',
                method: 'POST',
                data: {
                  'nickname': nickname,
                  'avatarurl': avatarurl,
                  'gender': gender,
                  'code': code
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res){
                  console.log('success');
                }
              })
            }else{
              console.log("获取用户登录态失败！");
            }
          }
        })
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})