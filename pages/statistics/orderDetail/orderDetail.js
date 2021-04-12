const app = getApp()
import Notify from '../../../dist/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrlPre: app.globalData.goodUrl + 'good/image/download?filename=',
    fields: ["wechat","cash", "alipay", "bank"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderInfo = JSON.parse(options.item)
    console.log(orderInfo)
    if(orderInfo.customer.id > 0){

      this.setData({
        orderInfo: orderInfo
      })
    }
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
    this.getCustomerDetail()
  },

  getCustomerDetail(){
    let _this = this
    let _orderInfo = this.data.orderInfo
    if(_orderInfo != undefined){
      let _url = app.globalData.csUrl+'customer/getCustomerById?id='+_orderInfo.customer.id
      wx.request({
        url: _url,
        method: 'GET',
        header: {
            'token': app.globalData.jwtToken,
        },
        success: function(res){
          if(res.data.code == 1){
            console.log(res.data)
            _orderInfo.customer = res.data.data
            _this.setData({
              orderInfo: _orderInfo
            })
            _this.getGoodDetail()
          }
        }
      })
    }
  },
  getGoodDetail(){
    let _this = this
    let _orderInfo = this.data.orderInfo
    if(_orderInfo != undefined){
      _orderInfo.goods.forEach(function(item, index, arr){
        _this.getGoodDetailReq(item.id, index)
      })
    }
  },
  getGoodDetailReq(id, index){
    let _this = this
    let _url = app.globalData.goodUrl+'good/getGoodById?id='
    let _orderInfo = this.data.orderInfo
    console.log(id,index)
    wx.request({
      url: _url+id,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          let _good2 = res.data.data
          _good2.amount = _orderInfo.goods[index].amount
          _orderInfo.goods[index] = res.data.data
          _this.setData({
            orderInfo: _orderInfo
          })
        }
      }
    })
  
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