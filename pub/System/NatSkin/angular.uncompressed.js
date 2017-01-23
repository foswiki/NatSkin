/*global foswikiApp:true, angular:true */
"use strict";

foswikiApp.directive("natBody", [ '$rootScope', 
  function($rootScope) {
    function _testSideBar() {
      var text = angular.element(".natSideBarContents").text().replace(/^\s*$/, "");
      return text.length === 0;
    }

    return {
      restrict: "C",
      link: function(scope, elem) {
        var isEmptySideBar;

        // things to do when a page loaded
        scope.$on("foswiki.pageLoaded", function() {
          if (foswiki.getPreference("NatSkin").initTopPanel) {
            angular.element(".natTopPanel").hide();
          }
          angular.element('ul.sf-js-enabled').superfish("hide"); 
          isEmptySideBar = _testSideBar();

          angular.element(".natSearchBox .foswikiInputField").val("");
      
          angular.element(".natTopPanel").hide();
        });

        // update the body class according to natskin settings
        $rootScope.$watch("preferences", function() {
          var prefs = $rootScope.preferences || {},
              sidebar = prefs.NATSKIN_SIDEBAR || 'on',
              layout = prefs.NATSKIN_LAYOUT || 'fixed',
              classes = [];

          if (typeof(isEmptySideBar) === 'undefined') {
            isEmptySideBar = _testSideBar();
          }

          if (isEmptySideBar) {
            classes.push("natBodyOff");
          } else {
            switch (sidebar) {
              case "on":
              case "right":
                classes.push("natBodyRight");
                break;
              case "left":
                classes.push("natBodyLeft");
                break;
              case "off":
                classes.push("natBodyOff");
                break;
              case "both":
                classes.push("natBodyBoth");
                break;
            }
          }

          switch (layout) {
            case "fixed":
              classes.push("natBodyFixed");
              break;
            case "fluid":
              classes.push("natBodyFluid");
              break;
            case "bordered":
              classes.push("natBodyBordered");
              break;
          }

          elem
            .removeClass("natBodyRight natBodyLeft natBodyBoth natBodyOff natBodyFixed natBodyFluid natBodyBordered")
            .addClass(classes.join(" "));
        });

      }
    };
  }
]);
