const app = getApp();

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const getNowDate = () => {
  return formatTime(new Date());
}


const getAccessToken = () => {
  let storage = wx.getStorageSync('accessToken');

  if (storage == "" || storage[0] == "" || storage[1] <= (Date.parse(new Date()) / 1000)) {
    wx.request({
      url: app.globalData.apiUrl + 'getAccessToken/api',
      success: function(ret) {
        if (ret.data != "") {
          wx.setStorageSync('accessToken', [ret.data, (Date.parse(new Date()) / 1000) + 7200]);
        } else {
          wx.showModal({
            title: '系统提示',
            content: '获取票据失败！\r\n请联系管理员并提交错误码GACTN500',
            showCancel: false
          })
        }
      }
    });
  } else {
    return storage[0];
  }
}


const toSendTemplate = (templateId, formId, data = [], page = "", emphasisKeyword = "") => {
  if (templateId == "" || formId == "") {
    wx.showModal({
      title: '系统提示',
      content: '参数缺失！\r\n发送模板消息失败！',
      showCancel: false
    })
    return false;
  } else {
    let accessToken = getAccessToken();
    let openId = wx.getStorageSync('openId');
    var formData = {};

    for (let i in data) {
      let j = parseInt(i) + 1;
      formData['keyword' + j] = {};
      formData['keyword' + j].value = data[i];
    }

    formData = JSON.stringify(formData);

    wx.request({
      url: app.globalData.apiUrl + "toSendTemplate",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'accessToken': accessToken,
        'templateId': templateId,
        'openId': openId,
        'formId': formId,
        'data': formData,
        'page': page,
        'emphasisKeyword': emphasisKeyword
      },
      method: 'post',
      dataType: 'json',
      fail: e => {
        console.log('sendTpl-Fail', e);
      },
      success: ret => {
        ret = ret.data;
        if (ret.code == 200) {
          return;
        } else {
					console.log(ret);
          wx.showModal({
            title: '系统提示',
            content: '发送服务通知失败！',
            showCancel: false
          })
        }
      }
    })
  }
}


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  toSendTemplate: toSendTemplate,
  getNowDate: getNowDate,
  getAccessToken: getAccessToken
}