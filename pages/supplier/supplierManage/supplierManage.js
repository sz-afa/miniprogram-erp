
const app = getApp()
import Toast from '../../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    downanup: "down",
    dwonanupflg: false,
    suppliers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.request({
      url: app.globalData.csUrl+'supplier/getSuppliers',
      method: 'GET',
      header: {
          'token': app.globalData.jwtToken,
      },
      success: function(res){
        if(res.data.code == 1){
          console.log(res.data.data)
          _this.setData({
            suppliers: res.data.data
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneCall(val){
    console.log(val.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: val.currentTarget.dataset.phone,
    })
  },
  qkBtnClick(){
    if(!this.data.dwonanupflg){
      this.setData({
        dwonanupflg: true
      })
    }else{
      this.setData({
        dwonanupflg: false
        })
    }
  },
  addSupp(){
    wx.navigateTo({
      url: '../detailshap/detailshap',
    })
  },
  updateSupp(val){
    let {idx,id} = val.currentTarget.dataset
    let supp = this.data.suppliers[idx]
    console.log(idx)
    wx.navigateTo({
      url: '../detailshap/detailshap?id='+id+'&data='+JSON.stringify(supp)
    })
  }
})