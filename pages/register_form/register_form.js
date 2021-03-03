
import Toast from '../../dist/toast/toast';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sms: '',
    phone: '',
    btnText: '发送验证码',
    errorMsg: '请输入正确的手机号',
    disableSendBtn: true,
    disableSubmitBtn: true,
    msgServerBlock: false,
    timer: 0,
    intervalId: 0,
    token: ''
  },
  // 检查手机号
  checkNumber: function(value){
    let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (myreg.test(value.detail)) {
      this.setData({
        errorMsg: '',
        disableSendBtn: false,
        phone: value.detail
      })
    }else{
      this.setData({
        errorMsg: '请输入正确的手机号',
        disableSendBtn: true
      })
    }
  },
  checkSms: function(val){
    let reg = /^[0-9]{6}/
    if (reg.test(val.detail)) {
      this.setData({
        disableSubmitBtn: false,
        sms: val.detail
      })
    }else{
      this.setData({
        disableSubmitBtn: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = options.token
    this.data.token = token
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
  sendMsg: function(){
    console.log('发送验证码')
    console.log(this.data.phone)
    wx.request({
      url: app.globalData.url+'api/v1/user/sendCode',
      method: 'POST',
      data: {
        'token': this.data.token,
        'phone': this.data.phone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        if(res.data.code == -1){
          Toast({
            type: 'fail',
            mask: true,
            message: res.data.msg
          })
        }else{
          Toast.success('发送成功\n五分钟有效');
        }
      }
    })
    this.setData({
      msgServerBlock: true,
      timer: 60
    })
    let func = this.countdown
    let myintervalId = setInterval(func, 1000)
    this.setData({
      intervalId: myintervalId
    })
  },
  countdown: function(context){
    let count = this.data.timer
    if(count == 0){
      clearInterval(this.data.intervalId)
      this.setData({
        msgServerBlock: false,
        btnText: '发送验证码'
      })
    }else{
      let btnText2 = `还有${count}秒`
      count-=1
      this.setData({
        btnText: btnText2,
        timer: count
      })
    }
  },
  submit: function(){
    console.log("提交")
    wx.request({
      url: app.globalData.url+'api/v1/user/addPhone',
      method: 'POST',
      data: {
        'token': this.data.token,
        'phone': this.data.phone,
        'code': this.data.sms
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        if(res.data.code == 1)
        {
          Toast.success('绑定成功!');
          setTimeout(()=>{
            wx.redirectTo({
              url: '../main/main'
            })
          },500)
        }else  if(res.data.code == -1){
          Toast.fail(res.data.msg);
        }
      }
    })
  }
})