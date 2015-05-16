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
}

$(document).ready(function () {

  $('#testform').submit(function (event) {
    clearGrid();
    generateGrid();
    // clearInput();
    $("#grid").selectable({
      filter: ".cap"
    });
    return false;
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
    var id = $(this).closest('form').find('[name=id]');
    $(this).closest('form').remove();
    deleteColorFromLegend(id);
  });

  $(document).on("click", ".color_delete", function (event) {
    $(this).closest('form').remove();
  });

  addColor();

  generateGridInternal(1,1,1,1);

  addColorToLegend(new Color("test", "5e3a3a", 10, 0));
  addColorToLegend(new Color("test2", "111111", 10, 1));

  $("#grid").selectable({
    filter: ".cap"
  });
});

var legend = {}

function addColorToLegend(color) {

  legend[color.id] = color;

  console.log("saved " + color.id + " to dictionary");
}

function deleteColorFromLegend(id) {

  delete legend[id.val()];

  console.log("removed id " + id + " from dictionary");

}

function addColor() {
  var newguy = $('.color_input').clone();
  newguy.removeClass("hidden");
  newguy.removeClass("color_input");
  newguy.find("[name=hex]").spectrum();
  newguy.find(".color_edit").addClass("hidden");
  newguy.find("[name=id]").val(COLOR_ID_SEQ++);
  newguy.appendTo($('#legend'));

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
    var color = new Color(name,hex,count, id);

    addColorToLegend(color);

    return false;
  });

  // when deleted, it must delete.
  // when over
  // when save is done, repaint automatically.
  // make sure count is still valid for all parties included.


  newguy.find(".color_paint").click(function(event){
    var id = newguy.find("[name=id]").val();
    var hex = legend[id].hex;

    var count = $(".ui-selected").length;

    // add the color of the current cap
    $(".ui-selected").css('background-color', '#'+hex);

    // assign this square to the selected cap
    $(".ui-selected").addClass("cap" + id);

    // remove the current selections
    $(".ui-selected").removeClass("empty").removeClass("ui-selected");

    // update the pointers;
    legend[id].count = legend[id].count - count;

  });

  newguy.find(".color_edit").click(function(event) {
    newguy.find(".color_save").removeClass("hidden");
    newguy.find(".color_edit").addClass("hidden");
    newguy.find("[name=name]").attr('readonly', false).removeClass("foobar");
    newguy.find("[name=hex]").attr('disabled', false);
    newguy.find("[name=hex]").spectrum({disabled: false});
    newguy.find("[name=number]").attr('readonly', false).removeClass("foobar");

  });
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
  height = height? height:0;
  height_in = height_in? height_in:0;
  width = width? width:0;
  width_in = width_in? width_in:0;


  generateGridInternal(height, height_in, width, width_in);

}

function generateGridInternal(height, height_in, width, width_in) {
  //var height = parseInt($('#y_ft').val()); // height
  //var height_in = parseInt($('#y_in').val()); // height
  //var width = parseInt($('#x_ft').val()); // width
  //var width_in = parseInt($('#x_in').val()); // width

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
      var cap = $('<div />').addClass('cap').addClass('ui-widget-content').addClass("empty");
      var cell = $('<div />').addClass('cell').attr('id', 'div' + i + '-' + j);

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