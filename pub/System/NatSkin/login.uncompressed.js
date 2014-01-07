// (c)opyright 2006-2014 Michael Daum http://michaeldaumconsulting.com

jQuery(function($) {
  "use strict";

  var $loginForm = $("#LoginForm");
  $loginForm.validate();
  $loginForm.find("input").keydown(function(e) {
    if (e.keyCode == '13') {
      $loginForm.submit();
      return false;
    }
  });
  if (foswiki.getPreference("NatSkin.loginFailed")) {
    $(".natLogin").effect("shake", {times:3, distance:10}, 50);
  }
});
