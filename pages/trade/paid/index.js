var moneyHelper=require('../../../utils/money'),app=getApp();Page({data:{fetching:!0,order_no:'',success:!1,data:{}},onLoad(a){var b=a.dbid,c=app.db.get(b),d=c.order_no;this.setData({order_no:d}),this.fetchOrderData()},fetchOrderData(){var a={};a.orderNo=this.data.order_no,a.kdtId=app.getKdtId(),wx.showToast({title:'\u6570\u636E\u67E5\u8BE2\u4E2D',icon:'loading',duration:1e4}),app.carmen({api:'kdt.trade.bill/1.0.0/payResult',data:{orderParams:JSON.stringify(a)},success:b=>{if(200!==b.code)return this.gotoOrderResult(),void wx.hideToast();var c=b.data||{},d=3<c.orderState;c.realPayStr=moneyHelper(c.realPay).toYuan(),this.setData({success:d,data:c,fetching:!1}),wx.hideToast()},fail:()=>{this.gotoOrderResult(),wx.hideToast()}})},gotoOrderResult(){var a=app.db.set({type:'order',order_no:this.data.order_no});wx.redirectTo({url:'/pages/trade/result/index?dbid='+a})}});