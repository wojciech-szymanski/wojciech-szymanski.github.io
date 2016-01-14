/**
 * Created by fabiomadeira on 25/02/15.
 */
// jQuery for generating email link
jQuery(document).ready(function(e) {
    e("a.generate-mail").each(function() {
    	var email = e(this).data('left') + '@' + e(this).data('right');

		e(this).attr('href', 'mailto:' + email);
    	if (e(this).hasClass('append-mail')) {
    		e(this).append(email);
    	}
    });
});


