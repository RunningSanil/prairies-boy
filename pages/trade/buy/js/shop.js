var app=getApp();module.exports={onMessageBlur(a){var b=a.detail.value,c=this.data.shop;c.buyer_msg=b,this.setData({shop:c})},showShopActivity(){var a=this.data.shop;a.showActivityDetail=!0,this.setData({shop:a})},hideShopActivity(){var a=this.data.shop;a.showActivityDetail=!1,this.setData({shop:a})},showGoodsMessage(a){var b=a.currentTarget.dataset.goodsid,c=a.currentTarget.dataset.skuid,d=this.data.goods_list.find(g=>{return g.goodsId==b&&g.skuId==c});if(d){var f=app.db.set(d);wx.navigateTo({url:'../goods_message/index?goods='+f})}},doReselectGoods(){wx.navigateBack()}};