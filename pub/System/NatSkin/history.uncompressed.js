// (c)opyright 2008-2010 Michael Daum http://michaeldaumconsulting.com
/* helper for oopshistory */
/* updates the radio buttons in a way to prevent illegal selections */
(function($) {
function updateRadio () {
  var vals = [];
  $(".natHistoryTable input[checked]").each(function () {
    vals[$(this).attr('name')] = parseInt($(this).val(), 10);
  });
  $(".natHistoryTable input[type=radio]").attr('disabled', 'disabled').each(function() {
    var rev = $(this).attr('name');
    var val = parseInt($(this).val(), 10);
    if (val > 0) {
      if ((rev == 'rev2' && val > vals['rev1']) ||
          (rev == 'rev1' && val < vals['rev2'])) {
        $(this).removeAttr('disabled');
      }
    }
  });
  $(this).focus();
}
$(function() {
  if (!$.browser.mozilla || $.browser.version != '1.9.1') {
    // does not work on firefox-3.5 (portable)
    updateRadio();
    $(".natHistoryTable input[name='rev1']:first").attr('disabled','disabled').attr('value', '0');
    $(".natHistoryTable input[name='rev2']:last").attr('disabled','disabled').attr('value', '0');
    $(".natHistoryTable input").click(updateRadio);
  }
});
})(jQuery);
