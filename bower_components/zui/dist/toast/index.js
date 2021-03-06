module.exports = {
    showZuiToast(a, b) {
        var c = this.data.zuiToast || {};
        clearTimeout(c.timer),
        c = {
            show: !0,
            title: a
        },
        this.setData({
            zuiToast: c
        }),
        c.timer = setTimeout(() => {
            this.clearZuiToast()
        },
        b || 3e3)
    },
    clearZuiToast() {
        var a = this.data.zuiToast || {};
        clearTimeout(a.timer),
        this.setData({
            'zuiToast.show': !1
        })
    }
};