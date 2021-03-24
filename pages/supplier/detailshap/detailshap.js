
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {
      name: "",
      liaison: "",
      phone: "",
      addr: "",
      info: ""
    },
    isUpdate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id,data} = options
    if(id > 0 ){
      console.log(options)
      this.setData({
        isUpdate: true,
        obj: JSON.parse(data)
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
  submit(){
    let _url = app.globalData.csUrl+'supplier/addSupplier';
    if(this.data.isUpdate){
      _url = app.globalData.csUrl+'supplier/updateSupplier';
    }
    console.log(this.data.obj)
    var _this = this
    wx.request({
      url: _url,
      method: 'POST',
      data: _this.data.obj,
      header: {
          'content-type': 'application/json',
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log('添加成功')
          wx.navigateBack()
        }
      }
    })
  },
  onChange(val){
    let _obj = this.data.obj
    let {detail,currentTarget:{dataset:{idx}}} = val
    console.log(detail,idx)
    if(idx == 0){
      _obj.name = detail
    }
    if(idx == 1){
      _obj.liaison = detail
    }
    if(idx == 2){
      let reg = /^1[0-9]*$/
      if(reg.test(detail)){
        _obj.phone = detail
      }else{
        _obj.phone = ''
      }
      if(detail.length > 11){
        _obj.phone = ''
      }
    }
    if(idx == 3){
      _obj.addr = detail
    }
    if(idx == 4){
      _obj.info = detail
    }
    this.setData({
      obj: _obj
    })
  },
  del(){
    console.log(this.data.obj.id)
    var _this = this;
    wx.request({
      url: app.globalData.csUrl+'supplier/delSupplier?id='+_this.data.obj.id,
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data)
          wx.navigateBack()
        }
      }
    })
  }
})