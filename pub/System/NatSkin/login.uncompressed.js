(function($) {
  $(function() {
    $("#LogonForm").validate();
    if (foswiki.getPreference("NatSkin.loginFailed")) {
      $(".natLogin").shake(3, 10, 180);
    }
    $("#username, #password").keydown(function(e) {
      if (e.keyCode == '13') {
        $(this).parents("form").submit();
      }
    });
  });
})(jQuery);
