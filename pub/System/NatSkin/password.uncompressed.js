// (c)opyright 2013 Michael Daum http://michaeldaumconsulting.com

(function($) {
  "use strict";

  function password (length, special) {
    var password = "", ran, i = 0;

    while (i < length) {
      ran = (Math.floor((Math.random() * 100)) % 94) + 33;

      if (!special) {
        if ((ran >=33) && (ran <=47)) { continue; }
        if ((ran >=58) && (ran <=64)) { continue; }
        if ((ran >=91) && (ran <=96)) { continue; }
        if ((ran >=123) && (ran <=126)) { continue; }
      }

      if (ran == 34 || ran == 39) {
        continue;
      }

      i++;
      password += String.fromCharCode(ran);
    }

    return password;
  }

  $(function() {
    var defaults = {
      length: 15,
      specials: true
    };
    $(".jqGeneratePassword").click(function() {
      var $this = $(this), 
          opts = $.extend({}, defaults, $this.data()),
          $passwordField = $(opts.target),
          $substitute = $("<span />");

      $passwordField.replaceWith($substitute).attr("type", "text").val(password(opts.length, opts.specials));
      $substitute.replaceWith($passwordField);

      return false;
    });
  });

})(jQuery);
