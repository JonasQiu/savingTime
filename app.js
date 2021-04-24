import Goeasy from './utils/User/talk'
//app.js
App({
  onLaunch: function () {
    // 云开发初始化
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true,
        env: "saving-time"
      })
    }
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    // goeasy创建
    this.initGoEasy()
  },
  globalData: {
    // talk
    goeasy: '',
  },
  //通讯初始化
  initGoEasy() {
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.globalData.goeasy = Goeasy.initGoeasy(res.data)
      }
    })
  },
  // 格式化日期函数
  formatDate: function (time) {
    const date = new Date(time);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber).join(':');
  },
  // 格式化数字
  formatNumber: function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },
})