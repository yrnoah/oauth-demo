const express = require('express');
const app = express();
const config = require('../config')
const proxyMiddleware = require('http-proxy-middleware')
const proxyTable = config.prod.proxyTable
const wechat = require('wechat');
const bodyParser = require('body-parser');
const path = require('path');
const WechatOauth = require('wechat-oauth');
const WechatApi = require('wechat-api');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const swig = require('swig');

const [appid, appsecret] =
      ['wx1c890575b460163f',
       '9fcb55dc39a0615b05487b608fd126b4'];
const api = new WechatApi(appid, appsecret);
const client = new WechatOauth(appid, appsecret);

app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', './dist')
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('html', swig.renderFile);
app.use(express.static('dist', {'extensions': ['html']}));
app.use(express.query());

// Error Handlers
if (app.get('env') === 'development') {
  // development error handler, will print stacktrace
  renderError(true);
} else {
  // production error handler, no stacktrace leaked to user
  renderError(false);
}
function renderError(sendErrorObj) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: sendErrorObj ? err : {}
    });
  });
}

let url;
url = client.getAuthorizeURL('http://srkfytl.gofriend.me:5013/nroauth', 'noah', 'snsapi_userinfo');
app.get('/oauth', (req, res, next) => {
  res.redirect(url);
});

let jsconfig, userInfo, openId, accessToken;
app.get('/nroauth', (req, res, next) => {
  if (req.query.code) {
    client.getAccessToken(req.query.code, (err, result) => {
      if (err) {
        console.log(err);
        next();
      }
      openId = result.data.openid;
      accessToken = result.data.access_token;
    });
  }
  let param = {
    debug: true,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    url: `http://srkfytl.gofriend.me:5013${req.url}`,
  };
  api.getJsConfig(param, (err, result)=> {
    if(err) {
      console.log(err);
      next();
    }
    jsconfig = result;
  });
	res.render('index');
  // res.redirect('http://srkfytl.gofriend.me:5013/nroauth');
});

app.get('/api/jsconfig', (req, res, next) => {
  res.send(jsconfig);
  next();
})

app.get('/api/getUser', (req, res, next) => {
  if (openId) {
    client.getUser(openId, (err, result) => {
      if (err) {
        console.log(err);
        next();
      }
      userInfo = result;
      res.send(userInfo);
    });
  }
});

const port = 5013;
app.listen(port, (err) => { console.log("http oppened on " + port) });
