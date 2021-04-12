const app = getApp()
import Notify from '../../dist/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodAllMoney: 0.0,
    goodAllCount: 0,
    addr: '',
    date: new Date().getTime,
    minDate: new Date().getTime(),
    calendarShow: false,
    persionActions: [
      { loading: true }
    ],
    persionActionsSelect: {},
    persionActionsText: '未选择',
    amountShow: false,
    amountText: '现金',
    amountSelect: 1,
    amountActions: [{
      name: '现金',
      subname: '默认',
      value: 1
    },{
      name: '银行卡',
      value: 3
    },{
      name: '微信',
      value: 0
    },{
      name: '支付宝',
      value: 2
    }],
    types: ['批发','零售'],
    goods: [],
    goodcounts: [],
    goodsmoney: [],
    goodSheetShow: false,
    isWholesale: false,
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
    let _date = this.data.date
    _date = this.formatDate(event.detail)
    this.setData({
      date: _date,
      calendarShow: false
    })
  },
  sfdgj(){
    if(this.data.persionActions[0] == { loading: true }){
      this.getcustomer()
    }
    this.setData({
      showPersionSheet: true
    })
  },
  sfdgj2(){
    this.setData({
      showPersionSheet: false
    })
  },
  sfdgje(){this.setData({amountShow: true})},
  onAmountClose(){this.setData({amountShow: false})},
  onAmountSelect(val){
    console.log(val.detail.name)
    this.setData({
      amountText: val.detail.name,
      amountSelect: val.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {action=0, val} = options
    if(action == 1){
      let _person = {}
      _person.detail = JSON.parse(val)
      this.onPersionSheetSelect(_person)
    }

    var _this = this
    let timestamp  = (new Date()).valueOf()
    timestamp -= 3600 * 1000 * 24 * 60
    this.setData({
      minDate: new Date(timestamp).getTime(),
      imgUrlPre: app.globalData.goodUrl + 'good/image/download?filename='
    })

    this.getGoodsFromApi()

    this.getcustomer()

  },
  getGoodsFromApi(){
    var _this = this
    wx.request({
      url: app.globalData.goodUrl+'good/getGoods',
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          _this.setData({
            goodActions: res.data.data
          })
        }

      }
    })
  },
  onPersionSheetSelect(val){
    console.log(val.detail)
    let _iswhls = true;
    if(val.detail.type == 1){
      _iswhls = false
      console.log('零售')
    }else{
      console.log('批发')
    }
    this.setData({
      persionActionsSelect: val.detail,
      persionActionsText: val.detail.name,
      isWholesale: _iswhls
    })
    this.reFreshShowPrice()
  },
  reFreshShowPrice(){
    var _this = this
    let _goods = this.data.goods
    if(this.data.isWholesale){
      this.data.goods.forEach(function(item, index, arr){
        _goods[index].showPrice = item.whlslPrice
      })
    }else{
      this.data.goods.forEach(function(item, index, arr){
        _goods[index].showPrice = item.salePrice
      })
    }
    this.setData({
      goods: _goods
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
  ongoodClose(){
    this.setData({
      goodSheetShow: false
    })
  },
  ongoodSelect(val){
    this.addGood(val.detail)
  },
  addGoodClick(){
    this.setData({
      goodSheetShow: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    this.reFreshShowPrice()
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
    this.reFreshShowPrice()
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
    _this.reFreshShowPrice()
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
    if(this.data.isWholesale){
      this.data.goods.forEach(function(item, index, arr){
        _money += item.whlslPrice * parseInt(_goodcounts[index])
      })
    }else{
      this.data.goods.forEach(function(item, index, arr){
        _money += item.salePrice * parseInt(_goodcounts[index])
      })
    }

    
    this.setData({
      goodAllMoney: _money
    })
  },
  getcustomer(){
    var _this = this
    let _url = app.globalData.csUrl+'customer/getCustomers'
    wx.request({
      url: _url,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          let _persionActions = []
          res.data.data.forEach(function(item, index, arr){
            item.subname = _this.data.types[item.type]
            _persionActions.push(item)
          })
          _this.setData({
            persionActions: res.data.data
          })
        }
      }
    })

  },
  getCostprice(){
    let _val = 0
    let _goodcounts = this.data.goodcounts
    this.data.goods.forEach(function(item, index, arr){
      _val +=item.prchsPrice * _goodcounts[index]
    })
    return _val
  },
  submit(){
    let _formData = {}
    var _this = this
    let _url = _url = app.globalData.orderUrl+'customer/addCustomerOrder'
    _formData.date = Date.parse(Date(this.data.date))
    _formData.goods = this.data.goods;
    this.data.goods.forEach(function(item, index, arr){
      _formData.goods[index].amount = _this.data.goodcounts[index]
    })
    _formData.amount = this.data.goodAllCount
    if(_formData.amount == 0){
      Notify({ type: 'danger', message: '请添加商品' })
      return 
    }
    _formData.total = this.data.goodAllMoney
    _formData.customer = this.data.persionActionsSelect
    if(_formData.customer.id == undefined){
      Notify({ type: 'danger', message: '请选择顾客' })
      return 
    }
    _formData.addr = this.data.addr
    if(_formData.addr == undefined || _formData.addr==''){
      Notify({ type: 'danger', message: '地址不能为空' })
      return 
    }
    _formData.walletfield = this.data.amountSelect
    _formData.costprice  = this.getCostprice()
    console.log('formdata:',_formData)

    wx.request({
      url: _url,
      method: 'POST',
      data: _formData,
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          Notify({ type: 'success', message: '添加成功' })
          setTimeout(()=>{
            wx.navigateBack()
          },1000)
        }else{
          Notify({ type: 'danger', message: res.data.msg || '服务器错误' })
        }
      }
    })

  }
})