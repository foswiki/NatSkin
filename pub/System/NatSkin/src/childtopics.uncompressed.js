/*
 * ChildTopics
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  $(".natChildTopicsContainer").livequery(function() {
    var url = foswiki.getScriptUrl("rest", "RenderPlugin", "template", {
                    name: "childtopics",
                    render: "on",
                    topic: foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),
                    expand: "childtopicsearch"
        }),
        $container = $(this);

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
