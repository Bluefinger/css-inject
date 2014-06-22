# CSS-Inject.js

CSS-Inject is a small utility script for handling dynamic injection of CSS styling onto an HTML document. The use case for this utility is to manage the application of styles that would normally be injected inline using jQuery onto many elements. In situations where there's a need to apply dynamic styles at page load to many page elements at once, the most efficient way to achieve this is to just apply a single CSS stylesheet to the document head as opposed to iterating through each page element and assigning inline styles.

CSS-Inject can track and handle subsequent changes to the generated stylesheet. CSS-Inject only accesses the DOM once to create a stylesheet element, from which it then hooks into the browser's CSSStylesheet Object to directly create and manage dynamically created CSS styles. This then allows multiple elements on a page to be styled efficiently without any inline-styles having to be injected into the DOM a la jQuery. This result is a much more efficient approach to dynamic styling that avoids excessive DOM manipulation.

## Caveat
CSS-Inject's performance scales far better than jQuery when it comes to styling multiple elements on a page, though performance for styling a single element is roughly comparable with jQuery depending on the amount of styles being applied to a given element. In most cases, CSS-Inject is faster than jQuery for applying styles, even with a single element and the performance difference increases dramatically once more than one elements are being dynamically styled.

## Quick Example
```javascript
cssInject.add("#content", "height", "200px"); // Add a CSS rule for a selector, property and value
cssInject.add("#content > p", "font-weight", "bold"); // Standard CSS selectors all will work.

```

### Chaining Example
```javascript
// Adding two styles to the same selectors maps the properties to a single selector in the queue.
// This then gets injected out as a single #content {} style rule containing both properties.
cssInject.add("#content", "height", "200px").add("#content", "width", "300px"); 
```

### Overwrite Styles Example
```javascript
cssInject.add("#content", "height", "200px"); // Add a CSS rule and apply it

// Updates the same declared rule as above, but with a new value for the height and
// applies it to the generated stylesheet.
cssInject.add("#content", "height", "300px");
```

### Remove Styles Example
```javascript
// Add example styles
cssInject.add("#content > p", "font-weight", "bold");
cssInject.add("#content", "width", "300px");
cssInject.add("#content", "height", "200px");

// Individual properties or entire selector rules can be removed out of the queue
// Upon applying the changes, the specified rules and properties are expunged from
// the generated stylesheet.
cssInject.remove("#content > p", "font-weight").remove("#content");
```

### Object import
```javascript
// You can declare an object containing corresponding selectors and assigned properties. 
// These automatically get tracked according to existing queued selectors if there are any matches. 
// In a valid object to pass to cssInject, the top level key corresponds to the selector,
// and the second level keys correspond to the css properties.
var rules = {
	"#content": {
		"height":"200px"
		"width":"300px"
	}
}, selector = "#aside";
// Selectors can be dynamically defined and attached to an object.
rules[selector] = {
	"background-color":"#ccc"
};
cssInject.objectAdd(rules); // Inject the resulting CSS to the page
```

## Usage
Just include the script and away you go. The minified file is 2.12kB large, so it has a tiny footprint on your site. It has no dependencies (not even jQuery!).
```html
<script type="text/javascript" src="css-inject.min.js"></script>
<script type="text/javascript">

	cssInject.init().add("body", "font-size", "14px");

</script>
```

## Documentation
* [Object Model](#object-model)
* [Properties](#properties)
* [Functions](#functions)
* [Extend](#extend)

### Object Model
`cssInject` follows a particular format when mapping CSS styles to an object. In order to simplify how selectors and properties are mapped and handled, both selectors and properties form the keys of an object. So a given selector is the key to an object, which contains properties that are keys to values. The expected format for a `cssInject` style object is then as follows:
```
{
	"selector" : {
		"property" : "value"
	}
}
```
This allows an object to mirror the logical construction of a CSS style rule, and in turn simplifies the process of traversing the object to match and add/amend styles, as well as parsing out the object into CSS. Removing styles employs a slightly different object format, as values no longer need to be tracked:
```
{
	"selector": ["property"]
}
```
When removing a property, there's no need to map values to the CSS StyleSheet object, and as such all properties that are being declared for removal are listed in an array. Passing an empty array in this format is the same as `cssInject("selector")` in which the entire selector rule gets deleted as opposed to only removing a single property.

### Properties
#### cssInject.styles
Returns an array of all selectors currently active in the Stylesheet Object. The array allows the `cssInject` object to track the index for particular style rules and selectors. 
```js
cssInject.styles // Returns a list of currently active selectors
cssInject.styles[1] // Returns the selector name at the given index
```

#### cssInject.id
Stores the string which forms the id attribute for the generated stylesheet. Change from the default of `css-inject-style` if in need of a different id or to resolve a conflict.

#### cssInject.media
Stores the media type for the `cssInject` stylesheet. Default is "screen". Can be changed to implement a media query.

#### cssInject.obj
Stores the main `CSSStylesheet` object. This object is what applies and handles the application and drawing of CSS in an HTML document.

#### cssInject.rules
Stores either a .cssRules object or .rules object from the main `CSSStylesheet` object. Used to correct for older non-standard implementations of the `CSSStylesheet` object.

### Functions
#### cssInject.add(selector, property, value)
Adds the specified CSS rules to the `cssInject` stylesheet and updates the `cssInject.styles` array with the index for the active rule. If the selector is already active, the css rule gets updated with the new/modified properties. The `selector`, `property`, and `value` parameters must all be strings.  This method can be chained.
```js
cssInject.add("#content", "height", "200px"); // Single call input
// Chaining example
cssInject.add("#content", "width", "300px").add("#content > p", "font-weight", "bold");
```

#### cssInject.objectAdd(object)
Maps a given object to the `cssInject` stylesheet and updates the `cssInject.styles` array with the new indexes. Allows multiple rules to be declared in an object. Every selector and property gets mapped to the `cssInject` stylesheet, so either creating new style rules or updating existing ones. This method can be chained.
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

#### cssInject.objectRemove(object)
Removes all mapped selectors and properties in the passed object. If a selector has an array of properties, those specific properties get removed. If a selector is passed with an empty array, the entire selector rule gets removed.
```js
var purge = {
	"#content" : ["height","background"], // Height and Background properties will be deleted
	"#aside" : [] // The entire #aside CSS rule will be deleted
}
cssInject.objectRemove(obj);
```

#### cssInject.init()
Initialises the `cssInject` stylesheet. Creates a `<style>` element in the document head and then maps the corresponding `CSSStylesheet` object. Requires no parameters and can be chained.

#### cssInject.addCss(index, selector, property, value)
Directly adds a CSS rule into `CSSStylesheet` object at the given index. Warning: if the wrong index is given, it will create a second rule for the same selector. Index must be numerical and selector, property, and value parameters must be strings.

#### cssInject.modifyCss(index, property, value)
Modifies a css rule at the given index. Either an existing property is modified, or a new property is added. Warning: will throw an error if the index points to an empty rule.

#### cssInject.removeCss(index, property[optional])
Removes a css rule from the given index. If a property is provided, the property is removed from the style. If no property is provided, then the entire selector at the given index is removed. Warning: will throw an error if the index points to an empty rule.

### Extend
`cssInject` can be extended in much the same way jQuery can. There's a prototype shorthand, `cssInject.fn` that can be called to extend the functionality of the `cssInject` object. Chaining is achieved by adding `return this` to the end of any new function.
```js
cssInject.fn.stuff = function () {
	// do Stuff
	return this;
};
```