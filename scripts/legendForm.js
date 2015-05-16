var legendEntrySubmit = function (event) {

  triggerLegendFormFields($(this), true);

  var name = $(this).find("[name=name]").val();
  var count = parseInt($(this).find("[name=number]").val());
  var hex = $(this).find("[name=hex]").spectrum("get").toHex();
  var id = $(this).find("[name=id]").val();
  var color = new Color(name, hex, count, id);

  addColorToLegend(color);

  return false;
};

function triggerLegendFormFields(form, hide) {
  if (hide) {
    form.find(".save").addClass("hidden");
    form.find(".edit").removeClass("hidden");
    form.find("[name=name]").attr('readonly', true);
    form.find("[name=number]").attr('readonly', true);
    form.find("[name=hex]").spectrum({disabled: true});
  } else {
    form.find(".save").removeClass("hidden");
    form.find(".edit").addClass("hidden");
    form.find("[name=name]").attr('readonly', false);
    form.find("[name=number]").attr('readonly', false);
    form.find("[name=hex]").attr('disabled', false);
    form.find("[name=hex]").spectrum({disabled: false});
  }
}

var legendEntryEdit = function (event) {
  var form = $(this).closest("form");
  triggerLegendFormFields(form, false);
};

var legendEntryPaint = function (event) {

  var form = $(this).closest("form");

  var id = form.find("[name=id]").val();

  // if we try to paint with a legend entry that isn't ready, don't bother
  if (!legend[id]) return;

  var selected = $(".ui-selected");

  var hex = legend[id].hex;
  var count = selected.length;

  // add the color of the current cap
  selected.css('background-color', '#' + hex);

  // go throug the current caps and return their tokens
  selected.each(function (i, object) {

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
  selected.addClass("cap" + id);

  //remove the current selections
  selected.removeClass("empty").removeClass("ui-selected");

  // update the pointers;
  legend[id].count = legend[id].count - count;
  $('.overall-total').trigger('legendUpdated', count);
  $('#form' + id).trigger("legendUpdated", id);
  $(document).trigger("logEvent");

};

function addLegendEntry() {
  var colorId = getNextColorSeqId();
  var legendEntry = $('.color_input').clone();

  legendEntry.removeClass("hidden");
  legendEntry.removeClass("color_input");
  legendEntry.attr('id', 'form' + colorId);
  legendEntry.find(".edit").addClass("hidden");
  legendEntry.find("[name=hex]").spectrum();
  legendEntry.find("[name=id]").val(colorId);
  legendEntry.appendTo($('#legend'));

  legendEntry.bind("legendUpdated", function (e, myName, myValue) {
    $(this).find("[name=number]").val(legend[myName].count)
  });

  legendEntry.submit(legendEntrySubmit);
  legendEntry.find(".edit").click(legendEntryEdit);
  legendEntry.find(".color_paint").click(legendEntryPaint);

}