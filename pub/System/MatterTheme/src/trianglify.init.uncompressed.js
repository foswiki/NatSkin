/*
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2018-2023 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.

*/

/* global trianglify */

"use strict";
jQuery(function($) {

  // triangify
  $(".jqTrianglify").livequery(function() {
    var $this = $(this), 
        opts = $this.data(),
        pattern;

    if (typeof(opts.cellSize) !== 'undefined') {
      if (opts.cellSize < 5) {
        opts.cellSize = 5;
      }
    }

    if (typeof(opts.palette) !== 'undefined') {
      opts.xColors = opts.palette;
      opts.yColors = opts.palette;
      delete opts.palette;
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

    pattern = trianglify(opts);

    $this.append(pattern.toCanvas());

    $(window).on("resize", function() {
      pattern.opts.width = $this.width();
      $this.append(pattern.toCanvas());
    });
  });

  // generate options of palette
  $(".jqTrianglifyPaletteSelector").livequery(function() {
    var $this = $(this), 
        opts = $.extend({selected:''}, $this.data()),
        names = Object.getOwnPropertyNames(trianglify.utils.colorbrewer), /*.sort(),*/
        template = $this.children().first().remove();

    $.each(names, function(i, key) {
      var item = template.clone(true),
          colors = trianglify.utils.colorbrewer[key],
          swatch = item.find(".swatch").text(""),
          input = item.find("input");

      $.each(colors, function(i, color) {
        swatch.append("<span style='background-color:"+color+"' >&nbsp;</span>");
      });

      input.prop("checked", opts.selected === key).val(key);

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
