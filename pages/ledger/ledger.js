// pages/ledger/ledger.js
const app = getApp()
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '资产总和',
    count: 0,
    obj: {
      id: 0,
      wechat: 0.00,
      alipay: 0.00,
      cash: 0.00,
      bank: 0.00,
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
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      mask: true,
      duration: 10
    });
    var _this = this
    wx.request({
      url: app.globalData.financeUrl+'finance/getWallet',
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          let data = res.data.data
          let _count = data.alipay + data.wechat + data.bank + data.cash
          console.log('wallet',data)
          setTimeout(()=>{
            Toast.success('加载成功')
          },500)
          _this.setData({
            obj: data,
            count: _count.toFixed(2)
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