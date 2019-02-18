var utils = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loading: false
  },

  onLoad: function(options) {

  },

  toBindUser: function(obj) {
    var _this = this;
    var formData = obj.detail.value;
    var formId = obj.detail.formId;

    this.setData({
      loading: true
    });

    if ((formData.userName).length < 5 || (formData.userName).length > 20) {
      wx.showModal({
        title: '温馨提示',
        content: '请正确输入通行证用户名！',
        showCancel: false,
        complete: function() {
          _this.setData({
            loading: false
          });
        }
      })
    }
    if ((formData.password).length < 6 || (formData.userName).length > 20) {
      wx.showModal({
        title: '温馨提示',
        content: '请正确输入通行证密码！',
        showCancel: false,
        complete: function() {
          _this.setData({
            loading: false
          });
        }
      })
    }

    wx.request({
      url: app.globalData.apiUrl + "bindUser",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openId': wx.getStorageSync('openId'),
        'userName': formData.userName,
        'password': formData.password
      },
      method: 'post',
      dataType: 'json',
      success: function(ret) {
        var ret = ret.data;
        if (ret.code == 200) {
          var userInfo = ret.data['userInfo'];

          wx.setStorage({
            key: 'SSOUnionId',
            data: userInfo['unionId'],
          })
          wx.setStorage({
            key: 'SSONickName',
            data: userInfo['nickName'],
          })
          wx.setStorage({
            key: 'SSOUserInfo',
            data: userInfo,
          })

          utils.toSendTemplate("V_E-_8brTuJ78NBhHt5KEkUAOSdSxcJwhPKUtHE6FV0", formId, [userInfo['userName'], userInfo['nickName'], '通行证用户', userInfo['phone'], userInfo['email'], utils.getNowDate(), '绑定成功', '使用当前微信账号可直接扫码登录 统一身份认证平台，无需再输入密码'], 'pages/SSOScanLogin/index');

          wx.showModal({
            title: '温馨提示',
            content: '恭喜您！绑定成功！',
            showCancel: false,
            success: function(res) {
              console.log(res)
              if (res.confirm == true) {
                wx.navigateBack({});
              }
            }
          });
        } else if (ret.code == 404 || ret.code == 403) {
          wx.showModal({
            title: '温馨提示',
            content: '通行证用户名或密码无效！',
            showCancel: false,
            complete: function() {
              _this.setData({
                loading: false
              });
            }
          });
        } else {
          wx.showModal({
            title: '系统提示',
            content: '系统错误！\r\n请联系管理员！',
            showCancel: false,
            complete: function() {
              _this.setData({
                loading: false
              });
            }
          });
        }
      },
      fail: function(e) {
        console.log(e);
        wx.showModal({
          title: '系统提示',
          content: '连接SSO服务器失败！',
          showCancel: false,
          complete: function() {
            _this.setData({
              loading: false
            });
          }
        })
      }
    })
  }
})