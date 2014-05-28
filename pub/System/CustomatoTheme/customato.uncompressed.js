// (c)opyright 2014 Michael Daum http://michaeldaumconsulting.com
jQuery(function($) {
  "use strict";

  $(".natPanelToggle a").click(function() {
    var $toggle = $(this);
    $toggle.toggleClass("active");
    $(".natTopPanel").slideToggle(200, "shagga");
    return false;
  });
});

