var timeHelper=require('./time.js');function CountDown(a,b){this.tid=null,this.leftTime=0;var c=new Date().getTime();b=b||{},this.leftTime=a,this.options=b,this._walkTime(c,this.leftTime)}CountDown.prototype={stop(){clearTimeout(this.tid),this.tid=null,this.stopped=!0},start(){if(!this.tid){this.stopped=!1;var a=new Date().getTime();this._walkTime(a,this.leftTime)}},setTime(a){this.stop(),this.leftTime=a,this.start()},_walkTime(a,b){return 0>=b?void(this.options.onEnd&&this.options.onEnd()):void(this.stopped||(this.tid=setTimeout(()=>{var c=new Date().getTime(),d=b-(c-a),e=timeHelper.format(d);this.options.onChange&&this.options.onChange(e.data,e.strData),this.leftTime=d,this._walkTime(c,this.leftTime)},500)))}},module.exports=CountDown;