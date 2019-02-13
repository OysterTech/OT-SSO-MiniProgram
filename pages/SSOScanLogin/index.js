var utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    showAuthModal: false
  },

  onLoad: function(options) {
    var _this = this;
		utils.getAccessToken();
		
    wx.getStorage({
      key: 'openId',
      success(res) {
        if (res.data == null || res.data == "") {
          _this.loginToGetOpenId();
        }
      },
      fail(e) {
        _this.loginToGetOpenId();
      }
    })
  },

  startScan: function() {
    var _this = this;
    wx.scanCode({
      success(ret) {
        console.log(ret);
        var navigateUrl = '';

        if (ret.scanType == 'QR_CODE') {
          navigateUrl = '/' + ret.result;
        } else if (ret.scanType == 'WX_CODE') {
          navigateUrl = '/' + ret.path;
        }

				if (navigateUrl.substr(0, 24) !='/pages/SSOScanLogin/auth'){
					wx.showModal({
						title: '系统提示',
						content: '无效的二维码！\r\n请扫描系统登录页面的二维码！',
						showCancel:false
					});
					return false;
				}

        wx.navigateTo({
          url: navigateUrl,
          fail: function(e) {
            console.log(e);
            wx.showModal({
              title: '系统提示',
							content: '系统跳转失败！\r\n请联系技术支持！',
              showCancel: false
            })
          }
        })
      },
      fail: function(e) {
        console.log(e);
        if (e.errMsg != 'scanCode:fail cancel') {
          wx.showModal({
            title: '系统提示',
						content: '扫码失败！\r\n请重试！',
            showCancel: false
          })
        }
      }
    })
  },

  loginToGetOpenId: function() {
    wx.login({
      success(res) {
        wx.request({
          url: app.globalData.apiUrl + 'getOpenId',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'code': res.code
          },
          dataType: 'json',
          success: function(ret) {
            ret = ret.data;
            if (ret.code == 200) {
              wx.setStorage({
                key: 'openId',
                data: ret.data['openId']
              })
            } else if (ret.code == 500) {
              wx.showModal({
                title: '系统提示',
                content: '获取用户信息失败！',
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '系统提示',
								content: '服务器接口出错！\r\n请联系技术支持并提供错误码[QR.GPI' + ret.code + ']！',
                showCancel: false
              })
            }
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    })
  },

  hideModal: function() {
    this.setData({
      showAuthModal: false
    })
  },


	onShareAppMessage() {
		return {
			title: '生蚝科技统一身份认证平台扫码登录',
			path: '/pages/SSOScanLogin/index'
		}
	}
})