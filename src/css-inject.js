(function(root, factory){
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define("css-inject", [], factory);
	} else {
		root.cssInject = factory();
	}
}(this, function(){
	"use strict";
	var CssBase = function () {
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
		this.index = function (search, arr) {
			var length = arr.length >>> 0, from = 0;
			for (from;from < length;from+=1) {
				if (arr[from] === search) {
					return from;
				}
			}
			return -1;
		};
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
		this.addCss = function (index, selector, property, value) {
			var str = (!value) ? property : property + ":" + value + ";";
			if (this.obj.insertRule) {
				this.obj.insertRule(selector + "{" + str + "}",index);
			} else {
				this.obj.addRule(selector, str, index);
			}
		};
		this.modifyCss = function (index, property, value) {
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
		this.add = function (selector, property, value) {
			var index =  this.index(selector,this.styles); //this.styles.indexOf(selector);
			if (index > -1) {
				this.styles[index] = selector;
				this.modifyCss(index, property, value);
			} else {
				index = this.styles.length;
				this.styles.push(selector);
				this.addCss(index, selector, property, value);
			}
			return this;
		};
		this.objectAdd = function (object) {
			var selector, property, str, index;
			if (typeof object === "object") {
				for (selector in object) {
					if (object.hasOwnProperty(selector)){
						str = "";
						index = this.index(selector, this.styles); //this.styles.indexOf(selector);
						for (property in object[selector]) {
							if (object[selector].hasOwnProperty(property)) {
								if (index === -1) {
									str += property + ":" + object[selector][property] + ";";
								} else {
									this.add(selector, property, object[selector][property]);
								}
							}
						}
						if (index === -1) { this.add(selector,str); }
					}
				}
			} else {
				throw new TypeError("Parameter is not an object");
			}
			return this;
		};
		this.addInline = function (elem, property, value) {
			if (this.obj.cssRules) {
				elem.style.setProperty(property, value);
			} else if (this.obj.rules && property === "float") {
				elem.style.setAttribute("styleFloat", value);
			} else {
				elem.style.setAttribute(property, value);
			}
			return this;
		};
		this.addObjectInline = function (elems, object) {
			var i, l, property;
			for (property in object) {
				if (object.hasOwnProperty(property)) {
					if (elems.length) {
						for (i = 0, l = elems.length; i < l; i+=1) {
							this.addInline(elems[i], property, object[property]);
						}
					} else {
						this.addInline(elems, property, object[property]);
					}
				}
			}
			return this;
		};
		this.removeInline = function (elem, property) {
			if (this.obj.cssRules) {
				elem.style.removeProperty(property);
			} else if (this.obj.rules && property === "float") {
				elem.style.removeAttribute("styleFloat");
			} else {
				elem.style.removeAttribute(property);
			}
			return this;
		};
		this.removeArrayInline = function (elems, arr) {
			var i, j, l, m;
			for (i = 0, l = arr.length; i < l; i+=1) {
				if (elems.length) {
					for (j = 0, m = elems.length; j < m; j +=1 ) {
						this.removeInline(elems[j],arr[i]);
					}
				} else {
					this.removeInline(elems, arr[i]);
				}
			}
			return this;
		};
		this.remove = function (selector, property) {
			var index = this.index(selector,this.styles); //this.styles.indexOf(selector);
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
		this.objectRemove = function (object) {
			var selector, i, l;
			for (selector in object) {
				if (object.hasOwnProperty(selector)) {
					l = (object[selector]) ? object[selector].length : 0;
					if (l > 0) {
						for (i=0;i<l;i+=1) {
							this.remove(selector, object[selector][i]);
						}
					} else {
						this.remove(selector);
					}
				}
			}
			return this;
		};
	},
	CssInject = function () {
		this.id = "css-inject-style";
		this.media = "screen";
		this.styles = [];
		this.obj = '';
		this.rules = '';
	};
	CssInject.fn = CssInject.prototype = new CssBase();
	return new CssInject();
}));