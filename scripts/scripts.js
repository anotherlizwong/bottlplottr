function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}

$(document).ready(function () {

  $('#testform').submit(function (event) {
    generateGrid();
  });
});

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