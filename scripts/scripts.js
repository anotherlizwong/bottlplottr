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
    minLength: 1,
    source: function(req, add) {
        var suggestions = capData;
        add(suggestions);
      },
      select: function(e, ui) {
        console.log(ui.cap.batch19);
      }
  });
});


function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}


function addColorToLegend(color) {
  legend[color.id] = color;
  console.log("saved " + color.id + " to dictionary");
  $(".cap" + color.id).css('background-color', '#' + color.hex);
}

function deleteColorFromLegend(id) {
  console.log("removed id " + id + " from dictionary");
  var caps = $(".cap" + id.val());
  if (legend[id.val()]) {
    $('.overall-total').trigger('legendUpdated', -caps.size());
    delete legend[id.val()];
  }
  caps.css('background-color', '').removeClass("cap" + id.val()).addClass('empty');
}

function toggleEnabledLegendEntry(legendEntry) {
}

function legendSubmit() {

}

var legendEntrySubmit = function (event) {
  $(this).find(".save").addClass("hidden");
  $(this).find(".edit").removeClass("hidden");
  $(this).find("[name=name]").attr('readonly', true);
  $(this).find("[name=number]").attr('readonly', true);
  $(this).find("[name=hex]").spectrum({disabled: true});

  var name = $(this).find("[name=name]").val();
  var count = parseInt($(this).find("[name=number]").val());
  var hex = $(this).find("[name=hex]").spectrum("get").toHex();
  var id = $(this).find("[name=id]").val();
  var color = new Color(name, hex, count, id);

  addColorToLegend(color);

  return false;
}

function addLegendEntry() {
  var colorId = getNextColorSeqId();
  var legendEntry = $('.color_input').clone();

  legendEntry.removeClass("hidden");
  legendEntry.removeClass("color_input");
  legendEntry.attr('id', 'form' + colorId);
  legendEntry.find("[name=hex]").spectrum();
  legendEntry.find(".edit").addClass("hidden");
  legendEntry.find("[name=id]").val(colorId);
  legendEntry.appendTo($('#legend'));

  legendEntry.bind("legendUpdated", function (e, myName, myValue) {
    $(this).find("[name=number]").val(legend[myName].count)
  });

  legendEntry.submit(legendEntrySubmit);

  legendEntry.find(".edit").click(function (event) {
    legendEntry.find(".save").removeClass("hidden");
    legendEntry.find(".edit").addClass("hidden");
    legendEntry.find("[name=name]").attr('readonly', false);
    legendEntry.find("[name=hex]").attr('disabled', false);
    legendEntry.find("[name=hex]").spectrum({disabled: false});
    legendEntry.find("[name=number]").attr('readonly', false);
  });

  legendEntry.find(".color_paint").click(function (event) {

    debugger;
    var id = legendEntry.find("[name=id]").val();
    if (!legend[id]) return; // if we try to paint with a legend entry that isn't ready, don't bother
    var hex = legend[id].hex;
    var count = $(".ui-selected").length;
    // add the color of the current cap
    $(".ui-selected").css('background-color', '#' + hex);
    // go throug the current caps and return their tokens
    $(".ui-selected").each(function (i, object) {

      var classToRemove;
      $(object.classList).each(function (j, o) {
        if (o.indexOf("cap") > -1 && o.length > 3) {
          classToRemove = o;
          var foreignCapId = o.substring(3);
          legend[foreignCapId].count = legend[foreignCapId].count + 1;
          $('#form' + foreignCapId).trigger("legendUpdated", foreignCapId);
          $('.overall-total').trigger('legendUpdated', -1);
        }
      });
      $(object).removeClass(classToRemove);
    });

    // assign this square to the selected cap
    $(".ui-selected").addClass("cap" + id);

    //remove the current selections
    $(".ui-selected").removeClass("empty").removeClass("ui-selected");

    // update the pointers;
    legend[id].count = legend[id].count - count;
    $('.overall-total').trigger('legendUpdated', count);
    $('#form' + id).trigger("legendUpdated", id);
    $(document).trigger("logEvent");
  });

}

// GRID FUNCTIONS
function clearGrid() {
  $("#grid").empty();
}

function generateGrid() {
  var height = parseInt($('#y_ft').val()); // height
  var height_in = parseInt($('#y_in').val()); // height
  var width = parseInt($('#x_ft').val()); // width
  var width_in = parseInt($('#x_in').val()); // width
  height = height ? height : 0;
  height_in = height_in ? height_in : 0;
  width = width ? width : 0;
  width_in = width_in ? width_in : 0;

  generateGridInternal(height, height_in, width, width_in);

}

// When the reset table button is clicked, return the caps on the board to their proper place in the legend
function returnLegendCapsBack() {
  //todo
}
function initAndGenerateGridInternal(height, height_in, width, width_in) {

  $('#y_ft').val(height); // height
  $('#y_in').val(height_in); // height
  $('#x_ft').val(width); // width
  $('#x_in').val(width_in); // width

  generateGridInternal(height, height_in, width, width_in);
}

function generateGridInternal(height, height_in, width, width_in) {

  console.log('generating grid');

  var grid = $("#grid");

  var tot_height_in = height * 12 + height_in;
  var tot_width_in = width * 12 + width_in;


  // get the approximate amount of caps that should fit in the width
  //  of the given distance
  var _y = tot_height_in <= 1 ? 1 : Math.floor(tot_height_in / (CAP_SIZE + CAP_GAP));
  var _x = tot_width_in <= 1 ? 1 : Math.floor(tot_width_in / (CAP_SIZE + CAP_GAP));

  console.log(_y + " = " + tot_height_in + "/" + CAP_SIZE);
  console.log(_x + " = " + tot_width_in + "/" + CAP_SIZE);

  returnLegendCapsBack();

  // Keep track how many caps are available maxiumum
  var count = 0;

  for (var i = 0; i < _y; i++) {

    var row = $('<div />').addClass('row');

    for (var j = 0; j < _x; j++) {

      if (j != _x || i % 2 == 0) {
        var cap = $('<div />').addClass('cap').addClass('ui-widget-content').addClass("empty");
        var cell = $('<div />').addClass('cell').attr('id', 'div' + i + '-' + j);
        count++;

        cap.appendTo(cell);
        cell.appendTo(row);
      }
    }

    row.appendTo(grid);
    row.css('width', (tot_width_in * 50));

  }

  console.log(count);

  var grid_height = parseFloat(49 * tot_height_in / CAP_SIZE) + 25;
  var grid_width = parseFloat(49 * tot_width_in / CAP_SIZE) + 25;

  grid.css("width", grid_width);
  grid.css("height", grid_height);

  $("#tot_avail").text(count);
  $("#tot_remaining").text(count);
};