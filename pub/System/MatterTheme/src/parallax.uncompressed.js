/*
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2018-2024 Foswiki Contributors. Foswiki Contributors
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

"use strict";
(function($) {

  var defaults = {
    distance: 1,
    direction: "up"
  };

  function Parallax(elem, opts) {
    var self = this;

    self.elem = $(elem);

    // gather options by merging global defaults, plugin defaults and element defaults
    self.opts = $.extend({}, defaults, self.elem.data(), opts);
    self.init();
  }

  Parallax.prototype.init = function () {
    var self = this;

    $(window).on("scroll", function() {
      self.onScroll();
    });
  };

  Parallax.prototype.onScroll = function() {
    var self = this, 
	offset = $(window).scrollTop() / (self.opts.distance || 1) * (self.opts.direction === 'up' ? -1: 1);

    //console.log("offset=",offset);
    self.elem.css("transform", "translateY("+offset+"px)");
  };


  // make it a jquery plugin
  $.fn.natParallax = function (opts) {
    return this.each(function () {
      if (!$.data(this, "parallax")) {
        $.data(this, "parallax", new Parallax(this, opts));
      }
    });
  };

  // on dom ready
  $(function() {
    $(".natParallax").livequery(function() {

    });
  });

  $(function() {
    $(".natParallax").livequery(function() {
      $(this).natParallax();
    });
  });

})(jQuery);
