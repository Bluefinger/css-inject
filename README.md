# CSS-Inject.js #

CSS-Inject is a small utility script for handling dynamic injection of CSS styling onto an HTML document. The use case for this utility is to manage the application of styles that would normally be injected inline using jQuery onto many objects. In situations where there's a need to apply dynamic styles at page load to many page elements at once, the most efficient way to achieve this is to just apply a single CSS stylesheet to the document head as opposed to iterating through each page element and assigning inline styles.

CSS-Inject can track and handle subsequent changes to the generated stylesheet. By only injecting the generated styles when specifically called, it reduces the amount of times the DOM gets manipulated and allows for multiple style changes to be queued before being rendered. The result is a much more efficient way to approach dynamic styling, in cases where extensive DOM manipulation can be avoided for the sake of simply applying additional or calculated styles.

## Quick Example ##
```javascript
cssInject.add("#content", "height", "200px"); // Add a CSS rule for a selector, property and value
cssInject.add("#content > p", "font-weight", "bold"); // Standard CSS selectors all will work.

cssInject.apply() // Takes the queued styles and injects them into a <style> in the document head.
```