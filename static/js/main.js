/**
 * Created by Wojciech Szymanski
 */

window.onload = function() {
	var links = document.getElementsByClassName("generate-mail");

	Array.prototype.forEach.call(links, function(element) {
		var email = element.getAttribute("data-left") + 
			'@' + element.getAttribute("data-right");

		element.setAttribute("href", "mailto:" + email);
	});
};
