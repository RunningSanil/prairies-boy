var each=require('../../../../utils/each'),cdnImage=require('../../../../utils/cdnImage'),moneyHelper=require('../../../../utils/money'),app=getApp();module.exports={getBriefGoodsData(a){return a.map(b=>({sku_id:b.skuId,goods_id:b.goodsId,goods_type:b.goodsType,price:b.price,pay_price:b.payPrice,num:b.num}))},parseOrderData(a,b){var c=a.shopResultList[0],d=c.chargeCoupon||[],f=c.orderItemList||[],g=(c.activityResult||{}).activityNameList||[];f=f.map(m=>{m.imgUrl=cdnImage(m.imgUrl,'!200x200.jpg'),m.sku=JSON.parse(m.sku);var n='';m.sku.forEach(q=>{n+=q.v+' '}),m.skuStr=n;try{var o=JSON.parse(m.message),p=[];each(o,(q,r)=>{p.push({name:r,value:q})}),m.message=p}catch(q){m.message=[]}return m.payPriceStr=moneyHelper(m.payPrice).toYuan(),m});var h=c.orderPayment,i={realPay:h.realPay,goodsPay:h.itemPay,postage:h.postage,activity:h.decrease},j=this.parsePaymentData(i),k={showDetail:!1},l=[];return(c.unavailableItemList||[]).forEach(m=>{var n=JSON.parse(m.sku),o='';n.forEach(q=>{o+=q.v+' '});var p={goodsId:m.goodsId,skuId:m.skuId,imgUrl:cdnImage(m.imgUrl,'!200x200.jpg'),priceStr:moneyHelper(m.price).toYuan(),title:m.title,num:m.num,unavailableDesc:m.unavailableDesc,skuStr:o};l.push(p)}),k.list=l,{shop:Object.assign(b.shop,{umpActivity:g,postage:h.postage,realPay:h.realPay,pay:h.pay,shopName:c.shopName,buyer_msg:c.buyerMsg||'',postageStr:moneyHelper(h.postage).toYuan(),itemPayStr:moneyHelper(h.itemPay).toYuan()}),coupons:Object.assign(b.coupons,{list:d}),is_virtual:a.isVirtual||a.hasVirtualGoods,goods_list:f,payment:i,payment_strs:j,unavailable_goods:k}},parsePaymentData(a){var b=moneyHelper(a.realPay).toYuan();return{realPayStr:b,goodsPay:moneyHelper(a.goodsPay).toYuan(),postage:moneyHelper(a.postage).toYuan(),activity:moneyHelper(a.activity).toYuan()}},parseOrderAddressData(a){return{address_detail:a.addressDetail,id:a.addressId,area_code:a.areaCode,city:a.city,community:a.community,county:a.county,postal_code:a.postalCode,province:a.province,tel:a.tel,user_name:a.userName}},formatCouponCodeData(a){var b=a.coupons,c=b.code,d={kdt_id:app.getKdtId(),item_pay:a.payment.goodsPay,postage:a.payment.postage,fans_type:1343,item_list:JSON.stringify(this.getBriefGoodsData(a.goods_list)),code:c};return d},formatOrderShowData(a,b){var c={};if(a.address&&a.address.id){var d={};d={addressDetail:a.address.address_detail,addressId:a.address.id,areaCode:a.address.area_code,city:a.address.city,community:a.address.community,county:a.address.county,expressType:0,expressTypeChosen:0,postalCode:a.address.postal_code,province:a.address.province,tel:a.address.tel,userName:a.address.user_name},c.billAddress=d}c.billCustomer={};var f=a.origin_goods_list;if(b){var g=a.unavailable_goods.list||[];f=f.filter(i=>{return!g.some(j=>{return j.goodsId=i.goodsId&&j.skuId==i.skuId})})}c.billGoodsList=f.map(i=>{i=Object.assign({},i);var j;return'cart'==a.orderFrom?j=i.message||{}:(j=[],each(i.message,k=>{j.push(k)})),i.message=JSON.stringify(j),i});var h=a.coupons.selected||{};return c.billShopList=[{buyWay:0,buyerMsg:a.shop.buyer_msg,couponId:h.id||0,couponType:h.type||0,currency:1,isForbidUmp:!1,isPinjian:0,isPoints:0,kdtId:app.getKdtId(),orderType:0,storeId:0}],c.billSource={bookKey:a.book_key,channel:'',clientIp:'127.0.0.1',hasUnvalidGoods:0,isReceiveMsg:a.sms||0,kdtId:app.getKdtId(),orderFrom:a.orderFrom||'',platform:'weixin',seller:'',source:'',track:'',orderMark:'wx_shop'},c},formatOrderPaymentData(a){var b={},c=app.globalData.token||{};return b.customer={buyerPhone:c.mobile||''},b.order={buyWay:getPayWay(a),kdtId:app.getKdtId(),orderNo:a.order_no},b.payExtra={clientIp:'127.0.0.1',forceWxShareKdtId:!1,forceWxpayBigunsign:!1,openId:c.openId,originClientIp:'127.0.0.1',userAgent:''},b}};function getPayWay(a){var b=a.payment||{},c=b.realPay,d=1;return 0==c&&(d=16),d}