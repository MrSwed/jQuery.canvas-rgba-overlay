# jQuery.canvas-rgba-overlay v0.2

https://github.com/MrSwed/jQuery.canvas-rgba-overlay

## Parameters
```JS
p = {
 img:       $(_t).find("img"), // default, find child
 width:     false,      // default from `img`
 height:    false,
 color:     false,      // cover color array or commaseparated [R,G,B,(A)]
 brightmix: false,      // koef array or comma separated [0.34,0.5,0.16]
 contrast:  false       // input range [-100..100]
}
```

 grayscale: false, // true|false 
	linearLight: false, // (true|false), cover by `color` in linear Light mode
	debug: false       // debug to console. 1, 2,.. for mor info



Usage example

```JS
$(".image img", $item).load(function(){
 var $im = $(this);
 // ..... 
 $im.parent().canvasOverlay({
  color: "rgba(54, 111, 138, 0.64);",
  grayscale: true,
  linearLight: true
 });
});

```