function handle(a,b){var c=a.currentTarget.dataset,d=c.componentId,f=c.disabled,g=+c.quantity;return f?null:void callback.call(this,d,g+b)}function callback(a,b){b=+b;var c={componentId:a,quantity:b};console.info('[zui:quantity:change]',c),this.handleZuiQuantityChange?this.handleZuiQuantityChange(c):console.warn('\u9875\u9762\u7F3A\u5C11 handleZuiQuantityChange \u56DE\u8C03\u51FD\u6570')}var Quantity={_handleZuiQuantityMinus(a){handle.call(this,a,-1)},_handleZuiQuantityPlus(a){handle.call(this,a,1)},_handleZuiQuantityBlur(a){var b=a.currentTarget.dataset,c=b.componentId,d=+b.max,f=+b.min,g=a.detail.value;return g?(g=+g,g>d?g=d:g<f&&(g=f),callback.call(this,c,g),''+g):(setTimeout(()=>{callback.call(this,c,f)},16),callback.call(this,c,g),''+g)}};module.exports=Quantity;