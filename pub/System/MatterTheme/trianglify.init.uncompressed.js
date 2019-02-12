"use strict";
jQuery(function($) {

  // triangify
  $(".jqTrianglify:not(.jqTrianglifyInited)").livequery(function() {
    var $this = $(this), 
        opts = $this.data(),
        pattern;

    $this.addClass("jqTrianglifyInited");

    if (typeof(opts.cellSize) !== 'undefined') {
      opts.cell_size = opts.cellSize;
      delete opts.cellSize;
      if (opts.cell_size < 5) {
        opts.cell_size = 5;
      }
    }

    if (typeof(opts.palette) !== 'undefined') {
      opts.x_colors = opts.palette;
      opts.y_colors = opts.palette;
      delete opts.palette;
    } 

    if (typeof(opts.xColors) !== 'undefined') {
      opts.x_colors = opts.xColors;
      delete opts.xColors;
    }

    if (typeof(opts.yColors) !== 'undefined') {
      opts.y_colors = opts.yColors;
      delete opts.yColors;
    }

    if (typeof(opts.width) !== 'undefined') {
      $this.width(opts.width);
    } else {
      opts.width = $this.width();
    }

    if (typeof(opts.height) !== 'undefined') {
      $this.height(opts.height);
    } else {
      opts.height = $this.height();
    }

    opts.seed = $this.text() + (opts.seed || '');

    //console.log("opts=",opts);

    pattern = Trianglify(opts);

    $this.append(pattern.canvas());

    $(window).on("resize", function() {
      pattern.opts.width = $this.width();
      $this.append(pattern.canvas());
    });
  });

  // generate options of palette
  $(".jqTrianglifyPaletteSelector").livequery(function() {
    var $this = $(this), 
        opts = $.extend({selected:''}, $this.data()),
        names = Object.getOwnPropertyNames(Trianglify.colorbrewer), /*.sort(),*/
        template = $this.children().first().remove();

    $.each(names, function(i, key) {
      var item = template.clone(true),
          colors = Trianglify.colorbrewer[key],
          swatch = item.find(".swatch").text(""),
          input = item.find("input");

      $.each(colors, function(i, color) {
        swatch.append("<span style='background-color:"+color+"' >&nbsp;</span>");
      });

      input.prop("checked", opts.selected == key).val(key);

      input.on("change", function() {
        $this.find(".selected").removeClass("selected");
        if (input.prop("checked")) {
          input.parent().find(".swatch").addClass("selected");
        }
      });

      if (input.prop("checked")) {
        swatch.addClass("selected");
      }

      item.appendTo($this);
    });
  });


});
