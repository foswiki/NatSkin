/*
 * ChangePassword
 *
 * (c)opyright 2008-2024 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";

(function($) {
  var digits = /\d/,
    specials = new RegExp('[~!@#$%^&*_+=?><,;:.\"§\/{}()]'),
    upper = new RegExp('['+foswiki.RE.upper+']'),
    lower = new RegExp('['+foswiki.RE.lower+']');

  $.validator.addMethod('pwcheck_digits', function(value) {
    return digits.test(value);
  });
  $.validator.addMethod('pwcheck_lower', function(value) {
    return lower.test(value);
  });
  $.validator.addMethod('pwcheck_upper', function(value) {
    return upper.test(value);
  });
  $.validator.addMethod('pwcheck_special', function(value) {
    return specials.test(value);
  });

  var defaults = {
    minLength: 8,
    digits: true,
    lower: true,
    upper: true,
    special: true
  };

  $('#changePasswordForm').livequery(function() {
    var $this = $(this), opts = $.extend({}, defaults, $this.data()),
        messages;

    eval("messages="+$this.children("#messages").text());

    $this.validate({
      rules: {
        username: {
          required: true
        },
        oldpassword: {
          required: true
        },
        password: {
          required: true,
          pwcheck_digits: opts.digits,
          pwcheck_upper: opts.upper,
          pwcheck_lower: opts.lower,
          pwcheck_special: opts.special,
          minlength: opts.minLength
        },
        passwordA: {
          required: true,
          equalTo: '#password'
        }
      },
      messages: messages
    });
  });
})(jQuery);
