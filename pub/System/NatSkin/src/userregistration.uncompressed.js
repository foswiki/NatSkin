/*
 * UserRegistration
 *
 * (c)opyright 2009-2024 Michael Daum http://michaeldaumconsulting.com
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

  var defaults = {
    minLength: 8,
    digits: true,
    lower: true,
    upper: true,
    special: true
  };

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
  $.validator.addMethod('loginName', function(value) {
    return !specials.test(value);
  }, "Invalid login name");

  $(function() {

    $('#Fwk1WikiName').wikiword({
      source: '#Fwk1FirstName, #Fwk1LastName',
      transliterate: true
    });

    $("#registrationForm").livequery(function() {
      var $this = $(this), opts = $.extend({}, defaults, $this.data()),
          messages;

      eval("messages="+$this.children("#messages").text());

      //console.log("opts=",opts);
      //console.log("messages=",messages);

      $this.validate({
        rules: {
          Fwk1FirstName: 'required',
          Fwk1LastName: 'required',
          Fwk1WikiName: {
            required: true,
            wikiword: true,
            remote: foswiki.getScriptUrlPath("rest", "RenderPlugin", "template", {
              name: "UserRegistrationView",
              expand: "checkWikiName",
              topic: foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),
              cachecontrol: 0
            })
          },
          Fwk1Email: {
            required: true,
            email: true
          },
          Fwk1LoginName: {
            required: true,
            minlength: 2,
            loginName: true,
            remote: foswiki.getScriptUrlPath("rest", "RenderPlugin", "template", {
              name: "UserRegistrationView",
              expand: "checkLoginName",
              topic: foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),
              cachecontrol: 0
            })
          },
          Fwk1Password: {
            required: true,
            pwcheck_digits: opts.digits,
            pwcheck_upper: opts.upper,
            pwcheck_lower: opts.lower,
            pwcheck_special: opts.special,
            minlength: opts.minLength
          },
          Fwk1Confirm: {
            required: true,
            equalTo: '#Fwk1Password'
          }
        },
        messages: messages
      });
    });
  });
})(jQuery);
