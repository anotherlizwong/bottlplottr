'use strict';

var CAP_GAP = .05;
var CAP_SIZE = 1.20;

/**
 * Variable holds a key and map to a Color object
 * @type {{}}
 */
var legend = {}

$(document).ready(function () {

  /**
   * Used to log events
   */
  $(document).bind("logEvent", function () {
    var x;
    for (x in legend) {
      console.log(legend[x].toString());
    }
  });

  /**
   * howManyFewerSpots tells us how many spots fewer there are on the board. Pass a negative number to indicate there are more spots
   */
  $('.overall-total').bind('legendUpdated', function (e, howManyFewerSpots) {
    var value = $(this).find("#tot_remaining");
    value.text(parseInt(value.text()) - howManyFewerSpots);
  });

  /**
   * generates the grid and cells and selectable locations
   */
  $('#testform').submit(function (event) {
    clearGrid();
    generateGrid();
    $(".selectable").selectable({
      filter: ".cap"
    });

    return false;
  });

  //handle the events in every element. Only applies to elements which can be handle focus
  $(document).keydown(function (event) {
    if (event.wich == 8 || event.which == 46) { //100 is the 'd' key. The delete key is difficult to bind.
      resetStyles($(".ui-selected"));
    }
  });

  // reset the styles to empty
  var resetStyles = function (elem) {
    var regEx = /cap[0-9]+/;
    $.each(elem, function (index, value) {
      var el = value;
      el.removeAttribute("style");
      var elClassName = el.className.match(regEx);

      // If this cap spot is not empty continue resetting it, otherise skip
      if (elClassName) {
        var foreignCapId = elClassName[0].substring(3);
        legend[foreignCapId].count = legend[foreignCapId].count + 1;
        $('#form' + foreignCapId).trigger("legendUpdated", foreignCapId);
        $('.overall-total').trigger('legendUpdated', -1);
      }
      el.className = el.className.replace(regEx, 'empty');
      el.className = el.className.replace('ui-selected', '');
    });
    // elem.addClass("empty");
    return elem.size();
  }

  // Clear the grid
  $('#clear_grid').click(function (event) {
    clearGrid();
  });

  /**
   * Ties to main legend form and allows us to create additional legend entries
   */
  $('#add_legend').click(function (event) {
    addLegendEntry();
  });

  $(document).on("click", ".delete", function (event) {
    var id = $(this).closest('form').find('[name=id]');
    $(this).closest('form').remove();

    console.log("removed id " + id + " from dictionary");
    var caps = $(".cap" + id.val());
    $('.overall-total').trigger('legendUpdated', - caps.size());
    caps.css('background-color', '').removeClass("cap" + id.val()).addClass('empty');
    deleteColorFromLegend(id);
  });

  //addLegendEntry();
  initAndGenerateGridInternal(1, 2, 1, 2);

  //addColorToLegend(new Color("test", "5e3a3a", 10, 0));
  //addColorToLegend(new Color("test2", "111111", 10, 1));

  $(".selectable").selectable({
    filter: ".cap"
  });

  // var capData;
  // $.getJSON('../assets/caps/caps.json',function(data){
  //   console.log('success getting caps from json');
  //   // $.each(data.caps,function(i,cap){
  //   //   $('ul').append('<li>'+cap.name+' '+cap.filename+'</li>');
  //   // });
  //   capData = data;
  // }).error(function(){
  //   console.log('error');
  // });
  $('.auto-complete-name').autocomplete({
    minLength: 0,
    source: function(req, add) {
        add($.map(capData, function(el) {
          return {
            label: el.name,
            value: el.filename
          };
        }));
      },
      focus: function(event, ui) {
        $(this).val(ui.item.label);
        return false;
      },
      select: function(event, ui) {
        $(this).val(ui.item.label);
        // $(this)
        return false;
      }
  });


  $( "#toggle" ).click(function() {
    $( "#test2" ).toggle( "slide" );
  });


});


function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}