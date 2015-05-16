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
    clearInput();
  });

  $('#clear_grid').click(function (event) {
    clearGrid();
  });

  $('#add_legend').click(function (event) {
    addColor();
  });

  $('#save_legend').click(function (event) {

  });

  $(document).on("click", ".color_delete", function(event){
    $(this).closest('div').remove();
  });

  $(document).on("click", ".color_add", function(event){
    $(this).closest('div').remove();
  });


});

function addColor() {
  var row =  $('\
    <div> \
    <label for="name">Name</label><input name="name" type="text" required> \
    <label for="hex">Hex</label><input name="hex" type="text" required> \
    <label for="count">Count</label> <input name="count" type="number" required>\
    <input type="hidden"/>\
    <button class="color_delete" type="button">Delete</button> \
    </div> ');

  row.find("[name=hex]").spectrum();

  $('#legend').append(row);
}

// GRID FUNCTIONS

function clearGrid() {
  $("#grid").empty();
}

function clearInput() {
  $('#testform')[0].reset();
}

function generateGrid() {
  var _y = parseInt($('#x').val());
  var _x = parseInt($('#x').val());

  for (var i = 0; i < _y; i++) {

    var row = $('<div />').addClass('row');

    for (var j = 0; j < _x; j++) {
      var cap = $('<div />').addClass('cap');
      var cell = $('<div />').addClass('cell').attr('id', 'div' + i + '-' + j);

      cap.appendTo(cell);
      cell.appendTo(row);
    }

    row.appendTo($("#grid"));
  }
}