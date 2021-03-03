//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.globalData.jwtToken = wx.getStorageSync('jwtToken') || ''
  },
  globalData: {
    userInfo: null,
    jwtToken: '',
    // url: 'http://localhost:9090/miniprogram-user-service/'
    url: 'http://192.168.50.248:9090/miniprogram-user-service/'
  }
})