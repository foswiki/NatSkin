/*
 * Email Obfuscator
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
(function($) {

  var emoas;
  $.wremo = {
    build: function() {
      return this.each(function() {
        $(this).empty();
        var id = $(this).attr('id'),
            ems = [], i, txt, href;

        for (i = 0; i < emoas[id][1].length; i++) {
          ems.push(emoas[id][1][i][1]+'@'+emoas[id][1][i][0]+emoas[id][1][i][2]);
        }
        txt = emoas[id][0] || ems.join(', ');
        href = 'ma'+'il'+'to'+':'+ems.join(', ');
        $("<a></a>").attr('href', href).append(txt).appendTo(this);
      });
    }
  };
  $.fn.wremo = $.wremo.build;

  $(function() {
    $(".wremo").wremo();
  });

})(jQuery);
