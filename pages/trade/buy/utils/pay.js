var orderFormat=require('./format'),requestHelper=require('./request');module.exports=function(a,b={}){var c=orderFormat.formatOrderPaymentData(a),d=c.order.buyWay;requestHelper.payOrder(c,e=>{b.afterSync&&b.afterSync(),callPayAction(d,e,c,b)},e=>{b.fail&&b.fail(e)})};function callPayAction(a,b,c,d){switch(a){case 1:doWXPay(a,b,d);break;case 16:doCouponPay(a,b,d);break;default:}}function doWXPay(a,b,c){wx.requestPayment({timeStamp:b.timeStamp,nonceStr:b.nonceStr,package:b.package,signType:b.signType,paySign:b.paySign,success:d=>{c.success&&c.success(a,d)},fail:d=>{c.fail&&c.fail(d.errMsg)}})}function doCouponPay(a,b,c){c.success&&c.success(a,b)}