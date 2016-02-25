// (c)opyright 2006-2015 Michael Daum http://michaeldaumconsulting.com
"use strict";
jQuery(function($) {

  var $loginForm = $("#LoginForm");
  $loginForm.validate();
  $loginForm.find("input").keydown(function(e) {
    if (e.keyCode === '13') {
      $loginForm.submit();
      return false;
    }
  });
  if (foswiki.getPreference("NatSkin.loginFailed")) {
    $(".natLogin .foswikiFormSteps").effect("shake", {times:3, distance:10}, 50);
  }
});
