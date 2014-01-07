// (c)opyright 2008-2014 Michael Daum http://michaeldaumconsulting.com
/* toggle the attachment editor */
(function($) {
  "use strict";

  var lastElem;

  /* check if the comment of an attachment is empty;
   * the core inserts an &nbsp; thats why this is a bit
   * more complicated
   */
  function isEmptyComment ($comment) {
    var text = $comment.text();
    return text.length == 1 && text.charCodeAt(0) == 160;
  }

  function toggleAttachmentEditor(elem, state) {

    if (lastElem && lastElem != elem) {
      toggleAttachmentEditor(lastElem, 'off');
    }

    var $elemStep = $(elem).parents(".foswikiFormStep"),
        $editor = $elemStep.find(".natAttachmentEditor"),
        $comment = $elemStep.find(".natAttachmentComment"),
        text = $editor.find("textarea").text();

    if (state == 'off') {
      $editor.slideUp('fast');
      if (!isEmptyComment($comment)) {
        $comment.show();
      }
      lastElem = '';
    } else {
      lastElem = elem;
      if ($editor.is(":visible")) {
        if (!isEmptyComment($comment)) {
          $comment.show();
        }
      } else {
        $comment.hide();
      }
      $editor.slideToggle('fast');
    }
  }

  // init
  $(function() {
    $("#main").validate();
    $(".natAttachEdit").click(function() {
      toggleAttachmentEditor(this);
      return false;
    });
  });
})(jQuery);
