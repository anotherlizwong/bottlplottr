'use strict';

function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}

function color(name, hex, count) {
  this.name = name;
  this.hex = hex;
  this.count = count;
  this.increment = function () {
    this.count = this.count + 1;
  };

  this.decrement = function () {
    this.count = this.count - 1;
  }
}

$(document).ready(function () {

  $('#testform').submit(function (event) {
    clearGrid();
    generateGrid();
    // clearInput();
    $("#grid").selectable({
      filter: ".cap"
    });
  });

  $('#clear_grid').click(function (event) {
    clearGrid();
  });

  $('#add_legend').click(function (event) {
    addColor();
  });

  $('#save_legend').click(function (event) {

  });

  $(document).on("click", ".color_delete", function (event) {
    $(this).closest('div').remove();
  });

  $(document).on("click", ".color_add", function (event) {
    $(this).closest('div').remove();
  });

  addColor();

});

function addColor() {
  var newguy = $('.color_input').clone();
  newguy.removeClass("hidden");
  newguy.removeClass("color_input");
  newguy.find("[name=hex]").spectrum();
  newguy.appendTo($('#legend'));
}

// GRID FUNCTIONS

function clearGrid() {
  $("#grid").empty();
}

function clearInput() {
  $('#testform')[0].reset();
}

var CAP_PERIMITER = 1.4;

function generateGrid() {
  var height = parseInt($('#y_ft').val()); // height
  var height_in = parseInt($('#y_in').val()); // height
  var width = parseInt($('#x_ft').val()); // width
  var width_in = parseInt($('#x_in').val()); // width

  console.log(height * 12 + height_in + "inches");
  console.log(width  * 12 + width_in + "inches");

  var _y = Math.round((height*12 + height_in)/CAP_PERIMITER);
  var _x = Math.round((width*12 + width_in)/CAP_PERIMITER);

  var count = 0;
  var width = 0;
  var height = 0;
  for (var i = 0; i < _y; i++) {

    var row = $('<div />').addClass('row');

    for (var j = 0; j < _x; j++) {
      var cap = $('<div />').addClass('cap').addClass('ui-widget-content');
      var cell = $('<div />').addClass('cell').addClass("empty").attr('id', 'div' + i + '-' + j);

      count++;

      cap.appendTo(cell);
      cell.appendTo(row);
      if(i ==0) {
        width += 52.5;
      }
    }

    height += 50;

    row.appendTo($("#grid"));
  }

  $("#grid").css("width", width);
  $("#grid").css("height", height);

  console.log("There are " + count + " free cap spots");
}