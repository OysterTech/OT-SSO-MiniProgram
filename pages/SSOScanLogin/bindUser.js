const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    loading: false
  },

  onLoad: function(options) {

  },

  toBindUser: function(opt) {
    var _this = this;
    var formData = opt.detail.value;

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
					wx.setStorage({
						key: 'SSOUnionId',
						data: ret.data['unionId'],
					})
					wx.setStorage({
						key: 'SSONickName',
						data: ret.data['nickName'],
					})
          wx.showModal({
            title: '温馨提示',
            content: '恭喜您！绑定成功！',
            showCancel: false,
            success: function(res) {
							console.log(res)
              if (res.confirm==true) {
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