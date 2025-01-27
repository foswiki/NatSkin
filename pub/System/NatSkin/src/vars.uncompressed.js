/*
 * Foswiki Vars: sets css vars locally 
 *
 * (c)opyright 2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";

(function($) {

  function _camelToDashes(str) {
    return str.replace(/([A-Z])/g, function($1){
      return "-"+$1.toLowerCase();
    });
  }

  function CSSVars(elem, opts) {
    var self = this;

    self.elem = elem;

    // gather options by merging global defaults, plugin defaults and element defaults
    self.opts = $.extend({}, $(self.elem).data(), opts);
    self.init();
  }

  CSSVars.prototype.init = function () {
    var self = this, key;

    for (var prop in self.opts) {
      if (prop) {
        key = "--" + _camelToDashes(prop);
        self.set(key, self.opts[prop]);
      }
    }
  };


  CSSVars.prototype.getComputedStyle = function() {
    var self = this;
    return window.getComputedStyle(self.elem);
  };

  CSSVars.prototype.get = function(prop) {
    var self = this;

    return self.getComputedStyle.getPropertyValue(prop);
  };

  CSSVars.prototype.set = function(key, val) {
    var self = this;

    console.log("setting css var",key," to ",val);
    return self.elem.style.setProperty(key, val);
  };

  // A plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn.cssVars = function (opts) {
    return this.each(function () {
      if (!$.data(this, "CSSVars")) {
        $.data(this, "CSSVars", new CSSVars(this, opts));
      }
    });
  };

  // Enable declarative widget instanziation
  $(function() {
    $(".foswikiCSSVars").livequery(function() {
      $(this).cssVars();
    });
  });

})(jQuery);
