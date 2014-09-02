// (c)opyright 2006-2014 Michael Daum http://michaeldaumconsulting.com

(function($) {
"use strict";

  var emoas;
  $.wremo = {
    build: function(options) {
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
