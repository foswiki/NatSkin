(function($) {
  $(function() {
    $("#LogonForm").validate();
    if (foswiki.NatSkin.loginFailed) {
      $(".natLogin").shake(3, 10, 180);
    }
  });
})(jQuery);
