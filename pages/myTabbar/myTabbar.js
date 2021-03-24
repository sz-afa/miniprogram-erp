// pages/myTabbar/myTabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    select: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      
      switch(event.detail){
        case 0:
          console.log(0)
          break
        case 1:
          console.log(1)
          this.triggerEvent('popupShow')
          return
        case 2:
          console.log(2)
          wx.navigateTo({
            url: '../setting/setting'
        })
          break
        case 3:
          console.log(3)
          break
        case 4:
          console.log(4)
          break
      }
    
      this.setData({ active: event.detail });
    }
  }
})
