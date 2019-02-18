// 开工时间：2019-01-25

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

    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备就绪，重启即可享受更好的体验哦~！',
        confirmText: '马上更新',
        confirmColor: '#00EC00',
        cancelText: '放弃',
        cancelColor: '#FF0000',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })
    })

    updateManager.onUpdateFailed(function(res) {
      console.log(res);
      wx.showModal({
        title: '系统更新提示',
        content: '新版本下载失败！',
        showCancel: false
      })
    })
  }
})