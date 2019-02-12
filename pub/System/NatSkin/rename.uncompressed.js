// (c)opyright 2008-2019 Michael Daum http://michaeldaumconsulting.com
"use strict";

jQuery(function($) {

  var $form = $("form[name='rename']");

  $(".natRenameSetAll").click(function() {
    $(this).parents("form:first").find("input[name=referring_topics]").prop('checked', true);
    return false;
  });
  $(".natRenameClearAll").click(function() {
    $(this).parents("form:first").find("input[name=referring_topics]").prop('checked', false);
    return false;
  });

  $("#wikifynewtopic").change(function() {
    var $this = $(this), 
        $target = $("input[name='newtopic']"),
        $source = $("#topictitle");
        
    if ($this.is(":checked")) {
      $target.prop("disabled", true);
      $target.wikiword({
        source: "#topictitle",
        transliterate: true
      });
    } else {
      $target.prop("disabled", false);
      $source.unbind();
    }
  });

  $form.submit(function() {
    $("input[name='newtopic']").prop("disabled", false);
    return true;
  });

});
