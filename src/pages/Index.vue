<template>
  <p>{{ jsData }}</p>
</template>

<script>
  import wx from 'weixin-js-sdk';

  export default {
    name: 'index',
    data() {
      return {
        jsData: 'Hello',
      };
    },
    created() {
      this.$http.get('./api/jsconfig').then((resp) => {
        const jsconfig = resp.json();
        console.log(jsconfig);
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
    },
  };
</script>

<!--<style></style>-->
