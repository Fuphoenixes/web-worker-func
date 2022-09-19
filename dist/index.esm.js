function __spreadArray(e,n,r){if(r||2===arguments.length)for(var t,a=0,o=n.length;a<o;a++)!t&&a in n||((t=t||Array.prototype.slice.call(n,0,a))[a]=n[a]);return e.concat(t||Array.prototype.slice.call(n))}var defaultOptions={timeout:0,importScripts:[],depsFunc:[],transferable:!0},jobRunner=function(e){var o=e.fn,i=e.transferable;return function(e){var n,r=e.data;try{var t=o.apply(void 0,r),a=i&&(n=t,"ArrayBuffer"in self&&n instanceof ArrayBuffer||"MessagePort"in self&&n instanceof MessagePort||"ImageBitmap"in self&&n instanceof ImageBitmap||"OffscreenCanvas"in self&&n instanceof self.OffscreenCanvas)?[t]:[];postMessage(["SUCCESS",t],a)}catch(e){postMessage(["ERROR",e])}}},importScriptsParser=function(e){return 0===e.length?"":(e=e.map(function(e){return"'".concat(e,"'")}).toString(),"importScripts(".concat(e,");"))},depsFuncParser=function(e){return 0===e.length?"":e.map(function(e){return"var ".concat(e.name," = ").concat(e)}).join(";")},createWorkerBlobUrl=function(e,n,r,t){n="\n    ".concat(importScriptsParser(n),"\n    ").concat(depsFuncParser(r),"\n    onmessage=(").concat(jobRunner,")({ fn: (").concat(e,"), transferable: ").concat(t," })\n  "),r=new Blob([n],{type:"text/javascript"});return URL.createObjectURL(r)},webWorkerBuilder=function(c,e){var f=Object.assign(defaultOptions,e);return function(){for(var s=[],e=0;e<arguments.length;e++)s[e]=arguments[e];return new Promise(function(r,t){function a(){o.terminate(),URL.revokeObjectURL(n),f.timeout&&window.clearTimeout(e)}var e,n=createWorkerBlobUrl(c,f.importScripts,f.depsFunc,f.transferable),o=new Worker(n),i=f.transferable?s.filter(function(e){return"ArrayBuffer"in window&&e instanceof ArrayBuffer||"MessagePort"in window&&e instanceof MessagePort||"ImageBitmap"in window&&e instanceof ImageBitmap||"OffscreenCanvas"in window&&e instanceof window.OffscreenCanvas}):[];o.postMessage(__spreadArray([],s,!0),i),o.onmessage=function(e){var e=e.data,n=e[0],e=e[1];("SUCCESS"===n?r:t)(e),a()},o.onerror=function(e){t(e),a()},f.timeout&&(e=window.setTimeout(function(){t("worker timeout"),a()},f.timeout))})}};export{webWorkerBuilder as default};
