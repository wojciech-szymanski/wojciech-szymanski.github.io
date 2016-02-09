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
 * @name smoothSroll
 * @description Provides smooth scrolling behavior to anchor links
 *
 * @elem {string} id of the element that needs to be scrolled to 
 *
 * @function
 * @returns {void} 
 */
function smoothScroll(elem) {
	var target_position = document.getElementById(elem).offsetTop;
	var current_position = window.pageYOffset;
	var scroll_distance = target_position - current_position;
	var scroll_to = current_position;
	var step = Math.round(scroll_distance / 25);
	var timer = 0;

	// Set timeout function to be used as a closure
	var setTimeoutClosure = function(leap) {
		setTimeout(function() {
			window.scrollTo(0, leap);
		}, timer * speed);
	}

	// Scroll directly if the distance to anchor is below 200 pixels
	if (Math.abs(scroll_distance) < 200) {
		window.scrollTo(0, target_position);
		return;
	}

	// Calculate timeout in milliseconds between each step, fix it to maximum of 20
	var speed = Math.round(Math.abs(scroll_distance / 100));
    if (speed >= 20) speed = 20;

    // The case of scrolling down
	if (step > 0) {
		while (scroll_to < target_position) {
			scroll_to += step;
			if (scroll_to > target_position)
				scroll_to = target_position;
			setTimeoutClosure(scroll_to);
			timer += 1;
		}
		return;
	}
	
	// The case of scrolling up
	while (scroll_to > target_position) {
		scroll_to += step;
		if (scroll_to < target_position)
			scroll_to = target_position;
		setTimeoutClosure(scroll_to);
		timer += 1;
	}

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

	// Attach smooth scrolling to menu links
	parseLink("smooth-scroll", function(element) {
		element.addEventListener("click", addSmoothScroll);

		function addSmoothScroll(e) {
			e.preventDefault();
			smoothScroll(element.getAttribute("href").split("#")[1]);
		}
	});

	// Attach google tracking event for PDF download
	parseLink("pdf-download", function(element) {
		element.addEventListener("click", ga("send", "event", "PDF", "download", element.getAttribute("href")));
	});

	// Attach overlay handlers only when on projects main page
	if (document.getElementById("projects")) {
		openOverlay();
		closeOverlay();
	}
};
