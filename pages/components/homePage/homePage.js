// pages/components/homePage/homePage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  created() {
    //打开小程序时，获取当前位置，根据您的位置匹配提供当地的家政
    wx.getLocation({
      isHighAccuracy: true,
      success(e) {
        // console.log('首页获取地理位置信息', e);
      }
    })
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})