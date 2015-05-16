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
    $(".selectable").selectable({
      filter: ".cap"
    });

    return false;
  });

  //handle the events in every element. Only applies to elements which can be handle focus
  $(document).keydown(function(event) {
        if ( event.which == 100 || event.wich == 8 || event.which == 46 ) { //this is the keycode. 100 is the 'd' key. The delete key is difficult to bind.
          resetStyles($(".ui-selected"));
      }
    });

   // reset the styles to empty
   var resetStyles = function(elem) {
    var regEx = /cap[0-9]+/;
    $.each(elem, function (index, value) {
      var el = value;
      el.removeAttribute("style");
      var elClassName = el.className.match(regEx);
      el.className = el.className.replace(regEx, 'empty');
      el.className = el.className.replace('ui-selected','');
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

  $(".cap"+color.id).css('background-color', '#' + color.hex);

}

function deleteColorFromLegend(id) {

  // remove the caps from the board;

  delete legend[id.val()];

  console.log("removed id " + id + " from dictionary");

  $(".cap"+id.val()).css('background-color', '').removeClass("cap"+id.val()).addClass('empty');

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
    var color = new Color(name, hex, count, id);

    addColorToLegend(color);

    return false;
  });

  // when deleted, it must delete.
  // when save is done, repaint automatically.
  // make sure count is still valid for all parties included.


  newguy.find(".color_paint").click(function (event) {
    var id = newguy.find("[name=id]").val();
    var hex = legend[id].hex;

    var count = $(".ui-selected").length;

    // add the color of the current cap
    $(".ui-selected").css('background-color', '#' + hex);

    console.log(legend[0].count);
    // go throug the current caps and return their tokens
    $(".ui-selected").each(function (i, object) {

      var classToRemove;
      $(object.classList).each(function(j, o){
        if (o.indexOf("cap") > -1 && o.length > 3) {
          classToRemove = o;
          legend[o.substring(3)].count = legend[o.substring(3)].count + 1;
        }
      });

      $(object).removeClass(classToRemove);

      //// MAKING AN ASSUMPTION THAT THE STYLE IS FIRST. Poor form, i dont' care
      //var capId = object.classList[0].split('-')[1];
      //if(capId != undefined) {
      //  legend[capId].count = legend[capId] + 1;
      //}
    });


    // assign this square to the selected cap
    $(".ui-selected").addClass("cap" + id);

    //remove the current selections
    $(".ui-selected").removeClass("empty").removeClass("ui-selected");


    // update the pointers;
    legend[id].count = legend[id].count - count;
    console.log(legend[0].count);
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

function generateGridInternal(height, height_in, width, width_in) {
  var tot_height_in = height * 12 + height_in;
  var tot_width_in = width * 12 + width_in;
  console.log(tot_height_in + "inches");
  console.log(tot_width_in + "inches");

  var _y = Math.floor((tot_height_in) / CAP_PERIMITER);
  var _x = Math.floor((tot_width_in - CAP_GAP) / CAP_PERIMITER);

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

  console.log("There are " + count + " free cap spots");
  $("#tot_avail").text(count);
  $("#tot_remaining").text(count);
};

var convertInToPx = function (inches) {
  var width = $('.cap').width();
  return parseFloat(width*inches/CAP_SIZE);
};


