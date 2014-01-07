// (c)opyright 2008-2014 Michael Daum http://michaeldaumconsulting.com
/* helper for oopshistory */
/* updates the radio buttons in a way to prevent illegal selections */

jQuery(function($) {
  "use strict";

  $(".natHistoryTable").livequery(function() {
    var $this = $(this);

    function updateRadio () {
      var $rev1Elem = $this.find("[name=rev1]:checked"),
          $rev2Elem = $this.find("[name=rev2]:checked"),
          rev1 = parseInt($rev1Elem.val(), 10),
          rev2 = parseInt($rev2Elem.val(), 10);

      //console.log("called updateRadio, rev1="+rev1+", rev2="+rev2);

      $this.find("tr").removeClass("selected");
      $rev1Elem.parent().parent().addClass("selected");
      $rev2Elem.parent().parent().addClass("selected");

      $this.find("input[type=radio]").attr('disabled', 'disabled').each(function() {
        var $this = $(this),
            rev = $this.attr('name'),
            val = parseInt($this.val(), 10);

        if (val > 0) {
          if ((rev == 'rev2' && val > rev1) ||
              (rev == 'rev1' && val < rev2)) {
            $this.removeAttr('disabled');
          }
        }
      });
    }

    // init gui
    updateRadio();
    $this.find("input[name=rev1]:first").attr('disabled','disabled').attr('value', '0');
    $this.find("input[name=rev2]:last").attr('disabled','disabled').attr('value', '0');
    $this.find("input[type=radio]").change(updateRadio);

    $this.find(".natHistoryNavi").click(function() {
      var $navBtn = $(this), 
          opts = $.extend({
            topic: foswiki.getPreference("WEB")+"/"+foswiki.getPreference("TOPIC"),
            name: "history",
            expand: "revtable",
            render: "on"
          }, $navBtn.metadata()),
          $container = $this.parent().parent();
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
