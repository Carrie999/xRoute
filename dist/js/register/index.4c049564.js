webpackJsonp([0,3],[function(t,e,n){"use strict";n(1),n(12)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),r=new i.Route;r.home("path1").addRoute({path:"path1",viewBox:".public-container",template:n(4),pageInit:function(){n.e(1,function(){var t=n(6);r.registerCtrl("path1",new t(".public-container"))})}}).addRoute({path:"path2",viewBox:".public-container",template:n(5),pageInit:function(){n.e(2,function(){var t=n(7);r.registerCtrl("path2",new t(".public-container"))})}}),r.bootstrap(),e["default"]=r},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0}),e.Route=void 0;var r=n(3),o=i(r);e.Route=o["default"]},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=n(2),a=function(){function t(){i(this,t),this.routes={},this["default"]="",this.useHash=!1,this.id=0,this.pageCache={},this.pathStack=[],this.oldPath=""}return r(t,[{key:"home",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/";return this["default"]=t,this}},{key:"pageLoading",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};this.loading=t}},{key:"addRoute",value:function(t){var e=t.path,n=void 0===e?"":e,i=t.pageInit,r=t.viewDestory,o=t.context,a=t.template,s=void 0===a?"":a,u=t.templateUrl,l=void 0===u?"":u,c=t.viewBox,f=void 0===c?"":c;t.isHistory;n=n.split(".").join("/");var h=this.id++;return this.routes[n]={path:n,pageInit:i,viewDestory:r,context:o,template:s,templateUrl:l,viewBox:f,id:h,inited:!1},this}},{key:"handleRoute",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=this,n=arguments[1],i=arguments[2],r=this.oldPath,a=void 0,s=t.split(".");if(a=this.routes[r]){if(a.inited=!1,1===s.length&&r.split("/").length>1){var u=r.split("/");this.routes[u[0]].inited=!1}if(a.ctrl&&a.ctrl.viewDestory&&a.ctrl.viewDestory()){var l=i?"?"+o.util.getUrlParams(i,!0):"";return void history.pushState({path:a.path},null,l+"#/"+a.path)}}return this.oldPath=s.join("/"),s.forEach(function(t,r){var a=s.filter(function(t,e){return e<=r}).join("/"),u=void 0,l=void 0;if((u=e.routes[a])&&!u.inited){if(u.inited=!0,l=document.querySelector(u.viewBox),!l)return;if(r+1===s.length){if(e.useHash)location.hash="/"+a;else if(!n){var c=i?"?"+o.util.getUrlParams(i,!0):"";history.pushState({path:a},null,c+"#/"+a)}e.routeClassHandle(a)}l.innerHTML=u.template,u.pageInit.call(u.context||window)}}),!1}},{key:"routeClassHandle",value:function(t){t=t.split("/").join("-")}},{key:"go",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.handleRoute(t,n,e)}},{key:"back",value:function(){}},{key:"registerCtrl",value:function(t,e){t=t.split(".").join("/"),this.routes[t]?this.routes[t].ctrl=e:""}},{key:"bootstrap",value:function(){var t=this;history.pushState||(this.useHash=!0),this.useHash?window.addEventListener("hashchange",function(e){var n=location.hash.slice(2).split("/").join(".");t.handleRoute(n)}):window.addEventListener("popstate",function(e){var n=e.state;n&&n.path&&t.handleRoute(n.path.split("/").join("."),!0)}),document.addEventListener("click",function(e){var n=e.target.dataset.href||"",i=location.hash.slice(2);if(n=n.split("-").join("/")){if(n===i)return;t.handleRoute(n)&&e.preventDefault()}}),document.addEventListener("DOMContentLoaded",function(e){var n=t.routes[t["default"]],i=location.hash.slice(2),r=!1,o=null;t.oldPath=i;var a=i.split("/");a.forEach(function(e,n){var o=a.filter(function(t,e){return e<=n}).join("/"),s=void 0,u=void 0;if(s=t.routes[o]){if(s.inited=!0,u=document.querySelector(s.viewBox),!u)return;n+1===a.length&&(t.useHash?location.hash="/"+i:history.replaceState({path:i},null,"#/"+i)),u.innerHTML=s.template,s.pageInit.call(s.context||window),r=!0}}),t.routeClassHandle(i),r||(o=document.querySelector(n.viewBox),o.innerHTML=n.template,n.pageInit.call(n.context||window),t.useHash?location.hash="/"+n.path:history.replaceState({path:n.path},null,"#/"+n.path))})}}]),t}();e["default"]=a},function(t,e){t.exports='<div class="route-btn">This is path1 file</div>'},function(t,e){t.exports='<div class="route-btn">This is path2 file</div>'},,,,,function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var n=this[e];n[2]?t.push("@media "+n[2]+"{"+n[1]+"}"):t.push(n[1])}return t.join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(i[o]=!0)}for(r=0;r<e.length;r++){var a=e[r];"number"==typeof a[0]&&i[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},function(t,e,n){function i(t,e){for(var n=0;n<t.length;n++){var i=t[n],r=d[i.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](i.parts[o]);for(;o<i.parts.length;o++)r.parts.push(l(i.parts[o],e))}else{for(var a=[],o=0;o<i.parts.length;o++)a.push(l(i.parts[o],e));d[i.id]={id:i.id,refs:1,parts:a}}}}function r(t){for(var e=[],n={},i=0;i<t.length;i++){var r=t[i],o=r[0],a=r[1],s=r[2],u=r[3],l={css:a,media:s,sourceMap:u};n[o]?n[o].parts.push(l):e.push(n[o]={id:o,parts:[l]})}return e}function o(t,e){var n=g(),i=b[b.length-1];if("top"===t.insertAt)i?i.nextSibling?n.insertBefore(e,i.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),b.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function a(t){t.parentNode.removeChild(t);var e=b.indexOf(t);e>=0&&b.splice(e,1)}function s(t){var e=document.createElement("style");return e.type="text/css",o(t,e),e}function u(t){var e=document.createElement("link");return e.rel="stylesheet",o(t,e),e}function l(t,e){var n,i,r;if(e.singleton){var o=m++;n=y||(y=s(e)),i=c.bind(null,n,o,!1),r=c.bind(null,n,o,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=u(e),i=h.bind(null,n),r=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),i=f.bind(null,n),r=function(){a(n)});return i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else r()}}function c(t,e,n,i){var r=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=w(e,r);else{var o=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function f(t,e){var n=e.css,i=e.media;if(i&&t.setAttribute("media",i),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function h(t,e){var n=e.css,i=e.sourceMap;i&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var r=new Blob([n],{type:"text/css"}),o=t.href;t.href=URL.createObjectURL(r),o&&URL.revokeObjectURL(o)}var d={},p=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},v=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),g=p(function(){return document.head||document.getElementsByTagName("head")[0]}),y=null,m=0,b=[];t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=v()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var n=r(t);return i(n,e),function(t){for(var o=[],a=0;a<n.length;a++){var s=n[a],u=d[s.id];u.refs--,o.push(u)}if(t){var l=r(t);i(l,e)}for(var a=0;a<o.length;a++){var u=o[a];if(0===u.refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete d[u.id]}}}};var w=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){}]);