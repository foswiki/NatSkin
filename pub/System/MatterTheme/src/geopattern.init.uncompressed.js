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

/* global GeoPattern */

"use strict";
jQuery(function($) {
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }

  function rgb2hex(rgb) {
    if (rgb.search("rgb") === -1) {
      return rgb;
    } else {
      rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
    }
  }
  $(".jqGeoPattern").livequery(function() {
      var $this = $(this),
          pattern,
          text,
          opts = $.extend({
            autoBaseColor: false,
            seed:'', 
            text:''
          }, $this.data());
      if (!opts.text) {
        opts.text = $this.text().replace(/^\s+|\s+$/g, '');
      }

      text = opts.seed + opts.text;

      if (opts.autoBaseColor) {
        opts.baseColor = rgb2hex($this.css("background-color"));
      }

      //console.log("opts=",opts);
      //console.log("text=",text);

      pattern = GeoPattern.generate(text, opts);
      $this.data("GeoPattern", pattern).css('background-image', pattern.toDataUrl());
   });
});
