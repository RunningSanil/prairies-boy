var each=require('../../../../../utils/each'),str=require('../../../../../utils/str'),cdnImage=require('../../../../../utils/cdnImage');module.exports={parseSafeBasicData(a,b){var c={},d={},e=[{text:'\u8BF7\u9009\u62E9\u5904\u7406\u65B9\u5F0F',code:0}];if(each(a.type,(g,h)=>{e.push({text:g,code:h})}),c.methods=e,c.pay_time=a.pay_time,c.goods_title=a.goods_title,b){var f=a.safe_info||{};c.moneyStr=f.refund_fee,c.phone=f.phone||'',c.message=f.remark||'',c.method=f.safe_type||0,c.express=0,c.reason=f.safe_reason||0,c.imgs=(f.ext_info||[]).map(g=>({uploading:!1,src:g,key:generateKey(),srcPreview:cdnImage(g,'!200x200.jpg')}))}return c.real_pay=a.real_pay,c.is_full_refund=a.is_full_refund,d.reason_relation=parseReasonRelationData(a.reason_relation),c.originData=d,c},getReasons(a,b=0,c=0){var d=[{code:0,text:'\u8BF7\u9009\u62E9\u9000\u6B3E\u539F\u56E0'}];return b?(d=1==b?d.concat(a.refund[c]||[]):d.concat(a.refund_and_return),d):d}};function generateKey(){return str.makeRandomString(8)+new Date().getTime()}function parseReasonRelationData(a){var b={};b.refund=a.refund.map(d=>{var e=[];return each(d,(f,g)=>{e.push({code:g,text:f})}),e});var c=[];return each(a.refund_and_return,(d,e)=>{c.push({code:e,text:d})}),b.refund_and_return=c,b}