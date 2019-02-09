//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: '欢迎使用 生蚝科技小程序 ~~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasBindUser: false
  },

  onLoad: function() {
    if (wx.getStorageSync('userInfo') != "") {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo,
          })
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    if (wx.getStorageSync('SSOUnionId') == "") {
      this.setData({
        hasBindUser: false
      })
    } else {
      this.setData({
        hasBindUser: true,
        SSONickName: wx.getStorageSync('SSONickName')
      })
    }
  },

  onShow: function() {
    this.onLoad();
  },

  getUserInfo: function(e) {
    console.log(e)

    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  gotoBindUser: function() {
    wx.navigateTo({
      url: '/pages/SSOScanLogin/bindUser',
    })
  }
})