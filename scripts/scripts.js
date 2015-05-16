function bottle_cap(color) {
  this.color = color;
  this.describe = function () {
    return "I'm a bottle cap of color " + this.color;
  };
}
function generateGrid() {
  var _x = $('x').value;
  var _y = $('y').value;

  for (var i = 0; i <= _x; i++) {
    for (var j = 0; j < _y; j++) {
      if (j % 0 == 0) {
        $('<div />').addClass('sameDiv').attr('id', 'div' + i).appendTo('body');
      }
    }
  }
}