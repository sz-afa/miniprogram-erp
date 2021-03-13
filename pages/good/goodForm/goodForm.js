// pages/good/goodAdd/goodAdd.js
const app = getApp()

import Notify from '../../../dist/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: '',
    // {name,code,typeId,pPrice,stock}
    goodInfo: {},
    info: '',//留言
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
    let reg2 = /^[0-9]*.$/
    let _value = val.detail
    let isMoney = reg.test(_value)
    let tmpPriceError = this.data.priceError
    let tmpPriceCols = this.data.priceCols

    if(isMoney || _value==''|| reg2.test(_value)){
      
      tmpPriceError[idx] = false
      tmpPriceCols[idx] = _value+''
    }else{
      tmpPriceError[idx] = true
      tmpPriceCols[idx] = ''
    }
    this.setData({
      priceError: tmpPriceError,
      priceCols: tmpPriceCols
    })


  },
  stockChange: function(val){
    let reg = /^[1-9]\d*$/
    let value = val.detail
    if( reg.test(value) ){
    console.log('stockChange',value)

      let _goodInfo = this.data.goodInfo
      _goodInfo.stock = value
    console.log('stockChange',_goodInfo)

      this.setData({
        goodInfo: _goodInfo
      })
    }else{
      let _goodInfo = this.data.goodInfo
      _goodInfo.stock = ''
      this.setData({
        goodInfo: _goodInfo
      })
    }
  },
  infoChange: function(val){
    let _goodInfo = this.data.info
    _goodInfo = val.detail
    this.setData({
      info: _goodInfo
    })
  },
  submit: function(){
    let _goodInfo = this.data.goodInfo
    if(! _goodInfo.code ||  _goodInfo.code == ''){
      Notify({ type: 'danger', message: '条形码不能为空,若无请随机生成' });
      return 
    }
    if(!_goodInfo.name || _goodInfo.name ==''){
      Notify({ type: 'danger', message: '货品名称不能为空' });
      return 
    }

    _goodInfo.typeId = this.data.goodTypeIdColums[this.data.selectedGoodTypeIdx]
    _goodInfo.prchsPrice = this.data.priceCols[0] 
    _goodInfo.whlslPrice = this.data.priceCols[1] 
    _goodInfo.salePrice = this.data.priceCols[2]
    _goodInfo.stock = this.data.goodInfo.stock | 0
    _goodInfo.info = this.data.info=='' ? '无' : this.data.info

    this.setData({
      goodInfo: _goodInfo,
    })
    let successMsg = '更新成功'
    if( this.data.action == 'add' )
        successMsg = '添加成功'
    wx.request({
      url: app.globalData.goodUrl+'good/addGood',
      method: 'POST',
      data: _goodInfo,
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(successMsg)
        }
      }
    })

  }
})