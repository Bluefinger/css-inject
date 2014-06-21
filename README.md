# CSS-Inject.js

CSS-Inject is a small utility script for handling dynamic injection of CSS styling onto an HTML document. The use case for this utility is to manage the application of styles that would normally be injected inline using jQuery onto many elements. In situations where there's a need to apply dynamic styles at page load to many page elements at once, the most efficient way to achieve this is to just apply a single CSS stylesheet to the document head as opposed to iterating through each page element and assigning inline styles.

CSS-Inject can track and handle subsequent changes to the generated stylesheet. By only injecting the generated styles when specifically called, it reduces the amount of times the DOM gets manipulated and allows for multiple style changes to be queued before being rendered. The result is a much more efficient way to approach dynamic styling, in cases where extensive DOM manipulation can be avoided for the sake of simply applying additional or calculated styles.

## Caveat
CSS-Inject's performance depends on the limited amount of times that the script injects styles into the document. A single style injection is going to be more performant than 3. Queueing up as many styles before applying them will generally yield a much quicker response than using jQuery to iterate and apply styles to all the targeted elements. However, if there is only a single element being styled, jQuery is sufficient on its own to do this as CSS-Inject does not perform better than jQuery against styling a single element. CSS-Inject is intended to scale better when applying styles to more than one element on a given page.

Also in order to support Internet Explorer 8, the performance of updating an injected stylesheet is worse than the creation of one. There is a flag `cssInject.noIE` which when set to true, drops the support for IE8 and improves the performance of updating the generated stylesheet.

## Quick Example
```javascript
cssInject.add("#content", "height", "200px"); // Add a CSS rule for a selector, property and value
cssInject.add("#content > p", "font-weight", "bold"); // Standard CSS selectors all will work.

cssInject.apply() // Takes the queued styles and injects them into a <style> in the document head.
```

### Chaining Example
```javascript
// Adding two styles to the same selectors maps the properties to a single selector in the queue.
// This then gets injected out as a single #content {} style rule containing both properties.
cssInject.add("#content", "height", "200px").add("#content", "width", "300px").apply(); 
```

### Overwrite Styles Example
```javascript
cssInject.add("#content", "height", "200px").apply(); // Add a CSS rule and apply it

// Updates the same declared rule as above, but with a new value for the height and
// applies it to the generated stylesheet.
cssInject.add("#content", "height", "300px").apply();
```

### Remove Styles Example
```javascript
// Add example styles
cssInject.add("#content > p", "font-weight", "bold");
cssInject.add("#content", "width", "300px");
cssInject.add("#content", "height", "200px");

cssInject.apply();
// Individual properties or entire selector rules can be removed out of the queue
// Upon applying the changes, the specified rules and properties are expunged from
// the generated stylesheet.
cssInject.remove("#content > p", "font-weight").remove("#content").apply();
```

### Mapped Object import
```javascript
// You can declare an object containing corresponding selectors and assigned properties. 
// These automatically get tracked according to existing queued selectors if there are any matches. 
// In a valid object to pass to cssInject, the top level key corresponds to the selector,
// and the second level keys correspond to the css properties.
var rules = {
	"#content" : {
		"height": "200px",
		"width": "300px"
	}
}, selector = "#aside";
// Selectors can be dynamically defined and attached to an object.
rules[selector] = {
	"background-color":"#ccc"
};
cssInject.objectAdd(rules).apply(); // Inject the resulting CSS to the page
```

### Direct Object import
```js
// If mapping an object to existing styles isn't a concern, you can bypass cssInject.objectAdd()
// As long as the object you pass to cssInject is correctly formed, it'll then be able to parse.
cssInject.styles = {
	"#content" : {
		"height" : "200px",
		"width" : "300px"
	}
};

// Directly adding objects to cssInject.styles overrides any existing styles.
// This can also be used to reset the queued styles by passing an empty object.
cssInject.styles = {};
```

