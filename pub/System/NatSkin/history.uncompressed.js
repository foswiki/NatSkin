// (c)opyright 2008-2015 Michael Daum http://michaeldaumconsulting.com
/* helper for oopshistory */
"use strict";
jQuery(function($) {

  $(".natHistoryTable:not(.natHistoryTableInited)").livequery(function() {
    var $this = $(this);

    $this.addClass("natHistoryTableInited");

    function updateRadio () {
      var $rev1Elem = $this.find("[name=rev1]:checked"),
          $rev2Elem = $this.find("[name=rev2]:checked"),
          rev1 = parseInt($rev1Elem.val(), 10),
          rev2 = parseInt($rev2Elem.val(), 10);

      //console.log("called updateRadio, rev1="+rev1+", rev2="+rev2);

      $this.find("tr").removeClass("selected");
      $rev1Elem.parent().parent().addClass("selected");
      $rev2Elem.parent().parent().addClass("selected");

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
    $this.find(".natHistoryRadio").change(updateRadio);

    $this.find(".natHistoryNavi").click(function() {
      var $navBtn = $(this), 
          opts = $.extend({
            topic: foswiki.getPreference("WEB")+"/"+foswiki.getPreference("TOPIC"),
            name: "history",
            expand: "revtable",
            render: "on"
          }, $navBtn.metadata());

      $.blockUI({message:"<h1>Loading ...</h1>"});

      $this.load(foswiki.getPreference("SCRIPTURL")+"/rest/RenderPlugin/template", 
        opts,
        function() {
          $.unblockUI();
        });
      return false;
    });

    $this.find(".natRestoreAction").click(function() {
      var $button = $(this), 
          rev = $button.data("rev"),
          $restoreForm = $("form[name='restore']");

      $restoreForm.find("input[name='rev']").val(rev);
      $restoreForm.submit();
      return false;
    });
  });


});
