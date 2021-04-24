const Login = require('../../../utils/User/Login')
let i = 0;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    my: {
      list: [{
          name: '我的订单',
          icon: 'pay'
        },
        {
          name: '待付款',
          icon: 'send'
        }, {
          name: '待使用',
          icon: 'remind'
        }, {
          name: '待评价',
          icon: 'comment'
        }, {
          name: '退款/售后',
          icon: 'refund'
        }
      ],
      gif: 'https://6564-education-1hoqw-1302178671.tcb.qcloud.la/something/wave.gif?sign=5c3c3415bbed09424a5618b6c082fc12&t=1619012415'
    },
    isDoing: true,
    //功能列表
    funcList: [{
      url: '',
      icon: 'vip',
      content:'会员中心'
    }, {
      url: '',
      icon: 'ticket',
      content: '红包卡卷'
    }, {
      url: '',
      icon: 'shop',
      content: '买卖流程'
    }, {
      url: '',
      icon: 'calendar',
      content: '地址管理'
    }, {
      url: '',
      icon: 'repair',
      content: '安全保险'
    }, {
      url: '',
      icon: 'copy',
      content: '我的租约'
    }, {
      url: '',
      icon: 'commentfill',
      content: '我的问答'
    }, {
      url: '',
      icon: 'form',
      content: '意见反馈'
    },  {
      url: '',
      icon: 'profile',
      content: '联系客服'
    } ]
  },
  created() {
    wx.showLoading({
      title: '正在加载数据...',
    })
  },
  ready() {
    wx.hideLoading()
  },
  attached() {
    let that = this
    this.numDH();
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: res.data,
        })
      }
    })
  },
  methods: {
    numDH() {
      let that = this
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          that.numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(19),
          forksCount: that.coutNum(24),
          visitTotal: that.coutNum(15)
        })
      }
    },
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    //获取用户信息，进行登录处理
    onGetUserInfo(e) {
      let that = this;
      wx.getUserProfile({
        desc: '用于完善用户信息',
        success(res) {
          if (that.data.userInfo) {
            wx.showToast({
              title: '您已经登录过啦',
            })
            return
          }
          wx.showLoading({
            title: '正在登录中…请稍后…',
          })
          if (res.userInfo) {
            // console.log('my获取登陆信息', e.detail.userInfo);
            //登陆
            Login.Login(res.userInfo).then(res => {
              that.setData({
                userInfo: res,
              })
              wx.setStorage({
                key: 'userInfo',
                data: res
              })
              wx.redirectTo({
                url: '/pages/index/index',
              })
              wx.hideLoading();
              that.numDH(0)
            })
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showModal({
              title: "登录失败，请重新点击登录",
              content: "用户拒绝或取消授权登录",
              showCancel: false
            })
          }
        },
        fail(res) {
          console.log(res);
        }
      })

    },
    // 宫格点击
    fun_box(e) {
      let that = this;
      if (!that.data.userInfo) {
        wx.showToast({
          title: '请先登录哦',
        })
        return;
      }
      wx.showLoading({
        title: '正在跳转…',
      })
      let showData = {
        typeIndex: 0,
        titleName: e.currentTarget.dataset.myname,
        list: []
      }
      new Promise(async (resolve, reject) => {
        switch (e.currentTarget.dataset.myindex) {
          case 0:
            showData.typeIndex = 1;
            showData.list = await comFunBox.MyOrg(that.data.userInfo._id);
            break;
          case 1:
            showData.typeIndex = 2;
            showData.list = await comFunBox.MyPage(that.data.userInfo._id);
            break;
        }
        resolve(showData)
      }).then(res => {
        that.setData({
          usuallyData: res,
          isShowUsu: true
        })
        wx.hideLoading()
      }).catch(res => {
        wx.hideLoading()
        wx.showToast({
          title: '刷新失败',
        })
      })


    },
  }
})