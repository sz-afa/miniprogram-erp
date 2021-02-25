// pages/register_form/register_form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sms: '',
    phone: '',
    errorMsg: '请输入正确的手机号',
    disableSendBtn: true
  },
  // 检查手机号
  checkNumber: function(value){
    let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (myreg.test(value.detail)) {
      this.setData({
        errorMsg: '',
        disableSendBtn: false
      })
    }else{
      this.setData({
        errorMsg: '请输入正确的手机号',
        disableSendBtn: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})