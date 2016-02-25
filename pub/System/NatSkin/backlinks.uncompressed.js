jQuery(function($) {
'use strict';

  $(".natBacklinksContainer:not(.natBacklinksContainerInited)").livequery(function() {
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
        expand: expand
      }), function() {
        var $this = $(this);

        if ($("html").is(".ng-scope")) {
          $this.on("click", "a", function() {
            $(this).parents(".ui-dialog-content").dialog("destroy").remove();
          });
        }
      });
    }

    $container.addClass("natBacklinksContainerInited");
    $searchAllWebs.change(updateContainer);
    updateContainer();
  });
});
