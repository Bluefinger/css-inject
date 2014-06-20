(function(root, factory){
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define("css-inject", ["jquery"], factory);
	} else {
		root.cssInject = factory(root.jQuery);
	}
}(this, function($){
	"use strict";
	var CssInject = function () {
		var self = this;
		if (!(self instanceof CssInject)) return new CssInject();
		self.head = '';
		self.elem = "css-inject-style";
		self.styles = {};
		self.noIE = false;
	};
	CssInject.fn = CssInject.prototype = {
		parse : function () {
			var css = "", selector, property, self = this;
			for (selector in self.styles) {
				if (self.styles.hasOwnProperty(selector)) {
					css += selector + " {";
					for (property in self.styles[selector]) {
						if (self.styles[selector].hasOwnProperty(property)){
							css += property + ":" + self.styles[selector][property] +";";
						}
					}
					css += "} ";
				}
			}
			return css;
		},
		
		add : function (selector, property, value) {
			var self = this;
			if (!self.styles[selector]) { self.styles[selector] = {}; }
			self.styles[selector][property] = value;
			return self;
		},
		
		objectAdd : function (collection) {
			var self = this, i, l, selector, property;
			if (typeof collection === "object") {
				for (selector in collection) {
					if (collection.hasOwnProperty(selector)){
						for (property in collection[selector]) {
							if (collection[selector].hasOwnProperty(property)){
								self.add(selector, property, collection[selector][property]);
							}
						}
					}
				}
			}
			return self;
		},
		
		remove : function (selector, property) {
			var self = this;
			if (selector && property && self.styles.hasOwnProperty(property)) {
				delete self.styles[selector][property];
			} else if (selector && self.styles.hasOwnProperty(selector)) {
				delete self.styles[selector];
			}
			return self;
		},
		
		apply : function () {
			var css, text, self = this;
			text = self.parse();
			if (self.head && !self.noIE) {
				css = '<style id="'+self.elem+'" type="text/css">'+text+'</style>';
				self.head.replaceWith(css);
				self.head = $('#'+self.elem);
			} else if (self.head && self.noIE) {
				self.head.html(text);
			} else {
				if (text) {
					css = '<style id="'+self.elem+'" type="text/css">'+text+'</style>';
					$(css).appendTo('head');
					self.head = $('#'+self.elem);
				}
			}
			return self;
		}
	};

	return CssInject();
}));