// (c)opyright 2008-2010 Michael Daum http://michaeldaumconsulting.com
/* helper for oopshistory */
/* updates the radio buttons in a way to prevent illegal selections */

jQuery(function($) {
  function updateRadio () {

    var $historyTable = $(".natHistoryTable");
    var rev1 = parseInt($historyTable.find("input[checked][name=rev1]").val(), 10);
    var rev2 = parseInt($historyTable.find("input[checked][name=rev2]").val(), 10);

    $historyTable.find("input[type=radio]").attr('disabled', 'disabled').each(function() {
      var $this = $(this);
      var rev = $this.attr('name');
      var val = parseInt($this.val(), 10);
      if (val > 0) {
        if ((rev == 'rev2' && val > rev1) ||
            (rev == 'rev1' && val < rev2)) {
          $this.removeAttr('disabled');
        }
      }
    });
  }

  $(function() {
    if (!$.browser.mozilla || $.browser.version != '1.9.1') {
      // does not work on firefox-3.5 (portable)
      updateRadio();
      $(".natHistoryTable input[name='rev1']:first").attr('disabled','disabled').attr('value', '0');
      $(".natHistoryTable input[name='rev2']:last").attr('disabled','disabled').attr('value', '0');
      $(".natHistoryTable input").change(updateRadio);
    }
  });
});
