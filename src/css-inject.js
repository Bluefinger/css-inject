(function(root, factory){
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define("css-inject", ["jquery"], factory);
	} else {
		root.cssInject = factory(root.jQuery);
	}
}(this, function($){
	"use strict";
	var CssBase = function () {
		var head;
		this.parse = function () {
			var css = "", selector, property;
			for (selector in this.styles) {
				if (this.styles.hasOwnProperty(selector)) {
					css += selector + " {";
					for (property in this.styles[selector]) {
						if (this.styles[selector].hasOwnProperty(property)){
							css += property + ":" + this.styles[selector][property] +";";
						}
					}
					css += "} ";
				}
			}
			return css;
		};
		this.add = function (selector, property, value) {
			if (!this.styles[selector]) { this.styles[selector] = {}; }
			this.styles[selector][property] = value;
			return this;
		};
		this.objectAdd = function (collection) {
			var selector, property;
			if (typeof collection === "object") {
				for (selector in collection) {
					if (collection.hasOwnProperty(selector)){
						for (property in collection[selector]) {
							if (collection[selector].hasOwnProperty(property)){
								this.add(selector, property, collection[selector][property]);
							}
						}
					}
				}
			}
			return this;
		};
		this.remove = function (selector, property) {
			if (selector && property && this.styles.hasOwnProperty(property)) {
				delete this.styles[selector][property];
			} else if (selector && this.styles.hasOwnProperty(selector)) {
				delete this.styles[selector];
			}
			return this;
		};
		this.apply = function () {
			var css= '<style id="'+this.elem+'" type="text/css">', 
				text = this.parse();
			if (head && !this.noIE) {
				css += text + '</style>';
				head.replaceWith(css);
				head = $('#'+this.elem);
			} else if (head && this.noIE) {
				head.html(text);
			} else {
				if (text) {
					css += text + '</style>';
					$(css).appendTo('head');
					head = $('#'+this.elem);
				}
			}
			return this;
		};
	},
	
	CssInject = function () {
		this.elem = "css-inject-style";
		this.styles = {};
		this.noIE = false;
	};
	
	CssInject.fn = CssInject.prototype = new CssBase();

	return new CssInject();
}));