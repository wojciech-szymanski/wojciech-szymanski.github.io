/**
 * @name parseLink
 * @description Default function for modifying link element
 * 
 * @css_class {string} name of the CSS class that needs to be selected
 * @callback {function} callback function to be executed on each matched element
 *
 * @function
 * @returns {void} 
 */
function parseLink(css_class, callback) {
	var links = document.getElementsByClassName(css_class);

	Array.prototype.forEach.call(links, callback);
}

/**
 * Main load function
 */
window.onload = function() {

	// Set external links to open in new window
	parseLink("external-link", function(element) {
		element.setAttribute("target", "_blank");
	});

	// Generate mailto link from data fragments
	parseLink("generate-email", function(element) {
		var email = element.getAttribute("data-left") + 
			'@' + element.getAttribute("data-right");

		element.setAttribute("href", "mailto:" + email);
	});
};
