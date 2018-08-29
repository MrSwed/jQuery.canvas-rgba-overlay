/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-canvas-touchevents-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],d={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase();Modernizr.addTest("canvas",function(){var e=i("canvas");return!(!e.getContext||!e.getContext("2d"))});var h=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];d._prefixes=h;var v=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");v(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var m=0;m<Modernizr._q.length;m++)Modernizr._q[m]();e.Modernizr=Modernizr}(window,document);
// end Modernizr

$(function(){


	$.fn.extend({
		canvasOverlay: function(p){
			var
				_t = this,
				brightness, $canvas, ctx, data, i,
				imgCtx, imgData, imgPixels, pixels, _i,
				_ref;
			p = $.extend({}, {
				img: $(_t).find("img"),
				width: 0,
				height: 0,
				color: "rgba(127,127,127,0.1)",
				koef: "0.37,0.5,0.16",
				debug: false
			}, p);
			//if the browser supports canvas overlays and we haven't already made one
			var image = $(p.img).get(0);
			!p.height && (p.height = image.naturalHeight);
			!p.width && (p.width = image.naturalWidth);
			if (Modernizr.canvas && !Modernizr.touch && p.height > 0) {
				if (!$(p.img).get(0).complete) {
					p.debug && console.log("Not ready yes, try after timeout");
					setTimeout(function(){
						$(_t).canvasOverlay(p);
					}, 200);
				} else {
					p.debug && console.log("Ready: ", p, image);
					$canvas = document.createElement('canvas');
					ctx = $canvas.getContext('2d');
					imgCtx = $canvas.getContext('2d');
					if (typeof p.color === "string") p.color = p.color.replace(/^.*rgba?\(([\d., ]+)\).*$/, "$1").split(/[, ]+/, 4);
					if (typeof p.koef === "string") p.koef = p.koef.split(/[, ]+/, 4);
					$canvas.width = p.width;
					$canvas.height = p.height;
					ctx.fillStyle = "rgb" + (p.color.length === 3 ? "" : "a") + "(" + (p.color.join(',')) + ")";
					ctx.fillRect(0, 0, $canvas.width, $canvas.height);
					data = ctx.getImageData(0, 0, p.width, p.height);
					pixels = data.data;
					imgCtx.drawImage(image, 0, 0, p.width, p.height);
					imgData = imgCtx.getImageData(0, 0, p.width, p.height);
					imgPixels = imgData.data;
					// p.debug && console.log("imgPixels: ", imgPixels);

					for (i = 0, _ref = imgPixels.length; i <= _ref; i += 4) {
						brightness = p.koef[0] * imgPixels[i] + p.koef[1] * imgPixels[i + 1] + p.koef[2] * imgPixels[i + 2];
						imgPixels[i] = brightness * pixels[i] / 255;
						imgPixels[i + 1] = brightness * pixels[i + 1] / 255;
						imgPixels[i + 2] = brightness * pixels[i + 2] / 255;
						typeof p.koef[3]!=="undefined" && p.koef[3] <= 1 && (
							imgPixels[i + 3] = p.koef[3] * pixels[i + 3]
						)
					}
					ctx.putImageData(imgData, 0, 0);
					$(_t).append($canvas).addClass("canvas");
				}
			} else {
				p.debug && console.log("Error: Not in Modernizr.canvas && !Modernizr.touch && p.height", Modernizr.canvas, Modernizr.touch, p.height);
			}
		}
	});
});