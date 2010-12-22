jQuery(function($) {
  $(".natRenameSetAll").click(function() {
    $(this).parents("form:first").find("input[name=referring_topics]").attr('checked', 'checked');
    return false;
  });
  $(".natRenameClearAll").click(function() {
    $(this).parents("form:first").find("input[name=referring_topics]").removeAttr('checked');
    return false;
  });
});
