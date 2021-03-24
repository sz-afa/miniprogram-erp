const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCIF: false,
    convertRowData: '',
    typeSelectText: '批发',
    action: '',
    isEdit: false,
    customerInfo: [
      {
        name: "批发"
      },
      {
        name: "零售"
      }
    ],
    obj: {
      id: 0,
      name: '',
      liaison: '',
      phone: '',
      addr: '',
      info: ''
    }
  },
  // 选择 "客户类型"
  onSelect(e){
      console.log(e.detail.name);
      this.setData({
        typeSelectText: e.detail.name,
        showCIF: false,
      })
  },
  // 显示 "客户类型" 选项值 
  onShowCIF(){
    if(!this.data.showCIF){
      this.setData({
        showCIF: true
      })
    }else{
      this.setData({
        showCIF: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {action='add',data={}} = options
    this.setData({
        action: action
    })
    if(action == 'edit'){
      this.setData({
        obj: JSON.parse(data),
        isEdit: true
      })

      if(this.data.obj.type == 1){
        this.setData({
          typeSelectText: '零售'
        })
      }

    }
    console.log('data:',data)
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
  onClose(){
    console.log('close')
    // this.setData({
    //   showCIF: false
    // })
  },
  DataConvert(val){
    console.log(val)
  },
  submit(){
    let _url = app.globalData.csUrl+'customer/addCustomer';
    if(this.data.isEdit){
      _url = app.globalData.csUrl+'customer/updateCustomer';
    }
    let _obj = this.data.obj;
    if(this.data.typeSelectText=='批发'){
      _obj.type = 0
    }else{
      _obj.type = 1
    }
    console.log(_obj)
    wx.request({
      url: _url,
      method: 'POST',
      data: _obj,
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
    let {idx} = val.currentTarget.dataset
    let _obj = this.data.obj
    if(idx == 0 ){
      _obj.name = val.detail
    }
    if(idx == 1){
      _obj.liaison = val.detail
    }
    if(idx == 2){
      _obj.phone = val.detail
    }
    if(idx == 3){
      _obj.addr = val.detail
    }
    if(idx == 4){
      _obj.info = val.detail
    }
    this.setData({
      obj: _obj
    })
  },
  del(){
    let _id = this.data.obj.id
    wx.request({
      url: app.globalData.csUrl+'customer/delCustomer?id='+_id,
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