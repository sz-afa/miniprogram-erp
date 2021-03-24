// pages/setting/setting.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Object:{
      avatarurl: '',
      username: "大铁锤",
      phone: "16625502282",
      effectivedate: "永久免费"
    },
    newPhone: '',
    popupShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.request({
      url: app.globalData.userUrl+'user/getUserInfo',
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data.data)
          let _obj = _this.data.Object;
          let {avatarurl, ctime, mobile, nickname} = res.data.data
          _obj.avatarurl = avatarurl
          _obj.ctime = ctime.substring(0,10)
          _obj.phone = mobile
          _obj.username = nickname
          _this.setData({
            Object: _obj
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(val){
    console.log(val.detail)
    let reg = new RegExp("^[0-9]*$");
    if(reg.test(val.detail)){
      this.setData({
        newPhone: val.detail
      })
    }else{
      this.setData({
        newPhone: ''
      })
    }

  },
  changePhone(){
    this.setData({
      popupShow: true
    })
  },
  popupClose(){
    this.setData({
      popupShow: false,
      newPhone: ''
    })
  },
  submit(){
    let _newPhone = this.data.newPhone
    let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    if(reg.test(_newPhone)){
      var _this = this
      let _obj = _this.data.Object
      wx.request({
        url: app.globalData.userUrl+'user/updatePhone?phone='+_newPhone,
        method: 'GET',
        header: {
            'token': app.globalData.jwtToken,
        },
        success: function(res){
          if(res.data.code == 1){
            console.log(res.data)
            _obj.phone = _newPhone
            _this.setData({
              popupShow: false,
              Object: _obj
            })
          }
        }
      })

    }else{
      console.log('不是手机')
      this.setData({
        popupShow: false
      })
    }
  }
})