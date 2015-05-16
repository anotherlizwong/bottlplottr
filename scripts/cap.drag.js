jQuery(function ($) {
   var cellWidth = $('.cell').width();
   $('.drag').drag(function( ev, dd ){
      $( this ).css({
         top: Math.round( dd.offsetY / cellWidth ) * cellWidth,
         left: Math.round( dd.offsetX / cellWidth ) * cellWidth
      });
   });
});