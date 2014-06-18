# CSS-Inject.js

CSS-Inject is a small utility script for handling dynamic injection of CSS styling onto an HTML document. The use case for this utility is to manage the application of styles that would normally be injected inline using jQuery onto many objects. In situations where there's a need to apply dynamic styles at page load to many page elements at once, the most efficient way to achieve this is to just apply a single CSS stylesheet to the document head as opposed to iterating through each page element and assigning inline styles.

CSS-Inject can track and handle subsequent changes to the generated stylesheet. By only injecting the generated styles when specifically called, it reduces the amount of times the DOM gets manipulated and allows for multiple style changes to be queued before being rendered. The result is a much more efficient way to approach dynamic styling, in cases where extensive DOM manipulation can be avoided for the sake of simply applying additional or calculated styles.

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

### Advanced: Full Object import
```javascript
// You can declare a full object containing corresponding selectors and assigned properties. 
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
}
cssInject.objectAdd(rules).apply(); // Inject the resulting CSS to the page
```

## Usage
Just include the script and away you go.
```html
<script type="text/javascript" src="css-inject.min.js"></script>
<script type="text/javascript">

	cssInject.add("body", "font-size", "14px").apply();

</script>
```

## Documentation
To be Written.