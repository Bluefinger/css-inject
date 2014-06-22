(function(root, factory){
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define("css-inject", [], factory);
	} else {
		root.cssInject = factory();
	}
}(this, function(){
	"use strict";
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			if ( this === undefined || this === null ) {
				throw new TypeError( '"this" is null or not defined' );
			}
			var length = this.length >>> 0; // Hack to convert object.length to a UInt32
			fromIndex = +fromIndex || 0;
			if (Math.abs(fromIndex) === Infinity) {
				fromIndex = 0;
			}
			if (fromIndex < 0) {
				fromIndex += length;
				if (fromIndex < 0) {
					fromIndex = 0;
				}
			}
			for (fromIndex;fromIndex < length; fromIndex+=1) {
				if (this[fromIndex] === searchElement) {
					return fromIndex;
				}
			}
			return -1;
		};
	}
	var CssBase = function () {
		this.removeCss = function(index, property){
			if (property && this.obj.cssRules) {
				this.rules[index].style.removeProperty(property);
			} else if (property && this.obj.rules ) {
				if (property === "float") {
					this.rules[index].style.removeAttribute("styleFloat");
				} else {
					this.rules[index].style.removeAttribute(property);
				}
			} else if (!property) {
				if (this.obj.deleteRule) {
					this.obj.deleteRule(index);
				} else {
					this.obj.removeRule(index);
				}
			}
		};
		this.addCss = function (selector, property, value, index) {
			if (this.obj.insertRule) {
				this.obj.insertRule(selector + "{" + property + ":"+ value + ";}",index);
			} else {
				this.obj.addRule(selector, property + ":" + value + ";", index);
			}
		};
		this.modifyCss = function (property, value, index) {
			if (this.obj.cssRules) {
				this.rules[index].style.setProperty(property,value);
			} else if (this.obj.rules) {
				if (property === "float") {
					this.rules[index].style.setAttribute("styleFloat", value);
				} else {
					this.rules[index].style.setAttribute(property,value);
				}
			}
		};
		this.findAttr = function (array, attr, value){
			var i, l = array.length;
			for (i = 0;i < l;i+=1) {
				if (array[i][attr] === value) {
					return i;
				}
			}
			return -1;
		};
		this.init = function () {
			var el, head;
			el = document.createElement("style");
			el.type = "text/css";
			el.id = this.id;
			el.media = this.media;
			head = document.head || document.getElementsByTagName('head')[0];
			head.appendChild(el);
			this.obj = document.styleSheets[document.styleSheets.length - 1];
			this.rules = this.obj.cssRules || this.obj.rules;
			return this;
		};
		this.add = function (selector, property, value) {
			var index = this.styles.indexOf(selector);
			if (index > -1) {
				this.styles[index].selector = selector;
				this.modifyCss(property,value,index);
			} else {
				this.styles.push(selector);
				index = this.styles.length - 1;
				this.addCss(selector, property, value, index);
			}
			return this;
		};
		this.objectAdd = function (object) {
			if (typeof object === "object") {
				var i, l = object.properties.length;
				for (i = 0;i < l;i+=1) {
					this.add(object.selector, object.properties[i].property, object.properties[i].value);
				}
			} else {
				throw new TypeError("Parameter is not an object");
			}
			return this;
		};
		this.multiAdd = function (arr) {
			var i, l = arr.length;
			for (i = 0;i < l; i+=1) {
				if (typeof arr[i] === "object") {
					this.objectAdd(arr[i]);
				} else {
					throw new TypeError("Must pass an object item in the array");
				}
			}
			return this;
		};
		this.remove = function (selector, property) {
			var index = this.styles.indexOf(selector);
			if (index > -1) {
				if (property) {
					this.removeCss(index, property);
				} else {
					this.styles.splice(index, 1);
					this.removeCss(index);
				}
			}
			return this;
		};
		this.multiRemove = function (arr) {
			var i, l = arr.length;
			for (i = 0;i < l; i+=1) {
				if (typeof arr[i] === "object") {
					this.remove(arr[i].selector, arr[i].property);
				} else {
					throw new TypeError("Must pass an object item in the array");
				}
			}
			return this;
		};
	}, CssInject = function () {
		this.id = "css-inject-style";
		this.media = "screen";
		this.styles = [];
		this.obj = '';
		this.rules = '';
	};
	CssInject.fn = CssInject.prototype = new CssBase();
	
	return new CssInject();
}));