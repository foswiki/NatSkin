// (c)opyright 2014 Michael Daum http://michaeldaumconsulting.com
jQuery(function($) {
  "use strict";

  $(".natPanelToggle").click(function() {
    var $toggle = $(this);
    $toggle.toggleClass("active");
    $(".natTopPanel").slideToggle(200, "shagga");
    return false;
  });
});

