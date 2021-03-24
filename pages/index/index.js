//index.js
import Toast from '../../dist/toast/toast';
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello Wowrld',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

    wx.navigateTo({
      url: '../order/order?action=purchases'
    })
    

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if(app.globalData.jwtToken!=''){
      console.log('有token 认证token')
      wx.request({
        url: app.globalData.userUrl+'user/tokenAuth',
        method: 'POST',
        data: {
          'token': app.globalData.jwtToken
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res){
            console.log(res)
            if(res.data.code == 1){
              console.log('认证成功')
              wx.redirectTo({
                url: '../main/main'
              })
            }else{
              console.log('认证失败。删除token')
              wx.setStorageSync('jwtToken', '')
              app.globalData.jwtToken = ''
            }
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log('e',e)
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.myServerLogin(e.detail)
    }else{
      console.log(e.detail.errMsg)
      Toast({
        type: 'fail',
        mask: true,
        message: '没有授权!\n无法登录！'
      })
    }
  },
  myServerLogin: function(res){
    wx.login({
      success: res => {
        let code = res.code
        wx.getUserInfo({
          success: function(res){
            console.log(res)
            const {nickName, city, province, avatarUrl, gender=1, country='China'} = res.userInfo
            console.log('url',app.globalData.userUrl+'user/wxLogin')
            if(code){
              wx.request({
                url: app.globalData.userUrl+'user/wxLogin',
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
                  console.log('wxlogin',res)
                  const {code,data} = res.data
                  const {token, tempToken} = data
                  if(code == 1){
                    if(token == 0){
                      console.log(tempToken)
                      wx.redirectTo({
                        url: '../register_form/register_form?token='+tempToken
                      })
                    }else{
                      wx.setStorageSync('jwtToken', token)
                      app.globalData.jwtToken = token
                      wx.redirectTo({
                        url: '../main/main'
                      })
                    }
                  }
                }
              })
            }else{
              console.log("获取用户登录态失败！")
            }
          }
        })
      }
    })
  }
})
