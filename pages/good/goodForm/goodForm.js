// pages/good/goodAdd/goodAdd.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: '',
    // {name,code,type,pPrice,}
    goodInfo: {},
    showPopup: false,
    goodTypeColums: [],
    goodTypeIdColums: [],
    selectedGoodTypeIdx: 0,
    selectedGoodTypeText: '未分类',
    loading: true,
    priceError: [false, false, false],
    priceCols:['', '', '']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是添加还是修改
    let {action,goodInfo={}} = options
    this.setData({
      action: action,
      goodInfo: goodInfo,  //载入修改的原始数据
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this
    wx.request({
      url: app.globalData.goodUrl+'good/getAllGoodType',
      method: 'GET',
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        console.log('res',res)
        let idCols = []
        let typeCols = []
        if(res.statusCode == 200){
          let data = res.data.data
          for(let val of data){
            let {id,type} = val
            typeCols.push(type)
            idCols.push(id)
          }
          idCols = [0].concat(idCols)
          typeCols = ['未分类'].concat(typeCols)
          _this.setData({
            goodTypeColums: typeCols,
            goodTypeIdColums: idCols,
            loading: false
          })
          console.log('goodTypeIdColums : ', _this.data.goodTypeIdColums)
        }
      }
    })
  
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
  dataChange: function(val){
    let {idx} = val.currentTarget.dataset
    let _goodInfo = this.data.goodInfo
    if(idx == 1){
      _goodInfo.name = val.detail
    }
    if(idx == 2){
      _goodInfo.code = val.detail
    }

    this.setData({
      goodInfo: _goodInfo
    })
  },
  codeBtnClick: function(val){
    let {action} = val.currentTarget.dataset
    let _goodInfo = this.data.goodInfo
    if(action == 'get'){
      _goodInfo.code = (new Date()).valueOf()+''
      this.setData({
        goodInfo: _goodInfo
      })
    }else if(action == 'scan'){
      var _this=this;
      wx.scanCode({
        success(res) {
          console.log(res)
          _goodInfo.code = res.result
          _this.setData({
            goodInfo: _goodInfo
          })
        }
      })
    }

  },
  showPopup: function(){
    this.setData({
      showPopup: true
    })
  },
  popupClose: function(){
    this.setData({
      showPopup: false
    })
  },
  pickerConfirm: function(val){
    console.log(val)
  },
  pickerChange: function(val){
    let idx = val.detail.index
    console.log(val.detail)
    this.setData({
      selectedGoodTypeIdx: idx,
      selectedGoodTypeText: val.detail.value
    })
  },
  priceChange: function(val){
    let {idx} = val.currentTarget.dataset
    let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    let isMoney = reg.test(val.detail)
    let tmpPriceError = this.data.priceError
    let tmpPriceCols = this.data.priceCols
    if(isMoney || val.detail==''){
      tmpPriceError[idx] = false
      tmpPriceCols[idx] = val.detail
    }else{
      tmpPriceError[idx] = true
      tmpPriceCols[idx] = ''
    }
    this.setData({
      priceError: tmpPriceError,
      priceCols: tmpPriceCols
    })

    console.log(tmpPriceError)
    console.log(tmpPriceCols)

  }
})