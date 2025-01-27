/*
 * Backlinks
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  $(".natBacklinksContainer").livequery(function() {
    var $container = $(this),
        $searchAllWebs = $container.find(".natBacklinksSearchAll");

    function updateContainer() {
      var expand;

      $container.html("<span class='jqAjaxLoader'></span>");
      if ($searchAllWebs.is(":checked") || $searchAllWebs.val() == 'true') {
        expand = "searchallwebs";
      } else {
        expand = "searchweb";
      }

      $container.load(foswiki.getScriptUrl("rest", "RenderPlugin", "template", {
        name: "backlinks",
        render: "on",
        topic: foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),
        expand: expand,
        cachecontrol: 0
      }), function() {
        var $this = $(this);

        if ($("html").is(".ng-scope")) {
          $this.on("click", "a", function() {
            $(this).parents(".ui-dialog-content").dialog("destroy").remove();
          });
        }
      });
    }

    $searchAllWebs.on("change", updateContainer);
    updateContainer();
  });
});
