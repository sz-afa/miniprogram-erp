const app = getApp()
import Notify from '../../../dist/notify/notify';

Page({

  /**
   * 页面的初始数据
   */

  data: {
    active: 0,
    isStartTime: true,
    dateshow: false,
    startDate: {
      timeShow: '',
      timeStamp: 0
    },
    endDate: {
      timeShow: '',
      timeStamp: 0
    },
    orders: [],
    sum: {
      count: 0,
      sale: 0,
      profit: 0,
    },
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
  timestampToTime(timestamp, type) {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
    let D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
    if(type == 1){
      return Y+M+D+h+m+s;
    }
    if(type == 2){
      let str = Y+M+D
      str=str.substr(0,str.length-1)
      return str
    }
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
  initDate(){
    let _currentDate = new Date().getTime()
    let val = {
      timeShow: this.timestampToTime(_currentDate,2),
      timeStamp: new Date(this.timestampToTime(_currentDate,2)).getTime()
    }
    this.setData({
      startDate: val,
      endDate: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate()
    this.getOrdersByOpenId()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  dateConfirm(){
    let _currentDate = this.data.currentDate
    let val = {
      timeShow: this.timestampToTime(_currentDate,2),
      timeStamp: _currentDate
    }
    if(this.data.isStartTime){
      if(val.timeStamp > this.data.endDate.timeStamp){
        Notify({ type: 'danger', message: '开始日期不能大于结束日期' });
        return 
      }
      this.setData({
        startDate: val,
      })
    }else{
      if(val.timeStamp < this.data.endDate.timeStamp){
        Notify({ type: 'danger', message: '结束日期不能小于开始日期' });
        return 
      }
      this.setData({
        endDate: val,
      })
    }
    this.dateShowClose()
    this.getOrdersByOpenId()
  },
  onInputDate(event) {
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

  },
  onChange(event){
    console.log('onchange')
    let {index} = event.detail
    let _currentDate = new Date().getTime()
    let _currentDate2 = this.timestampToTime(_currentDate, 2)
    let _currentDate3 = [..._currentDate2]
    _currentDate3.pop()
    _currentDate3[8] = '0'
    _currentDate3[9] = '1'
    let val = {}
    this.initDate()
    switch(index){
      case 0:
        this.getOrdersByOpenId()
        return
      case 1:
        val.timeShow = _currentDate3.join('')
        val.timeStamp = new Date(_currentDate3.join('')).getTime()
        break
      case 2:
        _currentDate3[5] = '0'
        _currentDate3[6] = '1'
        val.timeShow = _currentDate3.join('')
        val.timeStamp = new Date(_currentDate3.join('')).getTime()
        break
    }

    this.setData({
      startDate: val
    })
    this.getOrdersByOpenId()
  },
  getOrdersByOpenId(){
    let _this = this
    let _sTime = this.data.startDate.timeStamp
    let _eTime = this.data.endDate.timeStamp
    let _url = app.globalData.orderUrl+`customer/getOrdersByOpenId?startTime=${_sTime}&endTime=${_eTime}`
    wx.request({
      url: _url,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          _this.setData({
            orders: res.data.data
          })
          _this.refreshSumData()
          console.log(_this.data.orders)

        }
      }
    })
  },
  refreshSumData(){
    let _this = this
    let _sum = {
      count: 0,
      sale: 0,
      profit: 0,
    }
    let _orders = this.data.orders
    this.data.orders.forEach(function(item, index, arr){
      console.log("item",item)
      _sum.count ++;
      _sum.sale += item.total
      _sum.profit += item.total - item.costprice
      _orders[index].time = _this.timestampToTime(item.timestamp, 2)
    })

    this.setData({
      sum: _sum,
      orders: _orders
    })
  },
  itemClick(event){
    let item = event.currentTarget.dataset.item
    let jsonstr = JSON.stringify(item)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?item='+jsonstr
  })
  }
})