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
    addr: '',
    personTitle: '客户',
    showPersionSheet: false,
    persionActions: [
      { loading: true }
    ],
    person: null,
    isSale: true,
    goods: [],
    goodcounts: [],
    goodAllCount: 0,
    goodAllMoney: 0,
    obj: {
      date: '',
    },
  },
  onPersionSheetClose(){
    this.setData({
      showPersionSheet: false
    })
  },
  goodAllCountFunc(){
    let _val = 0;
    this.data.goodcounts.forEach(function(item, index, arr){
      _val += item
    })
    this.setData({
      goodAllCount: _val
    })
  },
  goodAllMoneyFunc(){
    let _money = 0;
    let _goodcounts =  this.data.goodcounts
    if(this.data.isSale){
      this.data.goods.forEach(function(item, index, arr){
        _money += item.salePrice * parseInt(_goodcounts[index])
      })
    }else{
      this.data.goods.forEach(function(item, index, arr){
        _money += item.prchsPrice * parseInt(_goodcounts[index])
      })
    }
    this.setData({
      goodAllMoney: _money
    })
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
    _obj.date = this.formatDate(event.detail)
    this.setData({
      obj: _obj,
      calendarShow: false
    })
  },
  addGood(val){
    console.log('addgood',val)
    var _this = this
    let _goods = this.data.goods
    let _goodcounts = this.data.goodcounts
    let _haved = false
    _goods.forEach(function(item, index, arr){
      if(item.id == val.id){
        _haved = true 
        _goodcounts = _this.data.goodcounts;
        _goodcounts[index] = _goodcounts[index] + 1;
      }
    })
    if(_haved == false){
      _goods.push(val)
      _goodcounts.push(1)
    }
    this.setData({
      goods: _goods,
      goodcounts: _goodcounts
    })
    _this.goodAllCountFunc()
    _this.goodAllMoneyFunc()
  },
  scan: function(){
    var _this=this;
    wx.scanCode({
      success(res) {
        console.log('res.result:'+res.result)
        _this.getGoodInfoByCode(res.result)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {action='sale'} = options
    if(action == 'purchases'){
      this.setData({
        personTitle: '供应商',
        isSale: false,
      })
    }
    console.log('action: ',action)
    let timestamp  = (new Date()).valueOf()
    timestamp -= 3600 * 1000 * 24 * 60
    this.setData({
      minDate: new Date(timestamp).getTime(),
      imgUrlPre: app.globalData.goodUrl + 'good/image/download?filename='
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
    var _this = this
    
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
  sfdgj(){
    this.setData({
      showPersionSheet: true
    })
  },
  getGoodInfoByCode(code){
    var _this = this
    wx.request({
      url: app.globalData.goodUrl+'good/getGoodByCode?code='+code,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          _this.addGood(res.data.data);
        }
      }
    })
  },
  changeGoodCount(val){
    let {idx,action} = val.currentTarget.dataset
    let _goodcounts = this.data.goodcounts
    _goodcounts[idx] = _goodcounts[idx] +parseInt(action) 
    if(_goodcounts[idx] < 1){
      _goodcounts[idx] = 1
    }
    this.setData({
      goodcounts: _goodcounts
    })
    this.goodAllCountFunc()
    this.goodAllMoneyFunc()
  },
  removeGood(val){
    let _goods = []
    let _goodcounts = []
    let _this = this
    let idx = val.currentTarget.dataset.idx
    this.data.goods.forEach(function(item, index, arr){
      if(index != idx){
        _goods.push(item)
        _goodcounts.push(_this.data.goodcounts[index])
      }
    })
    this.setData({
      goods: _goods,
      goodcounts: _goodcounts
    })
    this.goodAllCountFunc()
    this.goodAllMoneyFunc()
  },
  submit(){

  }
  
})