/*
 * History
 *
 * (c)opyright 2008-2024 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  $(".natHistoryTable").livequery(function() {
    var $this = $(this);

    function updateRadio () {
      var $rev1Elem = $this.find("[name=rev1]:checked"),
          $rev2Elem = $this.find("[name=rev2]:checked"),
          rev1 = parseInt($rev1Elem.val(), 10),
          rev2 = parseInt($rev2Elem.val(), 10);

      //console.log("called updateRadio, rev1="+rev1+", rev2="+rev2);

      $this.find("tr").removeClass("foswikiSelected");
      $rev1Elem.parent().parent().addClass("foswikiSelected");
      $rev2Elem.parent().parent().addClass("foswikiSelected");

      $this.find(".natHistoryRadio").prop('disabled', true).each(function() {
        var $this = $(this),
            rev = $this.attr('name'),
            val = parseInt($this.val(), 10);

        if (val > 0) {
          if ((rev === 'rev2' && val > rev1) ||
              (rev === 'rev1' && val < rev2)) {
            $this.prop('disabled', false);
          }
        }
      });
    }

    // init gui
    updateRadio();
    $this.find("input[name=rev1]:first").prop('disabled', true).attr('value', '0');
    $this.find("input[name=rev2]:last").prop('disabled', true).attr('value', '0');
    $this.find(".natHistoryRadio").on("change", updateRadio);
    $this.find(".natHistoryNavi").on("click", function() {
      var $navBtn = $(this), 
          opts = $.extend({
            topic: foswiki.getPreference("WEB")+"/"+foswiki.getPreference("TOPIC"),
            name: "history",
            expand: "revtable",
            render: "on"
          }, $navBtn.data());

      if (!$navBtn.is(".natDisabledTopicAction")) {
        $.blockUI({message:""});

        $this.load(foswiki.getPreference("SCRIPTURL")+"/rest/RenderPlugin/template", 
          opts,
          function() {
            $.unblockUI();
          });
      }

      return false;
    });
  });
});
