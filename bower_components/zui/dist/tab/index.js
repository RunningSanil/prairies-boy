var Tab = {
  _handleZuiTabChange(a) {
    var b = a.currentTarget.dataset,
    c = b.componentId,
    d = b.itemId,
    f = {
      componentId: c,
      selectedId: d
    };
    console.info('[zui:tab:change]', f),
    this.handleZuiTabChange ? this.handleZuiTabChange(f) : console.warn('\u9875\u9762\u7F3A\u5C11 handleZuiTabChange \u56DE\u8C03\u51FD\u6570')
  }
};
module.exports = Tab;