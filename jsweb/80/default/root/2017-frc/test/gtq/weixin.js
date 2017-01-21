/**
 * Created by long on 14-8-9.
 */
var weixin = weixin || {};
weixin.isLive = false;
weixin.shareImgUrl = "share.png";
weixin.shareImg = null;
weixin.shareImgStayTime = 4000;
weixin.gameName = document.title;

weixin.shareData = {
    "img_url": "http://m.2144.cn/act/wxhtml5/qiang/113903_5743.jpg",
    "link": window.location.href,
    "title": document.title,
    "desc": "游戏描述",
    "img_width":640,
    "img_height":640
};

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
    weixin.isLive = true;
    weixin._createShareImg();
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke('sendAppMessage', weixin.shareData, function(res) {
//            document.location.href = weixin.shareData.link;
        })
    });
    WeixinJSBridge.on('menu:share:timeline', function(argv) {
        WeixinJSBridge.invoke('shareTimeline', weixin.shareData, function(res) {
//            document.location.href = weixin.shareData.link;
        });
    });
    WeixinJSBridge.on('menu:share:weibo', function(argv) {
        var data = {"url" : weixin.shareData.link,"content": weixin.shareData.desc}
        WeixinJSBridge.invoke('shareWeibo', data, function(res) {
//            document.location.href = data.link;
        });
    });
});

//显示或者关闭右上角按钮
weixin.setOptionMenuState =  function(show){
    if(weixin.isLive){
        WeixinJSBridge.call(!show ? 'hideOptionMenu' : 'showOptionMenu');
    }
}

//显示或者关闭底部导航栏
weixin.setToolBarState =  function(show){
    if(weixin.isLive){
        WeixinJSBridge.call(!show ? 'hideToolbar' : 'showToolbar');
    }
}
//network_type:wifi         wifi网络
//network_type:edge      非wifi,包含3G/2G
//network_type:fail         网络断开连接
//network_type:wwan     2g或者3g
weixin.getUserNetType = function(callBack){
    if(weixin.isLive){
        WeixinJSBridge.invoke('getNetworkType',{},function(e){
            callBack(e.err_msg);
        });
    }else{
        callBack("Weixin is not there!")
    }
}
weixin.showShare = function(level,score, record, delay){
    var msg = "我在玩<"+weixin.gameName+">";
    if(level > 0) msg += "第"+level+"关";
    var defeat = Math.min(18 + Math.floor(score*81/500),99);
    if(score > 0) msg += ",砍了"+score+"分,击败了"+defeat+"%的人";
    else msg += ",好爽啊";
    if(record === true) msg += ",做伐木工的感觉真不错！";
    else msg += ",做伐木工的感觉真不错！";
    weixin.shareData.title = msg;
//    var show = (level > 0 && (level == 1 || level %5 == 0)) || (level == 0 && Math.random() < 0.2) || record === true;
    var show = (level > 0 && (level == 1 || level %5 == 0)) || (level == 0 && defeat > 50) || record === true;
//    var show = (level > 1 && score > 0) || record === true;
    if(show) weixin.showShare1(msg, delay);
}
weixin.showShare1 =  function(msg, delay){
    weixin._initShareImg();
    if(msg == null) {
        msg = ["赠人玫瑰，手有余香，分享给更多好友吧！","万水千山总是情，分享一下行不行","顺手转一下，出门捡钱包！"];
        var i = Math.floor(Math.random()*msg.length);
        msg = msg[i];
    }
    if(delay == undefined) delay = 0;
    if(!weixin.isLive) return;
    weixin.shareData.title = msg;
    setTimeout(function(){
        var result = confirm("【通知好友】"+msg);
        if(result){
            if(weixin.shareImg) {
                weixin.shareImg.style.display = "";
                setTimeout(function(){
                    weixin.shareImg.style.display = "none";
                },weixin.shareImgStayTime);
                weixin.shareImg.onclick = function(){
                    weixin.shareImg.style.display = "none";
                }
            }
        }
    },delay);
}
weixin.viewProfile = function(){
    if(weixin.isLive){
        WeixinJSBridge.invoke("profile", {username: 'gh_88b48fe41d82',scene: "57"},function(resp){
            alert(resp.err_msg);    /* 在这里，我们把err_msg输出 */
        });
    }else{
        //todo, goto home url
    }
}
weixin._createShareImg = function(){
    weixin.shareImg = document.getElementById("weixinShareImg");
    if(weixin.shareImg) {
        return;
    }
    weixin.shareImg = document.createElement("img");
    weixin.shareImg.id = "weixinShareImg";
    weixin.shareImg.src = weixin.shareImgUrl;
    weixin.shareImg.style.display = "none";
    weixin.shareImg.style = "position: absolute;z-index: 999999";
    var body = document.getElementsByTagName("body")[0];
    body.insertBefore(weixin.shareImg,body.firstChild);
}
weixin._initShareImg = function(){
    var img = weixin.shareImg;
    if(img == null) return;
    var winWidth;
    var winHeight;
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    // 获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight  && document.documentElement.clientWidth){
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    if(img.width != winWidth) img.width = winWidth;
}