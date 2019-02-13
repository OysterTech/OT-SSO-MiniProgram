var utils = require('../../utils/util.js');
const app = getApp();

Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
  },

  onLoad: function(options) {

  },

  onShow: function() {
    var _this = this;

    _this.setData({
      toggleDelay: true
    })
    setTimeout(function() {
      _this.setData({
        toggleDelay: false
      })
    }, 1000)
  }
})
