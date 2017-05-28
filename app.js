var Events = require('./utils/event'),
extend = require('./utils/extend'),
db = require('./utils/db'),
url = require('./utils/url'),
carmen = require('./utils/carmen'),
storage = require('./utils/storage'),
meta = require('./meta');
require('./polyfill/index');
function noop() {}
App(extend({},
Events, {
  VERSION: '1.2.011201',
  globalData: {
    systemInfo: null,
    userInfo: null,
    token: null,
    hasToken: !1
  },
  onLaunch() {
    this.db = db,
    this.carmen = carmen(this),
    this.storage = storage(this)
  },
  onShow() {
    this.checkSession(),
    this.trigger('show'),
    this.fetchAreaMapData()
  },
  checkSession() {
    console.info('[app:wx:checkSession]');
    var a = this.storage.get('app:token');
    wx.checkSession({
      success: b => {
        console.info('[app:wx:checkSession:success]', b),
        a ? this.tokenSuccess() : (console.info('[app:token:not:exist]'), this.login())
      },
      fail: b => {
        console.info('[app:wx:checkSession:fail]', b),
        this.login()
      }
    })
  },
  tokenSuccess() {
    console.info('[app:token:success]'),
    this.globalData.token = this.storage.get('app:token'),
    this.globalData.hasToken = !0,
    setTimeout(() => {
      this.trigger('app:token:success', this.globalData.token)
    },
    10)
  },
  tokenFail(a) {
    console.info('[app:token:fail]'),
    this.globalData.hasToken = !1,
    setTimeout(() => {
      this.trigger('app:token:fail', a)
    },
    10)
  },
  login() {
    console.info('[app:wx:login]'),
    wx.login({
      success: a => {
        console.info('[app:wx:login:success]', a),
        this.fetchToken(a.code)
      },
      fail: a => {
        console.info('[app:wx:login:fail]', a),
        this.tokenFail()
      }
    })
  },
  fetchToken(a) {
    console.info('[app:fetchToken]'),
    wx.request({
      url: url({
        origin: 'uic',
        pathname: '/sso/wx/getKdtSessionKey'
      }),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: a,
        appId: this.getAppId(),
        clientId: '8d1453fed58bd64acb',
        clientSecret: '2bd90d42c4e8ce497b37f4ba183ce653',
        fansType: this.getFansType(),
        grantType: 'yz_union'
      },
      success: b => {
        if (console.info('[app:fetchToken:success]', b), 0 == +b.data.code) {
          var c = b.data.data;
          this.storage.set('app:token', {
            accessToken: c.access_token,
            refreshToken: c.refresh_token,
            userId: c.user_id,
            openId: c.open_id,
            mobile: c.mobile,
            kdtId: c.kdt_id
          },
          {
            expire: 5
          }),
          this.tokenSuccess()
        } else this.tokenFail(b.data)
      },
      fail: b => {
        console.info('[app:fetchToken:fail]', b),
        this.tokenFail({
          msg: b.errMsg,
          code: -1
        })
      }
    })
  },
  getShopCert(a) {
    this.globalData.shopCert ? a(this.globalData.shopCert) : this.fetchShopCert(a)
  },
  fetchShopCert(a) {
    this.carmen({
      api: 'weapp.wsc.shop.cert/1.0.0/get',
      success: b => {
        var c = [];
        1 == b.team_certification && c.push('\u5E97\u94FA\u8BA4\u8BC1'),
        1 == b.is_secured_transactions && c.push('\u62C5\u4FDD\u4EA4\u6613'),
        1 == b.team_physical && c.push('\u7EBF\u4E0B\u95E8\u5E97'),
        this.globalData.shopCert = c,
        a && a(c)
      }
    })
  },
  getShopStatus(a) {
    this.globalData.shopStatus ? a(this.globalData.shopStatus) : this.fetchShopStatus(a)
  },
  fetchShopStatus(a) {
    this.carmen({
      api: 'weapp.wsc.shop.status/1.0.0/get',
      success: b => {
        this.globalData.shopStatus = b,
        a(b)
      }
    })
  },
  getKdtId() {
    return this.globalData.hasToken ? this.globalData.token.kdtId: null
  },
  getAppId() {
    return meta.appId
  },
  getFansType() {
    return 1343
  },
  getAccessToken() {
    return this.globalData.hasToken ? this.globalData.token.accessToken: null
  },
  getUserInfo(a, b) {
    var c = this.globalData.userInfo;
    return a = a || noop,
    b = b || noop,
    c ? a(c) : void wx.getUserInfo({
      success: d => {
        this.globalData.userInfo = d,
        a(d)
      },
      fail: d => {
        b(d)
      }
    })
  },
  getSystemInfoSync() {
    return this.globalData.systemInfo || (this.globalData.systemInfo = wx.getSystemInfoSync()),
    this.globalData.systemInfo
  },
  fetchAreaMapData(a, b) {
    var c = this.storage.get('trade:address:area-map');
    return c ? a && a(c) : void this.carmen({
      api: 'kdt.address.map/1.0.0/get',
      success: d => {
        var e = d.data || [],
        f = {};
        f.province = e[0].Province,
        f.city = e[1].Citys,
        f.county = e[2].County,
        this.storage.set('trade:address:area-map', f),
        a && a(f)
      },
      fail: d => {
        b && b(d.msg)
      }
    })
  },
  onHide() {
    this.globalData.shopCert = null,
    this.globalData.shopStatus = null,
    this.trigger('hide')
  }
}));