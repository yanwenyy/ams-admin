//获取url参数
function getParams(){
    var url = window.location.href;
    url = url.split("?")[1];
    if(!url) return "";
    var para = url.split("&");
    var len = para.length;
    var res = {};
    var arr = [];
    for(var i=0;i<len;i++){
        arr = para[i].split("=");
        res[arr[0]] = arr[1];
    }
    return res;
}

/**
 * 获取字符串的字节数
 * @param str
 */
function getStrBytes(str){
    var bytesCount = 0;
    for (var i = 0; i < str.length; i++){
        var c = str.charAt(i);
        if (/^[\u0000-\u00ff]$/.test(c)){ //匹配双字节
            bytesCount += 1;
        }else{
            bytesCount += 2;
        }
    }
    return bytesCount;
}

/**
 * 校验字段名称是否含有特殊字符
 * @param columnName
 * @return {boolean}
 */
function verifyReg(columnName) {
    var flag = true;
    var regExpressions = /(^_([a-zA-Z0-9\u4e00-\u9fa5]_?)*$)|(^[`"a-zA-Z\u4e00-\u9fa5#$_](_?[a-zA-Z0-9\u4e00-\u9fa5#$_])*[`"_]?$)/;
    if (!regExpressions.test(columnName)) {
        flag = false;
    }
    return flag;
}

/**
 * 给String字符串增加原型方法，判断字符串变量是否以某个字符串结尾
 * @param endStr 结尾的字符串
 * @returns {boolean}
 */
String.prototype.endWith = function(endStr){
    var d = this.length - endStr.length;
    return (d>=0 && this.lastIndexOf(endStr) === d);
};

/* Author：mingyuhisoft@163.com
 * Github:https://github.com/imingyu/jquery.mloading
 * Npm:npm install jquery.mloading.js
 * Date：2016-7-4
 * @remark 调用对象既可以是某个容器，也可以是body或者是html(例：$("xxx").mLoading()或者$("body").mLoading()或者$("html").mLoading())
 */
var plsInc,callbackFun;
(function (root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'),root);
    } if(typeof define ==="function"){
        if(define.cmd){
            define(function(require, exports, module){
                var $ = require("jquery");
                factory($,root);
            });
        }else{
            define(["jquery"],function($){
                factory($,root);
            });
        }
    }else {
        factory(root.jQuery,root);
    }
} (typeof window !=="undefined" ? window : this, function ($, root, undefined) {
    'use strict';
    if(!$){
        $ = root.jQuery || null;
    }
    if(!$){
        throw new TypeError("必须引入jquery库方可正常使用！");
    }

    var arraySlice = Array.prototype.slice,
        comparison = function (obj1,obj2) {
            var result=true;
            for(var pro in obj1){
                if(obj1[pro] !== obj2[obj1]){
                    result=true;
                    break;
                }
            }
            return result;
        };

    function MLoading(dom,options) {
        options = options||{};
        this.dom = dom;
        this.options = $.extend(true,{},MLoading.defaultOptions,options);
        this.curtain = null;
        callbackFun = this.options.callback;
        this.render().show();
    }
    MLoading.prototype = {
        constructor:MLoading,
        initElement:function () {
            var dom = this.dom,
                ops = this.options;
            var curtainElement = dom.children(".mloading"),
                bodyElement = curtainElement.children('.mloading-body'),
                barElement = bodyElement.children('.mloading-bar'),
                iconElement = barElement.children('.mloading-icon'),
                textElement = barElement.find(".mloading-text");
            if (curtainElement.length === 0) {
                curtainElement = $('<div class="mloading"></div>');
                dom.append(curtainElement);
            }
            if (bodyElement.length === 0) {
                bodyElement = $('<div class="mloading-body"></div>');
                curtainElement.append(bodyElement);
            }
            if (barElement.length === 0) {
                barElement = $('<div class="mloading-bar"></div>');
                bodyElement.append(barElement);
            }
            if (iconElement.length === 0) {
                var _iconElement=document.createElement(ops.iconTag);
                iconElement = $(_iconElement);
                iconElement.addClass("mloading-icon");
                barElement.append(iconElement);
            }
            if (textElement.length === 0) {
                textElement = $('<span class="mloading-text"></span>');
                barElement.append(textElement);
            }
            if($(".mloading-bar").find("a").length===0 && ops.hasCancel){
                barElement.append("<a href='javascript:void(0)' onclick='cLoading()' style='text-decoration:none'>取消</a>");
            }
            if(typeof(Worker)!=="undefined" && ops.hasTime){//计时
                ops.s = ops.m = ops.h = 0;
                var interval = setInterval(function() {
                    if (ops.hasTime) {
                        ops.s++;
                        if (ops.s > 59) {
                            ops.s = 0;
                            ops.m = ops.m + 1;
                        }
                        if (ops.m > 59) {
                            ops.m = 0;
                            ops.h = ops.h + 1;
                        }
                        var timeStr = "";
                        if (ops.h > 0) {
                            timeStr += ops.h + "时";
                        }
                        if (ops.m > 0) {
                            timeStr += ops.m + "分";
                        }
                        if (ops.s > 0) {
                            timeStr += ops.s + "秒";
                        }
                        textElement.html(ops.text + timeStr);
                    }else{
                        clearInterval(interval);
                    }
                },1000);
            }
            this.curtainElement = curtainElement;
            this.bodyElement = bodyElement;
            this.barElement = barElement;
            this.iconElement = iconElement;
            this.textElement = textElement;
            return this;
        },
        render:function () {
            var dom = this.dom,
                ops = this.options;
            this.initElement();
            if(dom.is("html") || dom.is("body")){
                this.curtainElement.addClass("mloading-full");
            }else{
                this.curtainElement.removeClass("mloading-full");
                if(!dom.hasClass("mloading-container")){
                    dom.addClass("mloading-container");
                }
            }
            if(ops.mask){
                this.curtainElement.addClass("mloading-mask");
            }else{
                this.curtainElement.removeClass("mloading-mask");
            }
            if(ops.content!=="" && typeof ops.content!=="undefined"){
                if(ops.html){
                    this.bodyElement.html(ops.content);
                }else{
                    this.bodyElement.text(ops.content);
                }
            }else{
                this.iconElement.attr("src",ops.icon);
                if(ops.html){
                    this.textElement.html(ops.text);
                }else{
                    this.textElement.text(ops.text);
                }
            }
            return this;
        },
        setOptions:function (options) {
            options = options||{};
            var oldOptions = this.options;
            this.options = $.extend(true,{},this.options,options);
            if(!comparison(oldOptions,this.options)) this.render();
        },
        show:function () {
            var dom = this.dom,
                ops = this.options,
                barElement = this.barElement;
            this.curtainElement.addClass("active");
            barElement.css({
                "marginTop":"-"+barElement.outerHeight()/2+"px",
                "marginLeft":"-"+barElement.outerWidth()/2+"px"
            });
            return this;
        },
        hide:function () {
            var dom = this.dom,
                ops = this.options;
            if(ops.hasTime){//关闭计时
                ops.hasTime = false;
            }
            $(".mloading").removeClass("active");
            if(!dom.is("html") && !dom.is("body")){
                dom.removeClass("mloading-container");
            }
            $(".mloading-bar").find("a").remove();
            return this;
        },
        destroy:function () {
            var dom = this.dom,
                ops = this.options;
            if(ops.hasTime){//关闭计时
                ops.hasTime = false;
            }
            if(ops.callback != null && typeof ops.callback === "function"){
                ops.callback = null;
                callbackFun = null;
            }
            this.curtainElement.remove();
            if(!dom.is("html") && !dom.is("body")){
                dom.removeClass("mloading-container");
            }
            dom.removeData(MLoading.dataKey);
            return this;
        }
    };
    MLoading.dataKey="MLoading";
    MLoading.defaultOptions = {
        text:"数据加载中，请稍后......",
        iconTag:"img",
        icon:"data:image/gif;base64,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",
        html:false,
        hasCancel:true,//是否有取消事件
        hasTime:false,//是否计时
        callback:null,//取消事件的回调函数
        content:"",//设置content后，text和icon设置将无效
        mask:true//是否显示遮罩（半透明背景）
    };
    $.fn.mLoading = function (options) {
        var ops={}, funName="", funArgs=[];
        if(typeof options==="object"){
            ops = options;
        }else if(typeof options ==="string"){
            funName = options;
            funArgs = arraySlice.call(arguments).splice(0,1);
        }
        this.each(function (i,element) {
            var dom = $(element);
            plsInc = dom.data(MLoading.dataKey);
            if(!plsInc){
                plsInc = new MLoading(dom,ops);
            }
            if(funName){
                var fun = plsInc[funName];
                if(typeof fun==="function"){
                    fun.apply(plsInc,funArgs);
                }
            }
            if(typeof options !== "undefined" && options.text !== ""){
                dom.children().find(".mloading-body>.mloading-bar").css({
                    "background": "#fff",
                    "box-shadow":"0 1px 2px rgba(0, 0, 0, 0.27)",
                    "border-radius": "7px"
                });
            }
        });
        return plsInc;
    }
}));
function cLoading(){
    if(plsInc){
        plsInc.hide();
    }
    if(callbackFun != null && typeof callbackFun === "function"){
        callbackFun();
    }
}

/**
 *
 * @Description: UUID生成器
 *
 */
var UUIDGenerator = function(){
    this.id = this.createUUID();
}

UUIDGenerator.prototype.valueOf = function(){ return this.id; }
UUIDGenerator.prototype.toString = function(){ return this.id; }

UUIDGenerator.prototype.createUUID = function(){
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = this.getIntegerBits(t,0,31);
    var tm = this.getIntegerBits(t,32,47);
    var thv = this.getIntegerBits(t,48,59) + '1';
    var csar = this.getIntegerBits(this.rand(4095),0,7);
    var csl = this.getIntegerBits(this.rand(4095),0,7);
    var n = this.getIntegerBits(this.rand(8191),0,7) +
        this.getIntegerBits(this.rand(8191),8,15) +
        this.getIntegerBits(this.rand(8191),0,7) +
        this.getIntegerBits(this.rand(8191),8,15) +
        this.getIntegerBits(this.rand(8191),0,15);
    return tl + tm  + thv  + csar + csl + n;
}

UUIDGenerator.prototype.getIntegerBits = function(val,start,end){
    var base16 = this.returnBase(val,16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for(i=0;i<base16.length;i++){
        quadArray.push(base16.substring(i,i+1));
    }
    for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
        if(!quadArray[i] || quadArray[i] == '') quadString += '0';
        else quadString += quadArray[i];
    }
    return quadString;
}

UUIDGenerator.prototype.returnBase = function(number, base){
    return (number).toString(base).toUpperCase();
}

UUIDGenerator.prototype.rand = function(max){
    return Math.floor(Math.random() * (max + 1));
}
