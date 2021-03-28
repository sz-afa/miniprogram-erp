// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    contentItem: [{
      'icon': 'shop-o',
      'text': '商品管理'
    },{
      'icon': 'friends-o',
      'text': '客户'
    },{
      'icon': 'manager-o',
      'text': '供应商'
    },{
      'icon': 'bar-chart-o',
      'text': '统计'
    },{
      'icon': '../../img/wallet.png',
      'text': '钱包'
    }]
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

  },
  iconClick: function(val){
    let idx = val.currentTarget.dataset.item
    switch(idx){
      case 0:
        wx.navigateTo({
          url: '../good/goodManage/goodManage'
        })
        break
      case 1:
        wx.navigateTo({
          url: '../customer/customer/customer'
        })
        break
      case 2:
        wx.navigateTo({
          url: '../supplier/supplierManage/supplierManage'
        })
        break
      case 3:
        console.log('dsfsddff')
        break
      case 4:
        wx.navigateTo({
          url: '../ledger/ledger'
        })
        break
    }
  },
  popupShow(){
    this.setData({
      popupShow: true
    })
  },
  popupClose(){
    this.setData({
      popupShow: false
    })
  },
  btnClick(val){
    let {idx} = val.currentTarget.dataset
    console.log('idx : ',idx)
    if(idx == 0){
      wx.navigateTo({
        url: '../order/order?action=sale'
      })
    }
    if(idx == 5){
      wx.navigateTo({
        url: '../order/order?action=purchases'
      })
    }

  }
  
})