## Usage
Just include the script and away you go. The minified file is 1.09kB large, so it has a tiny footprint on your site. The only dependency is jQuery (Most recent versions recommended).
```html
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="css-inject.min.js"></script>
<script type="text/javascript">

	cssInject.add("body", "font-size", "14px").apply();

</script>
```
### Tips
Use a conditional to set `cssInject.noIE` to true when dealing with modern browsers, and to set to false when being loaded in IE8. This way, modern browsers like Chrome and Firefox can take advantage of quicker/simpler update methods whilst still supporting older browsers.

## Documentation
* [Object Model](#object-model)
* [Properties](#properties)
* [Functions](#functions)
* [Extend](#extend)

### Object Model
`cssInject` follows a particular format when mapping CSS styles to an object. In order to simplify how selectors and properties are mapped and handled, both selectors and properties form the keys of an object. So a given selector is the key to an object, which contains properties that are keys to values. The expected format for a `cssInject` style object is then as follows:
```
{
	[selector] : {
		[property] : [value]
	}
}
```
This allows an object to mirror the logical construction of a CSS style rule, and in turn simplifies the process of traversing the object to match and add/amend styles, as well as parsing out the object into CSS.

### Properties
#### cssInject.styles
Returns the object containing the styles to be injected. For individual properties or selectors, access `cssInject.styles[selector][properties]` as such in order to account for the string based keys. 
```js
cssInject.styles // Returns full object with every rule
cssInject.styles["#content"] // Returns the object containing the properties for the #content selector
cssInject.styles["#content"]["height"] // Returns the value stored for a given selector and property.
```

#### cssInject.id
Stores the string which forms the id attribute for the generated stylesheet. Change from the default of `css-inject-style` if in need of a different id or to resolve a conflict.

#### cssInject.noIE
Stores a boolean value to indicate whether to enable support of older IE browsers. Default set to `false`. If set to `true`, it disables the workaround to enable stylesheet updates in IE8. If set to true, stylesheet creation still works in IE8, but updates will incur errors.

### Functions
#### cssInject.add(selector, property, value)
Adds the specified CSS rules to the `cssInject.styles` object, mapping the properties to any existing and matching selectors or creating a new selector object. The `selector`, `property`, and `value` parameters must all be strings.  This method can be chained.
```js
cssInject.add("#content", "height", "200px"); // Single call input
// Chaining example
cssInject.add("#content", "width", "300px").add("#content > p", "font-weight", "bold");
```

#### cssInject.objectAdd(object)
Maps a given object to the `cssInject.styles` object. Allows multiple rules to be declared in an object. Every selector and property gets mapped to the `cssInject.styles` object, so either creating new style rules or updating existing ones. This method can be chained.
```js
// Create an object to store CSS declarations
var rules = {
	"#content" : {
		"height" : "200px",
		"width": : "300px"
	}
};
cssInject.objectAdd(rules); // Import object into queue
```

#### cssInject.remove(selector, property [optional])
Removes a given selector or property from the `cssInject.styles` object. If a property parameter is passed, it removes the specific property declaration from the selector's css styles. If only a selector is given, all the rules belonging to that selector are purged. This method can be chained.
```js
cssInject.remove("#content", "height"); // The height property is no longer present in #content {...}
```

#### cssInject.parse()
Parses the internal object and returns a string containing all the set CSS rules within `cssInject.styles`. This method cannot be chained.
```js
cssInject.add("#content", "height", "200px");
console.log(cssInject.parse()); // prints out the string "#content {height:200px;}" into the console.
```

#### cssInject.apply()
Calls `cssInject.parse()` to convert the internal object into a string containing all the set CSS declarations and then injects it into a style element. The style element is appended to the document head under the ID "#css-inject-style". This method can be chained.
```js
cssInject.add("#content", "height", "200px");
cssInject.apply(); // Applies a stylesheet to the document head containing all set CSS rules.
```

### Extend
`cssInject` can be extended in much the same way jQuery can. There's a prototype shorthand, `cssInject.fn` that can be called to extend the functionality of the `cssInject` object. Chaining is achieved by adding `return this` to the end of any new function.
```js
cssInject.fn.stuff = function () {
	// do Stuff
	return this;
};
```