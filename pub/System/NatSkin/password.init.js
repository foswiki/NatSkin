"use strict";
jQuery(function($) {
  var generator,
      defaults = {
         length: 15,
         capitals: true,
         numbers: true,
         specialChars: true
      };

  function password (opts) {
    var regex = opts.regex;

    generator = generator || new Jen(opts.specialChars);

    if (typeof(regex) === 'undefined') {
      regex = "";

      if (!opts.capitals) {
        regex += 'A-Z';
      }

      if (!opts.numbers) {
        regex += '\\d';
      }

      if (regex) {
        regex = new RegExp("[^"+regex+"]");
      }
    }

    return generator.password(opts.length, opts.length, regex);
  }

  $(document).on("click", ".jqGeneratePassword", function(ev) {
    var $this = $(this), 
        opts = $.extend({}, defaults, $this.data()),
        $passwordField = $(opts.target),
        $substitute = $("<span />");

    // detatch password field temporarily, make it a text input, add the password and insert it back to the dom
    $passwordField.replaceWith($substitute).attr("type", "text").val(password(opts));

    $substitute.replaceWith($passwordField);

    ev.preventDefault();
    return false;
  });
});
