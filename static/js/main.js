/**
 * @name $
 * @description Library for 
 * 
 * @selector {string} String representing CSS selector used to grab elements from DOM
 * @context {object} (optional) Element needed to set context and use selector only on its descendants
 *
 * @function
 * @returns {object} 
 */
window.$ = (function() {

    function Collection(elements) {
        for (var i = 0; i < elements.length; i++) {
            this[i] = elements[i];
        }
        this.length = elements.length;
    }

    Collection.prototype.map = function(callback) {
        var results = [];

        for (var i = 0; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }

        return results;
    };

    Collection.prototype.mapOne = function(callback) {
        var results = this.map(callback);

        return results.length > 1 ? results : results[0];
    };

    Collection.prototype.attr = function(attr, value) {
        if (typeof value !== "undefined") {
            this.map(function(element) {
                element.setAttribute(attr, value)
            });
            return this;
        } else {
            return this.mapOne(function(element) {
                return element.getAttribute(attr);
            });
        }
    };

    Collection.prototype.html = function(value) {
        if (typeof value !== "undefined") {
            this.map(function(element) {
                element.innerHTML = value;
            });
            return this;
        } else {
            return this.mapOne(function(element) {
                return element.innerHTML;
            });
        }
    };

    Collection.prototype.addClass = function(class_name) {
        this.map(function(element) {
            element.classList.add(class_name);
        });

        return this;
    };

    Collection.prototype.removeClass = function(class_name) {
        this.map(function(element) {
            element.classList.remove(class_name)
        });

        return this;
    };

    Collection.prototype.on = function(event, callback) {
        this.map(function(element) {
            element.addEventListener(event, callback, false);
        });

        return this;
    };

    Collection.prototype.smoothScroll = function() {
        this.map(function(element) {
            var target = element.getAttribute("href").split("#")[1];

            element.addEventListener("click", function(e) {
                e.preventDefault();
                smoothScrollHandler(target);
            });
        });

        return this;

        function smoothScrollHandler(target) {
            var target_position = document.getElementById(target);
            if (typeof target_position === "undefined") {
                return;
            }

            target_position = target_position.offsetTop;
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

    };

    return function(selector, context) {
        var elements;

        if (typeof context === "undefined") {
            context = document;
        }

        if (typeof selector === "string") {
            elements = context.querySelectorAll(selector);
        } else {
            elements = [];
            elements.push(selector);
        }

        return new Collection(elements);
    }
})();

/**
 * Main load function
 */
window.onload = function() {

    // Set external links to open in a new window
    $("a.external-link").attr("target", "_blank");

    // Generate mailto link from data fragments
    var email_link = $("a.generate-email");
    email_link.map(function(element) {
        var email = $(element).attr("data-left") + '@' + $(element).attr("data-right");
        $(element).attr("href", "mailto:" + email);
    });

    // Attach smooth scrolling to menu links
    $("a.smooth-scroll").smoothScroll();

    // // Attach google tracking event for PDF download
    $("a.pdf-download").on("click", function() {
        ga("send", "event", "PDF", "download", $(this).attr("href"));
    });

    // Attach overlay handlers only when on projects main page
    if ($("#projects").length) {

        // Attach onclick on project links to open overlay
        $(".item").map(function(element) {
            var content = $(".item-content", element).html();

            $("a.open-overlay", element).map(function(link) {

                $(link).on("click", function(e) {
                    e.preventDefault();
                    $(".project-details").html(content);
                    $("#overlay").addClass("show");
                });
            });
        });

        // Attach event to close overlay
        $(".overlay-close").on("click", function(e) {
            e.preventDefault();
            $("#overlay").removeClass("show");
        });
    }
};
