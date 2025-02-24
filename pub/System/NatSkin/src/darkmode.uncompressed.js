/*
 * DarkMode
 *
 * (c)opyright 2021-2025 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";

(function($) {

  var defaults = {
    cookieTimeoutDays: 30,
    cookieName: "FOSWIKIDARKMODE",
    darkModeButton: ".natDarkModeButton"
  };

  function DarkMode(opts) {
    var self = this;

    self.opts = $.extend({}, defaults, opts);
    self.isActive = false;
    self.init();
  };

  // get initial setting, add event listeners
  DarkMode.prototype.init = function() {
    var self = this;

    self.setMode(self.getPreference());
    $(document).on("click", self.opts.darkModeButton, function() {
      self.toggle()
      return false;
    });
  }

  DarkMode.prototype.getPreference = function() {
    var self = this, cookie;

    if ($("html").data("theme") === 'none') {
      return "none";
    }

    cookie = $.cookie(self.opts.cookieName);
    //console.log("... cookie=",cookie);

    switch (cookie) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return self.getSystemPreference();
    }
  };

  DarkMode.prototype.getSystemPreference = function() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  DarkMode.prototype.toggle = function() {
    var self = this;
    self.setMode(!self.isActive);

    // has been toggled manually
    $.cookie(self.opts.cookieName, String(self.isActive), {
      path: "/",
      expires: self.opts.cookieTimeoutDays,
      secure: true,
      samesite: "strict"
    });

  };

  DarkMode.prototype.setMode = function(mode) {
    var self = this;

    //console.log("called setMode(",mode,")");
    if (mode === "none") {
      //console.log("... not setting mode");
      return;
    }

    self.isActive = mode;

    // set the data attribute to trigger CSS changes
    $("html").attr({
      "data-theme": mode ? "dark" : "light"
    });

    // toggle the button state for screen readers
    if (mode !== 'false') {
      $(self.opts.darkModeButton).addClass("natDarkModeActive");
      //console.log("... enabling darkMode");
    } else {
      $(self.opts.darkModeButton).removeClass("natDarkModeActive");
      //console.log("... disabling darkMode");
    }
  };

  //console.log("init'ing darkmode feature");
  window.darkMode = new DarkMode();

})(jQuery);
