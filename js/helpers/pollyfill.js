Array.prototype.indexOf||(Array.prototype.indexOf=function(r,t){var n;if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),i=e.length>>>0;if(0===i)return-1;var o=0|t;if(o>=i)return-1;for(n=Math.max(o>=0?o:i-Math.abs(o),0);n<i;){if(n in e&&e[n]===r)return n;n++}return-1});