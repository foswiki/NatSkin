/*
 * Login
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  var $loginForm = $(".natLoginForm");
  $loginForm.find("input").on("keydown", function(e) {
    if (e.keyCode === 13) {
      $loginForm.trigger("submit");
      return false;
    }
  });
  if (foswiki.getPreference("NatSkin.loginFailed")) {
    $(".natBody").addClass("natLoginFailed");
    $(".natLogin .foswikiFormSteps").effect("shake", {times:3, distance:10}, 50);
  }
});
