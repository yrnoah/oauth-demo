<template>
  <div>
    <p>{{ jsData }}</p>
    <p>{{ reqData }}</p>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk';

  export default {
    name: 'index',
    data() {
      return {
        jsData: 'Hello',
        reqData: '123',
      };
    },
    created() {
      this.$http.get('/api/jsconfig').then((resp) => {
        const jsconfig = resp.body;
        console.log(jsconfig, 'jsconfig', resp);
        wx.config(jsconfig);
        this.jsData = jsconfig;
        const shareConfig = {
          title: '测试oauth',
          link: 'http://srkfytl.gofriend.me:5013/nroauth',
          desc: 'ceshi',
        };
        wx.ready(() => {
          wx.onMenuShareTimeline(shareConfig);
          wx.onMenuShareAppMessage(shareConfig);
        });
      });
      this.$http.get('/api/getUser').then((resp) => {
        console.log(resp);
        this.reqData = resp.body;
      });
    },
  };
</script>
