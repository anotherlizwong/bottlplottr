'use strict';

function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}

var COLOR_ID_SEQ = 0;

function Color(name, hex, count, id) {
  this.name = name;
  this.hex = hex;
  this.count = count;
  this.id = id;

  this.increment = function () {
    this.count = this.count + 1;
  };

  this.decrement = function () {
    this.count = this.count - 1;
  }

  this.toString = function () {
    return "id[" + id + "], name[" + name + "], hex[" + hex + "], count[" + count + "]";
  }
}

$(document).ready(function () {

  $(document).bind("logEvent", function (e, adjustment, myValue) {
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

  $('#testform').submit(function (event) {
    clearGrid();
    generateGrid();
    // clearInput();
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


  $('#clear_grid').click(function (event) {
    clearGrid();
  });

  $("#myDiv").on("remove", function (event) {
    alert("Element was removed");
  })

  $('#add_legend').click(function (event) {
    addColor();
  });

  $('#save_legend').click(function (event) {

  });

  $(document).on("click", ".color_delete", function (event) {
    var id = $(this).closest('form').find('[name=id]');
    $(this).closest('form').remove();
    deleteColorFromLegend(id);
  });

  addColor();

  generateGridInternal(1, 1, 1, 1);

  //addColorToLegend(new Color("test", "5e3a3a", 10, 0));
  //addColorToLegend(new Color("test2", "111111", 10, 1));

  $(".selectable").selectable({
    filter: ".cap"
  });
});

var legend = {}

function addColorToLegend(color) {

  legend[color.id] = color;

  console.log("saved " + color.id + " to dictionary");

  $(".cap" + color.id).css('background-color', '#' + color.hex);

}

function deleteColorFromLegend(id) {

  // remove the caps from the board;

  $('.overall-total').trigger('legendUpdated', -legend[id.val()].count);

  delete legend[id.val()];

  console.log("removed id " + id + " from dictionary");

  $(".cap" + id.val()).css('background-color', '').removeClass("cap" + id.val()).addClass('empty');


}


function addColor() {
  var colorId = COLOR_ID_SEQ++;
  var newguy = $('.color_input').clone();
  newguy.removeClass("hidden");
  newguy.removeClass("color_input");
  newguy.attr('id', 'form' + colorId);
  newguy.find("[name=hex]").spectrum();
  newguy.find(".color_edit").addClass("hidden");
  newguy.find("[name=id]").val(colorId);
  newguy.appendTo($('#legend'));

  newguy.bind("legendUpdated", function (e, myName, myValue) {
    $(this).find("[name=number]").val(legend[myName].count)
  });

  newguy.submit(function (event) {
    newguy.find(".color_save").addClass("hidden");
    newguy.find(".color_edit").removeClass("hidden");
    newguy.find("[name=name]").attr('readonly', true);
    newguy.find("[name=number]").attr('readonly', true);
    newguy.find("[name=hex]").spectrum({disabled: true});

    var name = newguy.find("[name=name]").val();
    var count = parseInt(newguy.find("[name=number]").val());
    var hex = newguy.find("[name=hex]").spectrum("get").toHex();
    var id = newguy.find("[name=id]").val();
    var color = new Color(name, hex, count, id);

    addColorToLegend(color);

    return false;
  });

  newguy.find(".color_paint").click(function (event) {

    var id = newguy.find("[name=id]").val();

    if(!legend[id]) return;

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

  newguy.find(".color_edit").click(function (event) {
    newguy.find(".color_save").removeClass("hidden");
    newguy.find(".color_edit").addClass("hidden");
    newguy.find("[name=name]").attr('readonly', false);
    newguy.find("[name=hex]").attr('disabled', false);
    newguy.find("[name=hex]").spectrum({disabled: false});
    newguy.find("[name=number]").attr('readonly', false);

  });
}

// GRID FUNCTIONS

function clearGrid() {
  $("#grid").empty();
}

function clearInput() {
  $('#testform')[0].reset();
}

var CAP_PERIMITER = 1.38;
var CAP_SIZE = 1.15;
var CAP_GAP = 0.23;

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

function generateGridInternal(height, height_in, width, width_in) {
  var tot_height_in = height * 12 + height_in;
  var tot_width_in = width * 12 + width_in;
  console.log(tot_height_in + "inches");
  console.log(tot_width_in + "inches");

  var _y = Math.floor((tot_height_in) / CAP_PERIMITER);
  var _x = Math.floor((tot_width_in - CAP_GAP) / CAP_PERIMITER);

  returnLegendCapsBack();

  var count = 0;
  var width = 0;
  var height = 0;
  for (var i = 0; i <= _y; i++) {

    var row = $('<div />').addClass('row');

    for (var j = 0; j <= _x; j++) {
      if (j != _x || i % 2 == 0) {
        var cap = $('<div />').addClass('cap').addClass('ui-widget-content').addClass("empty");
        var cell = $('<div />').addClass('cell').attr('id', 'div' + i + '-' + j);
        count++;

        cap.appendTo(cell);
        cell.appendTo(row);
      }
    }

    row.appendTo($("#grid"));
  }
  height = convertInToPx(tot_height_in);
  width = convertInToPx(tot_width_in);

  $("#grid").css("width", width);
  $("#grid").css("height", height);

  $("#tot_avail").text(count);
  $("#tot_remaining").text(count);
};

var convertInToPx = function (inches) {
  var width = $('.cap').width();
  return parseFloat(width*inches/CAP_SIZE);
};


