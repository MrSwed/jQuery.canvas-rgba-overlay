// jQuery.canvas-rgba-overlay.js v0.2 | MIT
// https://github.com/MrSwed/jQuery.canvas-rgba-overlay

/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-canvas-touchevents-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],d={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase();Modernizr.addTest("canvas",function(){var e=i("canvas");return!(!e.getContext||!e.getContext("2d"))});var h=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];d._prefixes=h;var v=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");v(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var m=0;m<Modernizr._q.length;m++)Modernizr._q[m]();e.Modernizr=Modernizr}(window,document);
// end Modernizr
/**/
$(function(){


	$.fn.extend({
		canvasOverlay: function(p){
			if (!(Modernizr.canvas && !Modernizr.touch)) {
				console.log("Error: Not in Modernizr.canvas && !Modernizr.touch ", Modernizr.canvas, Modernizr.touch);
				return $(this);
			}
			return $(this).each(function(){
			var
				t = this,
				$canvas, ctx, 
				imgData, imgPixels;

			t.p = $.extend({}, {
				img: $(t).find("img"),
				width: false,      // default from img
				height: false,
				color: false,      // cover color array or commaseparated [R,G,B,(A)]
				brightmix: false, // koef array or comma separated [0.34,0.5,0.16]
				contrast: false,   // input range [-100..100]

				grayscale: false, // true|false 
				linearLight: false, // (true|false), cover by `color` in linear Light mode
				debug: false       // debug to console. 1, 2,.. for mor info
			}, p);

			if (t.p.color && typeof t.p.color === "string") t.p.color = t.p.color.replace(/^.*rgba?\(([\d., ]+)\).*$/, "$1").split(/[, ]+/, 4);
			if (t.p.brightmix && typeof t.p.brightmix === "string") t.p.brightmix = t.p.brightmix.split(/[, ]+/, 4);

			t.contrastPixel = function(pixel, contrast){  //input range [-100..100]
				contrast = (contrast / 100) + 1;  //convert to decimal & shift range: [0..2]
				var intercept = 128 * (1 - contrast);
				return pixel * contrast + intercept;
			};
			
			t.linearLightPixel = function(pTarget, pBland){
				return ((pBland > 128) * (pTarget + 2 * (pBland - 128)) + (pBland <= 128) * (pTarget + 2 * pBland - 255));
			};
			t.brightmix = function(rgb,brK){
				rgb = rgb || [];
				brK = brK || [];
				return (rgb.reduce(
					function(s, v, k){
						return s + v * brK[k];
					}, 0
				)) / 255;
			};

			// function correctByAlpha(pTarget, pBland, pAlpha) { // pAlfa 0 .. 1 (opacity)
			// 	return pTarget + (pBland - pTarget) * pAlpha;
			// }
// ----
				t.deInit = function(){
					$(">canvas", t).remove();
					return t;
				};
			t.init = function() {
			//if the browser supports canvas overlays and we haven't already made one
			var image = $(t.p.img).get(0);
			!t.p.height && (t.p.height = image.naturalHeight);
			!t.p.width && (t.p.width = image.naturalWidth);
				if (!t.p.height || !t.p.width) {
					t.p.debug && console.log("Error: No t.p.width && t.p.height", t.p.width, t.p.height);
					return false;
				} 
				if (!$(t.p.img).get(0).complete) {
					t.p.debug && console.log("Not ready yes, try after timeout");
					setTimeout(function(){
						t.init();
					}, 200);
				} else {
					t.deInit();
					t.p.debug && console.log("Ready: ", t.p, image);
					$canvas = document.createElement('canvas');
					ctx = $canvas.getContext('2d');
					
					$canvas.width = t.p.width;
					$canvas.height = t.p.height;
					ctx.drawImage(image, 0, 0, t.p.width, t.p.height);
					imgData = ctx.getImageData(0, 0, t.p.width, t.p.height);
					imgPixels = imgData.data;
					t.p.debug && t.p.debug >1 && console.log("imgPixels: ", imgPixels);

					for (var i = 0, i_max = imgPixels.length; i <= i_max; i += 4) {
/* gray */
						t.p.grayscale && (
							imgPixels[i] = imgPixels[i + 1] = imgPixels[i + 2] =
								0.299 * imgPixels[i] + 0.587 * imgPixels[i + 1] + 0.114 * imgPixels[i + 2]
						);
/* brightmix */
						if (t.p.brightmix) { var brightmix = t.brightmix(imgPixels.slice(i, i + 3),t.p.brightmix); }
						
/* each of R,G,B */
						for(var rgbI=0;rgbI<=2;rgbI++) {
							if (t.p.color) {
								t.p.brightmix && (imgPixels[i + rgbI] = brightmix * t.p.color[rgbI]);
								t.p.linearLight && (imgPixels[i + rgbI] = t.linearLightPixel(imgPixels[i + rgbI], t.p.color[rgbI]));
							}
							t.p.contrast && (imgPixels[i + rgbI] = t.contrastPixel(imgPixels[i + rgbI], t.p.contrast));
						}
					} /* for pixels data*/
					ctx.putImageData(imgData, 0, 0);
					$(t).append($canvas).addClass("canvas");
				}
				 return t;
			};
				t.init();
			});
		}
	});
});