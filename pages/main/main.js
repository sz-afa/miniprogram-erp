const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    swiperCurrent: 0,
    siwperData: [{
      title1: '今日利润',
      value1: 0.00,
      title2: '今日销售',
      value2: 0.00
    },{
      title1: '昨日利润',
      value1: 0.00,
      title2: '昨日销售',
      value2: 0.00
    },{
      title1: '本月利润',
      value1: 0.00,
      title2: '本月销售',
      value2: 0.00
    }],
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

    let _i = 0;
    for(; _i< 6 ; _i++){
      this.getMainPageInfoReq(_i)
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
  lastBtn(){
    let _current = this.data.swiperCurrent
    if(_current == 0){
      return ;
    }
    this.setData({
      swiperCurrent: _current-1
    })
  },
  nextBtn(){
    let _current = this.data.swiperCurrent
    if(_current == this.data.siwperData.length - 1){
      return ;
    }
    this.setData({
      swiperCurrent: _current+1
    })
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
        wx.navigateTo({
          url: '../statistics/sale/sale'
        })
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
        url: '../order_sale/order_sale'
      })
    }
    if(idx == 5){
      wx.navigateTo({
        url: '../order/order?action=purchases'
      })
    }

  },
  getMainPageInfoReq(index){
    var _this = this
    let _url = ''
    let _siwperData = _this.data.siwperData 
    switch(index){
      case 0:
        _url = app.globalData.financeUrl+'statistics/getTodayProfit'
        break
      case 1:
        _url =  app.globalData.financeUrl+'statistics/getTodayTotal'
        break
      case 2:
        _url =  app.globalData.financeUrl+'statistics/getYesterdayProfit'
        break
      case 3:
        _url =  app.globalData.financeUrl+'statistics/getYesterdayTotal'
        break
      case 4:
        _url =  app.globalData.financeUrl+'statistics/getThisMonthProfit'
        break
      case 5:
        _url =  app.globalData.financeUrl+'statistics/getThisMonthTotal'
        break
    }
    wx.request({
      url: _url,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data)
          switch(index){
            case 0:
              _siwperData[0].value1 = res.data.data
              break
            case 1:
              _siwperData[0].value2 = res.data.data
              break
            case 2:
              _siwperData[1].value1 = res.data.data
              break
            case 3:
              _siwperData[1].value2 = res.data.data
              break
            case 4:
              _siwperData[2].value1 = res.data.data
              break
            case 5:
              _siwperData[2].value2 = res.data.data
              break
          }
          _this.setData({
            siwperData: _siwperData
          })
        }
      }
    })
  
  }
})