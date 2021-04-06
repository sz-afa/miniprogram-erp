const app = getApp()
import Notify from '../../../dist/notify/notify';

Page({

  /**
   * 页面的初始数据
   */

  data: {
    isStartTime: true,
    dateshow: false,
    startDate: '',
    endDate: '',
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
  },
  formatter(type, value) {
    if (type === 'year') {
      return `${value}年`;
    } else if (type === 'month') {
      return `${value}月`;
    }
    return value;
  },
  dateShowClose(){
    this.setData({
      dateshow: false
    })
  },
  dateShowOpen1(){
    this.setData({
      dateshow: true,
      isStartTime: true
    })
  },
  dateShowOpen2(){
    this.setData({
      dateshow: true,
      isStartTime: false
    })
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
  dateConfirm(){
    let _currentDate = this.data.currentDate
    if(this.data.isStartTime){
      this.setData({
        startDate: _currentDate,
      })
    }else{
      this.setData({
        endDate: _currentDate,
      })
    }
    this.dateShowClose()
    
  },
  onInputDate(event) {
    console.log('event',event.detail)
    this.setData({
      currentDate: event.detail,
    });
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