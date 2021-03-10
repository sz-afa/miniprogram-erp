// pages/good/goodType/goodType.js
const app = getApp()
import Toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    types: [],
    dialogShow: false,
    goodType: '',
    isUpdate: false,
    updateId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: app.globalData.goodUrl
    })
    var _this = this
    var _toast = Toast
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
      loadingType: 'spinner',
      mask: true
    });

    wx.request({
      url: this.data.url+'good/getAllGoodType',
      method: 'GET',
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      
      success: function(res){
        console.log('res',res)
        if(res.statusCode == 200){
          let data = res.data.data
          console.log('data',data)
          _toast.clear();
          _this.setData({
            types: data
          })
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
  delType: function(val){
    var _this = this
    let typeId = val.currentTarget.dataset.id
    console.log('del id',typeId)
    wx.request({
      url: this.data.url+'good/delGoodType?id='+typeId,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log('删除成功')
          _this.onLoad()
        }
      }
    })
  },
  modifyType: function(val){
    let typeId = val.currentTarget.dataset.id
    console.log('modify id',typeId)
    let idx = val.currentTarget.dataset.idx
    let vall = this.data.types[idx].type
    this.setData({
      dialogShow: true,
      isUpdate: true,
      goodType: vall,
      updateId: typeId
    })
  },
  openDialog: function(){
    this.setData({
      dialogShow: true,
    })
  },
  inputChange: function(event){
    this.setData({
      goodType: event.detail
    })
  },
  closeDialog: function(){
    console.log('closeDialog')
    this.setData({
      dialogShow: false,
      goodType: ''
    })
  },
  confirmDialog: function(){
    var _this = this
    console.log(this.data.goodType)

    if(_this.data.isUpdate){
      console.log('update')
      
      wx.request({
        url: this.data.url+'good/updateGoodType',
        method: 'POST',
        data: {
          id: _this.data.updateId,
          type: _this.data.goodType
        },
        header: {
            'content-type': 'application/json',
            'token': app.globalData.jwtToken,
        },
        success: function(res){
          if(res.data.code == 1){
            console.log('更新成功')
            _this.onLoad()
          }
        }
      })
  
    }else{
      wx.request({
        url: this.data.url+'good/addGoodType',
        method: 'POST',
        data: {
          type: _this.data.goodType
        },
        header: {
            'content-type': 'application/json',
            'token': app.globalData.jwtToken,
        },
        success: function(res){
          if(res.data.code == 1){
            console.log('添加成功')
            _this.onLoad()
          }
        }
      })
  
    }


    this.setData({
      dialogShow: false,
      goodType: '',
      isUpdate: false
    })



  }
})