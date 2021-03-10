// pages/goodManage/goodManage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSetting: {},
    type: '全部',
    searchVal: '',
    showSheet: false,
    option1: [],
    defaultOpt: [        
      { text: '全部', value: -1 },
      { text: '未分类', value: 0 }
    ],
    typeVal: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('g onLoad')
    this.setData({
      option1: this.data.defaultOpt
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
    let _setting = app.globalData.userSetting
    this.setData({
      userSetting: _setting
    })
    console.log('显示了 --用户设置:',_setting)

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
    console.log('scan')
    var _this=this;
    wx.scanCode({
      success(res) {
        console.log(res)
        _this.setData({
          searchVal: res.result
        })
      }
    })
  },
  onSearch: function(val){
    let {detail=''} = val
    console.log('val',val)
    console.log('detail',detail)
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
  }
})