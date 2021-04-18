// pages/chart/charComponet1/charComponet1.js
import * as echarts from '../../../ec-canvas/echarts'
import Toast from '../../../dist/toast/toast';

const app = getApp()

let _this
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reqSelect: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ecTitle: '月销售情况',
    urls1: [], //销售额 url
    urls2: [], //利润 url
    week: ["周一","周二", "周三","周四", "周五", "周六", "周日"],
    xAxisTitle: [],
    xAxisData1: [],
    xAxisData2: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initChart(canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);

      let option = {
        title: {
          text: _this.data.ecTitle
        },
        tooltip: {},
        legend: {
          data: ['销售额', '利润'],
          right: 0
        },
        xAxis: {
          data: _this.data.xAxisTitle
        },
        yAxis: {},
        series: [{
            name: '销售额',
            type: 'bar',
            data: _this.data.xAxisData1
          },
          {
            name: '利润',
            type: 'bar',
            data: _this.data.xAxisData2
          }
        ]
      };
      chart.setOption(option);
      return chart;
    },
    timestampToTime(timestamp, type) {
      let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      if (type == 1) {
        return Y + M + D + h + m + s;
      }
      if (type == 2) {
        let str = Y + M + D
        str = str.substr(0, str.length - 1)
        return str
      }
    },
    ajax(url) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'GET',
          header: {
            'token': app.globalData.jwtToken,
          },
          success: function (res) {
            if (res.data.code == 1) {
              resolve(res.data)
            } else {
              reject(res.data.msg)
            }
          },
          fail: function () {
            reject('请求失败')
          }
        })

      })
    },
    ajaxPromisAll() {
      let promiseArry = []
      let __this = this
      this.data.urls1.forEach((item, index) => {
        promiseArry.push(__this.ajax(item)) //销售额请求
        promiseArry.push(__this.ajax(__this.data.urls2[index])) //利润请求
      })

      Promise.all(promiseArry).then((result) => {
        let _xAxisData1 = []
        let _xAxisData2 = []

        result.forEach(function (item, index) {
          if (index % 2 == 0) {
            _xAxisData1.push(item.data)
          } else {
            _xAxisData2.push(item.data)
          }
        })
        _this.setData({
          xAxisData1: _xAxisData1,
          xAxisData2: _xAxisData2
        })
        _this.echartInstance = _this.selectComponent('.ec-canvas')
        _this.echartInstance.init(_this.initChart)
      }).catch((msg) => {
        console.log('请求失败：' + msg)
      })

    },
    getAlldata() {
      let timestamp1 = new Date().getTime()
      let timestr = this.timestampToTime(timestamp1, 2)
      let timestrarry = timestr.split('-')
      let dateArry = []
      let _xAxisTitle = []
      let _urls1 = []
      let _urls2 = []
      let _ecTitle = '月销售情况'

      if(this.properties.reqSelect == 1){
        _ecTitle = '周销售情况'
        let todayDate = new Date(this.timestampToTime(new Date().getTime(), 2)).getTime()- 8*3600*1000
        let todayWeek = (new Date(todayDate).getDay() || 7 )
        let mondayDate = todayDate
        if(todayWeek != 1){
          mondayDate = todayDate - (3600*24*1000 * (todayWeek-1) )
          mondayDate = new Date(this.timestampToTime(mondayDate, 2)).getTime() - 8*3600*1000
        }
        //填充x轴 标题
        for (let i = 0; i < todayWeek; i++) {
          dateArry.push(new Date(mondayDate+i*24*3600*1000).getTime())
          _xAxisTitle.push(this.data.week[i])
        }
        //填充 请求url
        dateArry.forEach(function (item, index) {
          _urls1.push(app.globalData.financeUrl + 'statistics/getTotalByTimestamp?timestamp=' + item)
          _urls2.push(app.globalData.financeUrl + 'statistics/getProfitByTimestamp?timestamp=' + item)
        })
        console.log('_urls1',_urls1)
      }else{
        //填充x轴 标题
        for (let i = 0; i < parseInt(timestrarry[1]); i++) {
          dateArry.push(`${timestrarry[0]}-${i+1}-01`)
          _xAxisTitle.push(i + 1 + '月')
        }
        //填充 请求url
        dateArry.forEach(function (item, index) {
          let __timstamp = new Date(item).getTime()
          _urls1.push(app.globalData.financeUrl + 'statistics/getMonthTotalByTimestamp?timestamp=' + __timstamp)
          _urls2.push(app.globalData.financeUrl + 'statistics/getMonthProfitByTimestamp?timestamp=' + __timstamp)
        })
      }

      this.setData({
        xAxisTitle: _xAxisTitle,
        urls1: _urls1,
        urls2: _urls2,
        ecTitle: _ecTitle
      })
      this.ajaxPromisAll()
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.getAlldata()
      _this = this
      console.log(_this.properties.reqSelect)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
