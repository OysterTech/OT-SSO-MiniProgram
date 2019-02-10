const app = getApp();
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		userInfo:wx.getStorageSync('SSOUserInfo')
	},


	onLoad: function (options) {

	},


	copySSOUrl:function(){
		wx.setClipboardData({
			data: app.globalData.baseUrl,
			success(res) {
				wx.showToast({
					title: '复制成功',
					icon: 'success',
					mask:true,
					duration: 2000
				})
			}
		})
	}
})