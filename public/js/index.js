$(function(){
	$('#want-more').click(function() {
	    if ( $('#want-more-text').is(':hidden')) {
	      $('#want-more-text').slideDown('slow');
	      $(this).text('SHOW LESS');
	    } else {
	      $('#want-more-text').slideUp();
	      $(this).text('SHOW MORE');
	    } 
	  });
});