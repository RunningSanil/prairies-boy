var app=getApp(),cdnImage=require('../../../utils/cdnImage'),each=require('../../../utils/each'),money=require('../../../utils/money'),extend=require('../../../utils/extend'),time=require('../../../utils/time'),toUnderscoreCase=require('../../../utils/toUnderscoreCase'),ZUI=require('../../../bower_components/zui/dist/index'),Message=require('./message'),countdownTimer=null;Page(extend({},ZUI.Toast,ZUI.Quantity,ZUI.TopTips,Message,{assistData:{pictureIndex:0},data:{alias:'',height:'750rpx',showGoodsDialog:!1,goods:null,selectedSku:{s1:0,s2:0,s3:0,price:null,stockNum:null,skuId:null},skuValueMap:{},dialogGoodsImage:'',quantity:1,maxQuantity:10,messages:[],timelimitedDiscount:{},countdown:[],shopCert:[],tradeOrderPaid:!1,isSetShoppingCart:!0,supportShoppingCart:!1,cartCount:0},onLoad(a){this.setData({alias:a.alias}),this.fetchGoodsDetail(),app.getShopCert(b=>{this.setData({shopCert:b})}),this.setShopStatus(),app.once('trade:order:paid',()=>{this.setData({tradeOrderPaid:!0})},this),app.on('show',()=>{this.setShopStatus()})},onShow(){this.runCountdown(),this.data.tradeOrderPaid&&wx.switchTab({url:'/pages/usercenter/dashboard/index'}),this.fetchCartCount()},onShareAppMessage(){return{title:this.data.goods.title,desc:this.data.goods.subTitle,path:`/pages/goods/detail/index?alias=${this.data.alias}`}},refresh(){wx.redirectTo({url:'/pages/goods/detail/index?alias='+this.data.alias})},setShopStatus(){app.getShopStatus(a=>{this.setData({isSetShoppingCart:a.is_set_shopping_cart})})},fetchGoodsDetail(){wx.showToast({title:'\u52A0\u8F7D\u4E2D',icon:'loading'}),app.carmen({api:'weapp.wsc.item.detail/1.0.0/get',query:{alias:this.data.alias,fans_type:app.getFansType()},success:a=>{this.setData(this.parse(a)),this.generateSkuValueMap(),this.generateSkuImages(),this.generateSkuDesc(),this.generateMaxQuantity(),this.generateRemianTime(),this.setData({dialogGoodsImage:this.getDialogGoodsImage()})},fail:a=>{wx.showModal({title:'\u83B7\u53D6\u5546\u54C1\u8BE6\u60C5\u5931\u8D25',content:a.msg,showCancel:!1,confirmText:'\u8FD4\u56DE',success:()=>{wx.navigateBack()}})},complete:()=>{wx.hideToast()}})},fetchCartCount(){app.carmen({api:'kdt.trade.cart/1.0.0/count',success:a=>{this.setData({cartCount:+a.data})}})},parse(a){var b={},c=a.components[0],d=this.parseBrief(a),g=this.parseSku(a),h=c.messages||[],k=a.activity.goods_preference||{};b.id=d.item_id,b.title=d.title,b.subTitle=c.sub_title,b.price=this.parsePrice(g,d),b.quota=+d.quota,b.quotaUsed=+d.quota_used,b.isDisplay='1'==d.is_display,b.presale=+d.presale;var l=d.presale_info;return b.presale&&l&&(0===l.etd_type?b.presaleDesc=l.etd_start.replace(/-/g,'.')+'\u5F00\u59CB\u53D1\u8D27':1===l.etd_type&&(b.presaleDesc='\u4ED8\u6B3E'+l.etd_days+'\u5929\u540E\u53D1\u8D27')),b.origin=!g.none_sku&&g.origin?g.origin:d.origin,b.pictureRatio=0,b.picture=[],b.originPicture=[],each(d.picture,m=>{b.picture.push(cdnImage(m.url,'!730x0.jpg')),b.originPicture.push(m.url),b.pictureRatio=Math.max(0.5,Math.min(1,Math.max(b.pictureRatio,+m.height/+m.width)))}),b.pictureWidth=app.getSystemInfoSync().windowWidth,b.pictureHeight=Math.ceil(b.pictureWidth*b.pictureRatio),b.content=(c.content||[]).map(m=>{return'image'==m.type&&(m.url=cdnImage(m.url),m.width='750rpx',m.height='750rpx'),m}),h=h.map(m=>{return'image'===m.type&&(m.uploading=!1,m.formatedUrl=''),m.value='',m}),{sku:g,goods:b,messages:h,goodsPreference:k,orderPreference:this.parseOrderPreference(a.activity.order_preference),timelimitedDiscount:k.is_started&&'timelimitedDiscount'===k.type?k:{},delivery:{postage:a.delivery.postage,postage_desc:(a.delivery.postage_desc||'').replace('~',' - ')},supportShoppingCart:0==d.is_virtual}},parseBrief(a){var b=a.brief,c=a.sku,d=a.activity.goods_preference;return d&&d.is_started&&c.none_sku&&(b.origin=b.price,b.price=d.show_price),b},parseSku(a){var b=a.sku,c=a.activity.goods_preference;return c&&c.is_started&&!b.none_sku&&(b.origin=b.price,b.price=c.show_price,b.min_price=c.price_range.min,b.max_price=c.price_range.max,each(b.list,d=>{d.price=c.skus[d.id].price})),b.mapList={},each(b.list,d=>{b.mapList[[d.s1,d.s2,d.s3].join('-')]=d}),b.mapTree={},each(b.tree,d=>{each(d.v,g=>{b.mapTree[g.id]=g})}),b},parsePrice(a,b){var c={};return c=a.none_sku||a.min_price==a.max_price?{desc:b.price,yuan:b.price.split('.')[0],fen:b.price.split('.')[1],isRange:!1}:{desc:a.price,isRange:!0,min:{desc:a.min_price,yuan:a.min_price.split('.')[0],fen:a.min_price.split('.')[1]},max:{desc:a.max_price,yuan:a.max_price.split('.')[0],fen:a.max_price.split('.')[1]}},c},parseOrderPreference(a){var b=[],c='',d=[];a.cashBack=null;var g=a.cashBack,h=a.meetReduce,k=a.customerPostageFree,l=!1;return g&&(b.push('\u8FD4\u73B0'),c=`前${g.cashback_limit}笔订单返现；`),h&&h.length&&(b.push('\u6EE1\u51CF'),each(h,m=>{var o=[];m.cash?o.push(`满${m.meet}元减${m.cash}`):o.push(`满${m.meet}元`),m.postage&&(o.push('\u5305\u90AE'),l=!0),m.coupon_detail&&o.push(`送${m.coupon_detail.value}元优惠券`),m.present_detail&&o.push(`送${m.present_detail.title}赠品`),+m.score&&o.push(`送${m.score}积分`),d.push(o.join('\uFF0C'))})),(k||l)&&b.push('\u5305\u90AE'),a.labels=b,a.cashBackDesc=c,a.meetReduceDesc=d.join('\uFF1B'),a},toggleGoodsDialog(a){var b=!1,c=this.data,d=c.goods,g=c.showGoodsDialog;if(a&&a.currentTarget){var h=a.currentTarget.dataset;b=h.isCart}g||(0<d.quota&&d.quota===d.quotaUsed?(this.showZuiToast(`该商品每人限购${d.quota}件，您之前已经购买过${d.quota}件！`),this.setData({buyButtonDisabled:!0})):this.setData({buyButtonDisabled:!1})),this.setData({showGoodsDialog:!g,addToCart:b})},toggleOrderPreferenceDialog(){this.setData({showOrderPrefernceDialog:!this.data.showOrderPrefernceDialog})},handleSwiperChange(a){this.assistData.pictureIndex=a.detail.current},handleSwiperImageTap(){var a=this.data,b=a.goods.originPicture;wx.previewImage({current:b[this.assistData.pictureIndex],urls:b})},handleDialogImageTap(){wx.previewImage({urls:[this.getDialogGoodsImage(!0)]})},handleDetailImageLoad(a){var b=a.currentTarget.dataset,c=b.index,d=app.getSystemInfoSync();if(d){var g=d.windowWidth,h=a.detail.width,k=a.detail.height,l=Math.min(g,h);this.setData({[`goods.content[${c}].width`]:l+'px',[`goods.content[${c}].height`]:l*k/h+'px'})}},handleZuiQuantityChange(a){this.setData({quantity:a.quantity})},getOrderData(){var a=this.data,b=a.goods,c=a.sku;if(!this.validate()){var d={};each(a.messages,k=>{d[k.name]=k.value});var g={message:d,activityAlias:'',activityId:0,activityType:0,num:a.quantity,price:0,skuId:null,goodsId:b.id,kdtId:app.getKdtId()};if(c.none_sku)g.skuId=c.collection_id,g.price=b.price.desc;else{var h=c.mapList[this.getSelectedSkuKey()]||{};g.skuId=h.id,g.price=h.price}return g.price=money(g.price).toCent(),g}},handleAddToCart(){var a=this.getOrderData();a&&app.carmen({api:'kdt.trade.cart/1.0.0/add',data:toUnderscoreCase(a),success:()=>{this.toggleGoodsDialog(),this.setData({cartCount:this.data.cartCount+1}),this.showZuiToast('\u5DF2\u6210\u529F\u6DFB\u52A0\u5230\u8D2D\u7269\u8F66')},fail:b=>{this.showZuiToast(b.msg)}})},handleBuy(){var a=this.getOrderData();if(a){var b=app.db.set({type:'goods',goods_list:[a]});wx.navigateTo({url:'/pages/trade/buy/index?dbid='+b})}},handleBack(){wx.navigateBack()},onSkuValueTap(a){var b=a.currentTarget.dataset;b.disabled||(this.recordSelectedSku(b),this.setData({dialogGoodsImage:this.getDialogGoodsImage()}))},recordSelectedSku(a){if(!a)return null;var b=this.data.selectedSku,c=this.data.sku;b[a.skuKey]=b[a.skuKey]==a.skuValueId?0:a.skuValueId;var d=c.mapList[this.getSelectedSkuKey()]||{};b.price=d.price||null,b.stockNum=d.stock_num||null,b.skuId=d.id||null,this.setData({selectedSku:b}),this.generateSkuDesc(),this.generateSkuValueMap(),this.generateMaxQuantity()},generateSkuValueMap(){var a=this.data.sku,b=a.tree,c=a.list,d=this.data.selectedSku,g={};for(var h=1;h<=b.length;h++){var k='s'+h,l=c.filter(m=>{return('s1'==k||!d.s1||m.s1==d.s1)&&('s2'==k||!d.s2||m.s2==d.s2)&&('s3'==k||!d.s3||m.s3==d.s3)});l.forEach(m=>{var o=g[m[k]]||0;g[m[k]]=+m.stock_num+o})}this.setData({skuValueMap:g})},generateSkuDesc(){var a=this.data,b=a.selectedSku,c=a.sku,d=[];if(c.mapList[this.getSelectedSkuKey()]){d.push('\u5DF2\u9009:');for(var g=1;g<=c.tree.length;g++)d.push(c.mapTree[b['s'+g]].name)}else{d.push('\u9009\u62E9:');for(var h=1;h<=c.tree.length;h++)0==b['s'+h]&&d.push(c.tree[h-1].k)}this.setData({'sku.desc':d.join(' ')})},generateSkuImages(){var a=this.data,b=a.sku,c={};b.none_sku||each(b.tree[0].v,d=>{c[d.id]=d.imgUrl}),this.assistData.skuImages=c},generateMaxQuantity(){var a=this.data,b=this.data.sku,c=a.goods.quota,d=a.goods.quotaUsed,g=a.quantity,h=Infinity,k=0;c=0==c?Infinity:Math.max(0,c-d);var l=b.mapList[this.getSelectedSkuKey()];k=l?+l.stock_num:+b.stock_num,h=Math.min(k,c),g>h&&(g=h),this.setData({quantity:g,maxQuantity:h})},generateRemianTime(){var a=this.data.timelimitedDiscount;a&&a.is_started&&(this.assistData.remain=Date.now()+1e3*a.end_remain_time,this.runCountdown())},formatCountdown(a){var b=[];a=Math.max(0,a);var c=time.format(a).data;return 0!=c.day&&(c.hour+=24*c.day),b.push(c.hour),b.push(c.minute),b.push(c.second),b.map(d=>(10>d?'0':'')+d)},runCountdown(){this.assistData.remain&&(this.countdown(),countdownTimer=setInterval(()=>{this.countdown()},500))},countdown(){var a=this.assistData.remain-Date.now();return 0>a?(clearInterval(countdownTimer),this.refresh()):void this.setData({countdown:this.formatCountdown(a)})},getSelectedSkuKey(){var a=this.data.selectedSku;return[a.s1,a.s2,a.s3].join('-')},getDialogGoodsImage(a){var b=this.data,c=this.assistData.skuImages[b.selectedSku.s1]||b.goods.originPicture[0];return cdnImage(c,a?'':'!160x160.jpg')},validate(){return this.validateSku()||this.validateMessages()},validateSku(){var a=!1,b=this.data,c=b.sku,d=[];if(!c.none_sku&&!c.mapList[this.getSelectedSkuKey()]){for(var g=1;g<=c.tree.length;g++)b.selectedSku['s'+g]||d.push(c.tree[g-1].k);a=!0,this.showZuiTopTips('\u8BF7\u9009\u62E9: '+d.join(' '))}return a},validateMessages(){var a=this.data,b=a.messages;if(b.length)for(var c=0;c<b.length;c++){var d=b[c];if(+d.required&&!d.value)return this.showZuiTopTips('\u8BF7\u586B\u5199: '+d.name),!0}return!1},catchTouch(){},onHide(){clearTimeout(countdownTimer)},onUnload(){clearTimeout(countdownTimer),app.off(null,null,this)}}));