/*
 * QM-History
 *
 * (c)opyright 2025 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  $(".natQMHistoryTable").livequery(function() {
    var $this = $(this);

    $this.find(".natHistoryNavi").on("click", function() {
      var $navBtn = $(this), 
          opts = $.extend({
            topic: foswiki.getPreference("WEB")+"/"+foswiki.getPreference("TOPIC"),
            name: "qmhistory",
            expand: "qmtable",
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

