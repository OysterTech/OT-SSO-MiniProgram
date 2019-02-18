var utils = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loading: false,
    ticket: "",
    appName: "",
    showBindModal: "",
    openId: ""
  },


  onLoad: function(options) {
    var _this = this;
    this.setData({
      ticket: options.scene
    })

    // 检查是否已绑定通行证
    var openId = wx.getStorageSync('openId');
    var unionId = wx.getStorageSync('SSOUnionId');
    if (unionId != "") {
      _this.setData({
        openId: openId
      })
    } else {
      _this.setData({
        showBindModal: true
      })
    }

    if (this.data.showBindModal !== true) {
      _this.setData({
        loading: true
      });

      // 发送已扫描状态请求
      wx.request({
        url: app.globalData.apiUrl + "handler",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'mod': 'scan',
          'ticket': _this.data.ticket
        },
        method: 'post',
        dataType: 'json',
        success: function(ret) {
          var ret = ret.data;
          var errorContent = '';
          var appName = '';

          _this.setData({
            loading: false
          });

          if (ret.code == 200) {
            appName = ret.data['appName'];
            _this.setData({
              appName: appName,
              nickName: wx.getStorageSync('SSONickName')
            });
            return;
          } else if (ret.code == 404) {
            errorContent = '二维码信息不存在！\r\n请刷新浏览器二维码并重扫！';
          } else if (ret.code == 1) {
            errorContent = '二维码已失效！\r\n请刷新浏览器二维码并重扫！';
          } else if (ret.code == 500) {
            errorContent = '数据库刷新状态失败！\r\n请联系技术支持！';
          } else {
            errorContent = '系统错误！\r\n请联系技术支持！';
          }

          wx.showModal({
            title: '系统提示',
            content: errorContent,
            showCancel: false,
            success() {
              wx.switchTab({
                url: '/pages/SSOScanLogin/index',
              })
            }
          })
        },
        fail: function(e) {
          console.log(e);
          wx.showModal({
            title: '系统提示',
            content: '服务器获取二维码信息失败！请重试！',
            showCancel: false,
            success() {
              wx.switchTab({
                url: '/pages/SSOScanLogin/index',
              })
            }
          })
        }
      })
    }
  },


  toLogin: function(obj) {
    var _this = this;
    var ticket = this.data.ticket;
    var openId = this.data.openId;
    var formId = obj.detail.formId;
    var userInfo = wx.getStorageSync('SSOUserInfo');

    _this.setData({
      loading: true
    })

    wx.request({
      url: app.globalData.apiUrl + "handler",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'mod': 'login',
        'ticket': ticket,
        'openId': openId
      },
      method: 'post',
      dataType: 'json',
      success: function(ret) {
        var ret = ret.data;
        var errorContent = '';

        if (ret.code == 200) {
          errorContent = '登录成功！\r\n请返回浏览器操作！';

          utils.getAccessToken();
          utils.addLoginLog(userInfo['nickName'], _this.data.appName, utils.getNowDate());
          utils.toSendTemplate("Ezgd56R9zdvw3SSKKDpS1yY15ox_pdYmvDCR7lDWUs4", formId, [userInfo['userName'], userInfo['nickName'], _this.data.appName, utils.getNowDate(), '登录成功！'], 'subpackage/loginLog/pages/list');
        } else if (ret.code == 4031) {
          errorContent = '当前用户尚未绑定通行证！';
        } else if (ret.code == 4032) {
          errorContent = '当前绑定的通行证暂无权限访问此应用！';
        } else if (ret.code == 500) {
          errorContent = '数据库错误！\r\n请联系技术支持！';
        } else {
          errorContent = '系统错误！\r\n请联系技术支持！';
        }

        _this.setData({
          loading: false
        })

        wx.showModal({
          title: '系统提示',
          content: errorContent,
          showCancel: false,
          success() {
            wx.switchTab({
              url: '/pages/SSOScanLogin/index',
            })
          }
        })
      },
      fail: function(e) {
        _this.setData({
          loading: false
        })
        wx.showModal({
          title: '系统提示',
          content: '服务器授权失败！请重试！',
          showCancel: false
        })
      }
    })
  },


  onUnload: function() {
    // 点击导航栏返回，取消登录
    this.cancelLogin();
  },


  cancelLogin: function() {
    var ticket = this.data.ticket;
    wx.request({
      url: app.globalData.apiUrl + "handler",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'mod': 'cancel',
        'ticket': ticket
      },
      method: 'post',
      dataType: 'json',
      complete: function(ret) {
        wx.switchTab({
          url: '/pages/SSOScanLogin/index',
        })
      }
    })
  },


  gotoBindUser: function() {
    wx.navigateTo({
      url: '/pages/SSOScanLogin/user/bind',
    })
  }
})