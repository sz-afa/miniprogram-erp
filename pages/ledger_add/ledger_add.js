const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDate: false,
    addDate: '',
    minDate: new Date().getTime(),
    switch1: false,
    swTitle: '转入',
    id: -1,
    field: -1,
    errorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timestamp  = (new Date()).valueOf()
    timestamp -= 3600 * 1000 * 24 * 60
    this.setData({
      minDate: new Date(timestamp).getTime()
    })

    let {id=-1, field} = options
    if(id >= 0){
      this.setData({
        id: id,
        field: field
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
  switchChange({ detail }){
    let _swTitle = '转出'
    if(this.data.switch1){
      _swTitle = '转入'
    }
    this.setData({
      switch1: detail,
      swTitle: _swTitle
    })
  },
  getMinDate(){
    return new Date(2010, 0, 1).getTime()
  },
  dateClose(){
    this.setData({
      showDate: false
    })
  },
  dateDisplay(){
    this.setData({
      showDate: true
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
    return `${year}/${m}/${dd}`;
  },
  dateConfirm(val){
    console.log(val)
    console.log(val.detail.valueOf())
    this.setData({
      showDate: false,
      addDate: this.formatDate(val.detail)
    })
  },
  moneyChange(val){
    let _val = val.detail
    let reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/
    if(reg.test(_val)){
      this.setData({
        money: _val,
        errorMsg: ''
      })
    }else{
      this.setData({
        errorMsg: '钱格式错误'
      })
    }
  },
  submit(){
    let _id = this.data.id
    let _money = this.data.money
    let _field = this.data.field
    if(this.data.switch1){
      _money = '-'+_money
    }
    let reqPara=`?id=${_id}&field=${_field}&money=${_money}`
    console.log('reqPara',reqPara)
    wx.request({
      url: app.globalData.financeUrl+'finance/updateWallet'+reqPara,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){

        }
      }
    })
  
  }
})