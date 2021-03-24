// pages/order/order.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: 'purchases',
    calendarShow: false,
    minDate: new Date().getTime(),
    obj: {
      data: ''
    },
  },
  calendarDisplay(){
    this.setData({
      calendarShow: true
    })
  },
  calendarClose(){
    this.setData({
      calendarShow: false
    })
  },
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let m = date.getMonth() + 1
    if(m<10){
      m = '0'+m
    }
    let dd = date.getDate()
    if(dd<10){
      dd = '0'+dd
    }
    return `${year}-${m}-${dd}`;
  },
  calendarConfirm(event){
    let _obj = this.data.obj
    _obj.data = this.formatDate(event.detail)
    this.setData({
      obj: _obj,
      calendarShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {action} = options
    console.log('action: ',action)
    let timestamp  = (new Date()).valueOf()
    timestamp -= 3600 * 1000 * 24 * 60
    this.setData({
      minDate: new Date(timestamp).getTime(),
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

  }
})