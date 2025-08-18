jQuery(function ($) {
   $('.drag')
   .drag("start", function () {
      return $(this).clone()
      .css("opacity", 0.75)
      .insertAfter($(this));
   })
   .drag(function (ev, dd){
      $(dd.proxy).css({
         top: dd.offsetY,
         left: dd.offsetX
      });
   })
   .drag("end", function (ev, dd) {
      // $(this).animate({
      //    top: dd.offsetY,
      //    left: dd.offsetX
      // }, 420);
      $(dd.proxy).remove();

   });
});