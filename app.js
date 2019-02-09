//app.js
App({
  globalData: {
    baseUrl: "https://ssouc.xshgzs.com/",
    apiUrl: "https://ssouc.xshgzs.com/api/wxmp/"
  },
  onLaunch: function() {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
      }
    })
  }
})