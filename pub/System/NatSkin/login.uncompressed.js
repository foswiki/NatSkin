(function($) {
  $(function() {
    $("#LogonForm").validate();
    if (foswiki.getPreference("NatSkin.loginFailed")) {
      $(".natLogin").shake(3, 10, 180);
    }
    if ($.browser.msie) { // bring back submit-on-return  for IEs
      $("#username, #password").keydown(function(e) {
        if (e.keyCode == '13') {
          $(this).parents("form").submit();
        }
      });
    }
  });
})(jQuery);
