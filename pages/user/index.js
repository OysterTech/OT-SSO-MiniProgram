var utils = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: '欢迎使用 生蚝科技工具箱小程序 ~~',
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
		var _this = this;

		_this.setData({
			toggleDelay: true
		})
		setTimeout(function () {
			_this.setData({
				toggleDelay: false
			})
		}, 1000)
    if (wx.getStorageSync('SSOUnionId') == "") {
      this.checkHasBindUser();
    }
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
    this.checkHasBindUser();
    this.onLoad();
  },


  gotoBindUser: function() {
    wx.navigateTo({
      url: '/pages/SSOScanLogin/user/bind',
    })
  },


  cancelBind: function(opt) {
    var _this = this;
    var formId = opt.detail.formId;

    wx.showModal({
      title: '温馨提醒',
      content: '确认要取消绑定SSO通行证吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.apiUrl + "cancelBindUser",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              'openId': wx.getStorageSync('openId')
            },
            method: "post",
            dataType: 'json',
            success: ret => {
              var ret = ret.data;
              if (ret.code == 200) {
                var userInfo = wx.getStorageSync('SSOUserInfo');
                wx.removeStorageSync('SSOUnionId');
                wx.removeStorageSync('SSONickName');
                wx.removeStorageSync('SSOUserInfo');

                _this.setData({
                  hasBindUser: false,
                  SSONickName: ''
                });

                utils.toSendTemplate("1FANwbwmmv-Sq0F7VXNz5wR20XLpIyF3HlXN208fQKQ", formId, [userInfo['userName'], userInfo['nickName'], utils.getNowDate(), '解绑成功！期待您再次使用我们的服务！']);

                wx.showToast({
                  title: '成功取消绑定',
                  icon: 'success',
                  mask: true,
                  duration: 2000
                })
              } else {
                wx.showModal({
                  title: '系统提示',
                  content: '取消绑定失败！',
                  showCancel: false
                })
              }
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },


  checkHasBindUser: function() {
    var _this = this;

    wx.request({
      url: app.globalData.apiUrl + "getUserInfo",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openId': wx.getStorageSync('openId')
      },
      dataType: 'json',
      success: ret => {
        var ret = ret.data;
        if (ret.code == 200) {
          var unionId = ret.data['userInfo']['unionId'];
          var nickName = ret.data['userInfo']['nickName'];

          wx.setStorageSync('SSOUnionId', unionId);
          wx.setStorageSync('SSONickName', nickName);
          wx.setStorageSync('SSOUserInfo', ret.data['userInfo']);

          _this.setData({
            hasBindUser: true,
            SSONickName: nickName
          });
        } else if (ret.code != 403) {
          wx.showModal({
            title: '系统提示',
            content: '检查绑定用户状态失败！',
            showCancel: false
          })
        }
      }
    })
  },


  showInfo: function() {
    wx.navigateTo({
      url: '/pages/SSOScanLogin/user/info',
    })
  }
})