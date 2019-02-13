var utils = require('../../utils/util.js');
const app = getApp();

Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
	},

	onLoad: function (options) {

	},
	showZan: function () {
		wx.previewImage({
			urls: ["https://api.xshgzs.com/dfd/images/supportMe.jpg"]
		})
	},
})
