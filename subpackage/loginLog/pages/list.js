const app = getApp()
Page({

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

  onLoad: function(options) {
    let loginLogList = wx.getStorageSync('loginLogList');
    this.setData({
      loginLogList: loginLogList
    });
  },

  clearLog: function() {
    wx.showModal({
      title: '提示',
      content: '确认要清空登录记录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('loginLogList');
          wx.showToast({
            title: '清空成功',
            icon: 'success',
            duration: 1500,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({});
              }, 1500);
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  }
})