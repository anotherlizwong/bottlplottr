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
  this.increment = function() {
    this.count = this.count + 1;
  };

  this.decrement = function() {
    this.count = this.count - 1;
  }
}

$(document).ready(function () {

  $('#testform').submit(function (event) {
    generateGrid();
  });

  $('#clear_grid').click(function(event) {

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

function generateGrid() {
  var _x = parseInt($('#x').val());
  var _y = parseInt($('#x').val());

  for (var i = 0; i <= _x; i++) {

    var row = $('<div />').addClass('row');

    for (var j = 0; j < _y; j++) {
      $('<div />').addClass('cell').attr('id', 'div' + i + '.' + j).appendTo(row);
    }

    row.appendTo($("#grid"));
  }
}