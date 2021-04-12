const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '1',
    showdropmenu_all: false,
    showdropmenu_cif: false,
    getTypes: ['批发','零售'],
    downanup: "down",
    objs: [],
    dwonanupflg: false,
    ObjectCIF:[
      {
        name: "批发"
      },
      {
        name: "零售"
      }
    ]

  },
  // 新增客户
  addCIF(){
    wx.navigateTo({
      url: '../customer_add/customer_add',
    })
  },
  // 显示 "客户" 选项的值
  onShowCIF(e){
    console.log(e);
    if(!this.data.showdropmenu_cif){
      this.setData({
        showdropmenu_cif: true
      })
    }else{
      this.setData({
        showdropmenu_cif: false
      })
    }
  },
  // 显示 "全部" 选项的值
    onShowall(){
      if(!this.data.showdropmenu_all){
          this.setData({
            showdropmenu_all: true
          })
      }else{
          this.setData({
            showdropmenu_all: false
          })
      }
      
    },
    addSupp:function() {
      console.log('新增供应商');
      wx.navigateTo({
        url: '/pages/detailshap/detailshap',
      })
    },
    getMoney(){
      console.log('收款')
    },
    phone(){
      console.log('打电话')
    },
    onchange(e){
      this.setData({
            value: e.detail
      });
    },
    onSearch(){
      if(!this.data.dwonanupflg){
          this.setData({
            dwonanupflg: true
          })
      }else{
        this.setData({
           dwonanupflg: false
          })
      }
    },
    onClose(e){
      console.log(e);
    },
    onSelect(e){
      console.log(e);
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
    var _this = this
    wx.request({
      url: app.globalData.csUrl+'customer/getCustomers',
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data.data)
          _this.setData({
            objs: res.data.data
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

  },
  edit(val){
    console.log(val.currentTarget.dataset)
    let {idx} =  val.currentTarget.dataset
    let _customer = this.data.objs[idx]
    wx.navigateTo({
      url: '../customer_add/customer_add?action=edit&data='+JSON.stringify(_customer)
    })
  },
  sale(val){
    let {item} = val.currentTarget.dataset
    console.log(item)
    wx.navigateTo({
      url: '../../order_sale/order_sale?action=1&val=' + JSON.stringify(item)
  })
  }
})