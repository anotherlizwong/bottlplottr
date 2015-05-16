
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
  var grid = $("#grid");

  var tot_height_in = height * 12 + height_in;
  var tot_width_in = width * 12 + width_in;

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
        cap.appendTo(cell);
        cell.appendTo(row);
        count++;
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