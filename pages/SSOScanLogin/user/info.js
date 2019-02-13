var utils = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    editing: false,
    leftSymbol: '<',
    fieldCNName: {
      'userName': '用户名',
      'nickName': '昵称',
      'phone': '手机号',
      'email': '邮箱',
      'oldPassword': '密码'
    }
  },


  onLoad: function() {
    this.setData({
      userInfo: wx.getStorageSync('SSOUserInfo')
    })
  },


  editUserInfo: function() {
    this.setData({
      editing: true
    })
  },


  toEditUserInfo: function(obj) {
    console.log(obj);

    var _this = this;
    let wechatUserInfo = wx.getStorageSync('userInfo');
    let wechatNickName = wechatUserInfo.nickName;
    let userInfo = this.data.userInfo;
    let formId = obj.detail.formId;
    let formData = obj.detail.value;
    let postData = {};
    let i = 0;
    let j = 0;
    let updateFieldCNName = [];

    this.setData({
      loading: true
    })

    // 要修改密码
    if (formData['oldPassword'] != '' && formData['newPassword'] != '' && formData['surePassword'] != '') {
      if (formData['newPassword'] != formData['surePassword']) {
        _this.showError('两次输入的密码不相同！');
        return false;
      } else if (formData['newPassword'] == formData['oldPassword']) {
        _this.showError('新旧密码不得相同！');
        return false;
      }
    }

    if (formData['userName'] != userInfo['userName'] && !_this.testUserName(formData['userName'])) {
      _this.showError('用户名仅许包含\r\n数字字母和下划线');
      return false;
    }

    if (formData['userName'] != userInfo['userName'] && formData['userName'].length < 5) {
      _this.showError('用户名长度须大于5位');
      return false;
    }

    if (formData['nickName'] != userInfo['nickName'] && formData['nickName'].length < 3) {
      _this.showError('昵称长度须大于3位');
      return false;
    }

    if (formData['phone'] != userInfo['phone'] && formData['phone'].length != 11) {
      _this.showError('请正确输入中国大陆手机号');
      return false;
    }

    // 检查是否有修改内容
    for (var field in formData) {
      i++;
      if (formData[field] == userInfo[field]) {
        j++;
      } else {
        if ((formData['oldPassword'] == '' && field.indexOf('Password') != -1) || field == 'surePassword') {
          continue;
        } else {
          postData[field] = formData[field];
          updateFieldCNName.push(_this.data.fieldCNName[field]);
        }
      }
    }

    if (j == (i - 3) && formData['oldPassword'] == "") {
      _this.showError('请修改你所需要改动的内容！');
      return false;
    }

    console.log(postData);

    wx.request({
      url: app.globalData.apiUrl + "updateUserInfo",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'unionId': wx.getStorageSync('SSOUnionId'),
        'postData': JSON.stringify(postData)
      },
      method: 'post',
      dataType: 'json',
      success: function(ret) {
        var ret = ret.data;
        if (ret.code == 200) {
          _this.setData({
            loading: false
          });

          wx.removeStorageSync('SSOUnionId');
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            mask: true,
            duration: 1500,
            success: function() {
              updateFieldCNName = updateFieldCNName.join(',');
              updateFieldCNName = updateFieldCNName.substr(0, updateFieldCNName.length - 1);
              let tips = updateFieldCNName.indexOf('密码') != -1 ? '下次于网页登录请使用新密码！' : '';
              tips += '如非本人操作，请及时联系管理员！';

              utils.toSendTemplate('fVA8fXAWg6X2Oieex5HKMdBIBFzNR80r7iYTGOrHkq4', formId, [updateFieldCNName, wechatNickName + '于' + utils.getNowDate() + '成功修改资料', tips], '/pages/user/index');

              setTimeout(function() {
                wx.navigateBack({})
              }, 1500);
            }
          })
        } else if (ret.code == 403) {
          _this.showError('旧密码有误！请重新输入！');
          return false;
        } else {
          _this.showError('系统错误！请联系管理员！');
          return false;
        }
      },
      fail: function(e) {
        _this.showError('服务器错误！请联系管理员！');
        return false;
      }
    });
  },


  testUserName: function(txt) {
    let r = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (r.test(txt)) {
      return false;
    } else {
      r = new RegExp(/^[\w]+$/);
      if (!r.test(txt)) {
        return false;
      } else {
        return true;
      }
    }
  },


  showError: function(content) {
    var _this = this;
    let time = Math.random() * (600 - 300) + 300;

    setTimeout(function() {
      _this.setData({
        loading: false
      });

      wx.showModal({
        title: '系统提示',
        content: content,
        showCancel: false
      })
    }, time);
  }
})