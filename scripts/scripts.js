'use strict';

function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}

function color(name, hex, count) {
  this.color = color;
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
});

function addColor() {
  var row = '<tr><input type="text" id="name"></tr> \
   <tr><input type="number" id="hex"></tr> \
   <tr><input type="number" id="count"</tr>';
  $('#colorTable > tbody:last').append('<tr>name</tr><tr>hex</tr><tr>count</tr>');
}

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