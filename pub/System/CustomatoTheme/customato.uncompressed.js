// (c)opyright 2014 Michael Daum http://michaeldaumconsulting.com
jQuery(function($) {
  "use strict";

  $.extend($.easing, {
    'easeInOut':  function (x, t, b, c, d) {
      if (( t /= d / 2) < 1) {
          return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  });


  $(".natPanelToggle").click(function() {
    var $toggle = $(this);
    $toggle.toggleClass("active");
    $(".natTopPanel").slideToggle(200, "easeInOut");
    return false;
  });
});

