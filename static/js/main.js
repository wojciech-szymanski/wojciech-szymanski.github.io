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
 * @name openOverlay
 * @description Assigns event handler for opening project details in an overlay
 *
 * @function
 * @returns {void} 
 */
function openOverlay() {
	var items = document.getElementsByClassName("item");

	Array.prototype.forEach.call(items, processLinks);

	function processLinks(item) {
		var content = item.getElementsByClassName("item-content")[0].innerHTML;
		var links = item.getElementsByClassName("open-overlay");

		Array.prototype.forEach.call(links, addEvent.bind(undefined, content));
	}

	function addEvent(content, link) {
		link.addEventListener("click", onClick.bind(undefined, content));
	}

	function onClick(content, e) {
		e.preventDefault();
		document.getElementsByClassName("project-details")[0].innerHTML = content;
		document.getElementById("overlay").classList.add("show");
	}

}

/**
 * @name closeOverlay
 * @description Assigns event handler for closing an overlay
 *
 * @function
 * @returns {void} 
 */
function closeOverlay() {
	var close = document.getElementsByClassName("overlay-close")[0].getElementsByTagName("a")[0];

	close.addEventListener("click", function(e) {
		e.preventDefault();
		document.getElementById("overlay").classList.remove("show");
	})
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

	// Attach overtlay handlers only when on projects main page
	if (document.getElementById("projects")) {
		openOverlay();
		closeOverlay();
	}
};
