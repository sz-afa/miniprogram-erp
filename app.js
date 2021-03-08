//app.js
const app = getApp()

App({
  onLaunch: function () {
    // 展示本地存储能力
    this.globalData.jwtToken = wx.getStorageSync('jwtToken') || ''
    this.globalData.userSetting = wx.getStorageSync('userSetting') || null
    if(this.globalData.userSetting == null){
      console.log('用户设置数据为空！开始生成初始数据')
      this.globalData.userSetting = {
        hiddenZero: false
      }
    }
    this.globalData.userUrl = this.globalData.globalUrl+'miniprogram-user-service/'+this.globalData.apiVersion
    this.globalData.goodUrl = this.globalData.globalUrl+'miniprogram-good-service/'+this.globalData.apiVersion
  },
  globalData: {
    userInfo: null,
    jwtToken: '',
    // globalUrl:'http://192.168.31.247:9090/',
    globalUrl:'http://192.168.1.242:9090/',
    apiVersion: 'api/v1/'
  }
})