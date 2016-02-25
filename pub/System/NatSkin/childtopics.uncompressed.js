jQuery(function($) {
'use strict';

  $(".natChildTopicsContainer:not(.natChildTopicsContainerInited)").livequery(function() {
    var url = foswiki.getScriptUrl("rest", "RenderPlugin", "template", {
                    name: "childtopics",
                    render: "on",
                    topic: foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),
                    expand: "childtopicsearch"
        }),
        $container = $(this);

    $container.addClass("natChildTopicsContainerInited");

    $container.html('<span class="jqAjaxLoader"></span>').load(url, function() {
      var $this = $(this);

      if ($("html").is(".ng-scope")) {
        $this.on("click", "a", function() {
          $(this).parents(".ui-dialog-content").dialog("destroy").remove();
        });
      }
    });
  });
});
