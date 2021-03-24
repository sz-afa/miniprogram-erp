// pages/goodManage/goodManage.js
const app = getApp()
import Toast from '../../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSetting: {},
    type: '全部',
    searchVal: '',
    haveGood: false,
    showSheet: false,
    option1: [],
    defaultOpt: [        
      { text: '全部', value: -1 },
      { text: '未分类', value: 0 }
    ],
    typeVal: -1,
    goodsData: [],
    showGoodsData: [],
    imgUrlPre: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      option1: this.data.defaultOpt,
      imgUrlPre: app.globalData.goodUrl + 'good/image/download?filename='
    })

    let _setting = app.globalData.userSetting
    this.setData({
      userSetting: _setting
    })
    console.log('显示了 --用户设置:',_setting)

    var _this = this
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
      loadingType: 'spinner',
      mask: true
    })
    wx.request({
      url: app.globalData.goodUrl+'good/getAllGoodType',
      method: 'GET',
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        let arry = []
        if(res.statusCode == 200){
          let data = res.data.data
          for(let val of data){
            let {id,type} = val
            arry.push({
              text: type,
              value: id
            })
          }
          arry = _this.data.defaultOpt.concat(arry)
          _this.setData({
            option1: arry,
            typeVal: -1
          })
          _this.getGoodReq()
          setTimeout(()=>{
            Toast.clear()
          },500)
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
    console.log('onShow')

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
    console.log('到底了')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onCloseSheet() {
    this.setData({ showSheet: false });
  },

  onSelectSheet(event) {
    console.log(event.detail.name);
    this.setData({
      type: event.detail.name
    })
  },
  typeBtnClick(){
    this.setData({
      showSheet: true
    })
  },
  scan: function(){
    var _this=this;
    wx.scanCode({
      success(res) {
        console.log(res)
        _this.setData({
          searchVal: res.result
        })
        _this.onSearch({
          detail: res.result
        })
      }
    })
  },
  onSearch: function(val){
    let {detail=''} = val
    console.log('detail',detail)
    this.setData({
      searchVal: detail
    })
    this.showGoodsDataFlush()
  },
  onClear: function(){
    console.log('取消')
    this.onSearch({})
  },
  buttomClick: function(val){
    let {index} = val.currentTarget.dataset
    if(index == 0){
      wx.navigateTo({
        url: '../goodSetting/goodSetting'
      })
    }else if(index == 1){
      wx.navigateTo({
        url: '../goodForm/goodForm?action=add'
      })
    }
  },
  getGoodReq: function(){
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
            goodsData: res.data.data
          })
          _this.addTypeTextPropertyToGoods()
          _this.setData({
            showGoodsData: _this.data.goodsData
          })
        }
        console.log(_this.data.goodsData)
        if(_this.data.showGoodsData.length > 0){
          _this.setData({
            haveGood: true
          })
        }
      }
    })


  },
  typeIdToTypeText: function(id){
    let _val = '未分类'
   this.data.option1.forEach(function (e){
    if(e.value == id){
      _val =  e.text
    }
   })
   return _val
  },
  addTypeTextPropertyToGoods(){
    let _goodsData = this.data.goodsData
    for(let idx in _goodsData){
      let tpId = _goodsData[idx].typeId
      let typeText = this.typeIdToTypeText(tpId)
      _goodsData[idx].typeText = typeText
    }
    this.setData({
      goodsData: _goodsData
    })
  },
  delGoodById(_good){
    let {id} = _good.currentTarget.dataset
    var _this = this
    wx.request({
      url: app.globalData.goodUrl+'good/delGood?id='+id,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data)
          // _this.onShow()
          _this.delGoodByIdNextStep(id)
        }
      }
    })

  },
  delGoodByIdNextStep(id){
    let _goodsData = this.data.goodsData
    let _showgoodsData = this.data.showGoodsData
    let delIdx = -1
    _goodsData.forEach(function (item,index){
      if(item.id == id){
        delIdx = index
        return 
      }
    })
    if( delIdx > 0){
      _goodsData.splice(delIdx,1)
    }
    delIdx = -1
    _showgoodsData.forEach(function (item, index){
      if(item.id == id){
        delIdx = index
        return 
      }
    })
    if( delIdx > 0){
      _showgoodsData.splice(delIdx,1)
    }
    this.setData({
      goodsData: _goodsData,
      showGoodsData: _showgoodsData
    })

  },
  dropdownMenuChange(val){
    this.setData({
      typeVal: val.detail
    })
    this.showGoodsDataFlush()
  },
  showGoodsDataFlush(){

    let _goodsData = this.data.goodsData
    let _showGoodsData = []
    let _showGoodsData2 = []
    let _typeVal = this.data.typeVal
    let _searchVal = this.data.searchVal
    _goodsData.forEach(function (item,index){
      if(_typeVal==-1 || item.typeId==_typeVal){
        _showGoodsData.push(item)
      }
    })
    if(_searchVal!=''){
      _showGoodsData.forEach(function(item, index){
        let objStr = JSON.stringify(item)
        if(objStr.indexOf(_searchVal) != -1 ){//包含
          _showGoodsData2.push(item)
        } 
      })
    }else{
      _showGoodsData2 = _showGoodsData
    }
    this.setData({
      showGoodsData: _showGoodsData2
    })
  },
  editGood(val){
    let {idx} = val.currentTarget.dataset
    let _good = this.data.showGoodsData[idx]
    wx.navigateTo({
      url: '../goodForm/goodForm?action=edit&goodInfo='+JSON.stringify(_good)
    })
  }
})