$(document).ready(function(){       
   var scroll_start = 0;
   $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if(scroll_start > 60) {
          $('.navbar-fixed-top').css('background-color', 'rgba(55, 49, 84, 1)');
          $('.navbar-custom').css('padding', '10');
          $('.navbar-brand').css('font-size', '1.5em');
       } else {
          $('.navbar-fixed-top').css('background-color', 'transparent');
          $('.navbar-custom').css('padding', '25');
          $('.navbar-brand').css('font-size', '2em');
       }
   });
});