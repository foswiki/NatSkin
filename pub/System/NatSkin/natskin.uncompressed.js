// (c)opyright 2006-2015 Michael Daum http://michaeldaumconsulting.com

(function($) {
"use strict";

  /**************************************************************************
   * globals
   */
  var numDialogsOpen = 0;


  /**************************************************************************
   * custom ease-in-out 
   */
  $.extend($.easing, {
    'shagga':  function (x, t, b, c, d) {
      if (( t /= d / 2) < 1) {
          return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  });

  /**************************************************************************
   * init horizontal navigation
   */
  function initWebMenu() {
    $(".natWebMenu").livequery(function() {
      var $this = $(this), 
          opts = $this.data(),
          topElems, count, width, elemWidth, lastWidth, sel;

      /* stretch top navi evenly based on the number of top elems */
      if ($this.is(".natWebMenuStretch")) {
        topElems = $this.find(".natWebMenuContents > ul > li");
        count = topElems.length;
        width = 100 - (count -1) * (opts.margin||0);
        elemWidth =  width / count;
        lastWidth = width - elemWidth * (count-1);

        elemWidth = elemWidth+"%";
        lastWidth = lastWidth+"%";
        //console.log("count=",count,"width=",width,"elemWidth=",elemWidth,"lastWidth=",lastWidth);

        topElems.width(elemWidth).last().width(lastWidth);
      }

      // Create the dropdown base
      sel = $("<select />").appendTo(this);

      // Create default option "Go to..."
      $("<option />", {
         "selected": "selected",
         "value"   : "",
         "text"    : "Go to..."
      }).appendTo(sel);

      // Populate dropdown with menu items
      $this.find(".natWebMenuContents > ul > li > a").each(function() {
        var el = $(this);
        $("<option />", {
            "value"   : el.attr("href"),
            "text"    : el.text()
        }).appendTo(sel);
      });

      sel.change(function() {
        window.location.href = $(this).find("option:selected").val();
      });

    });

    $(".natWebMenuContents > ul").livequery(function() {
      var $this = $(this);

      $this.addClass("sf-menu").superfish({
        cssArrows: false,
        speed:200,
        onBeforeShow: function() {
          var $this = $(this), opts;
          if ($this.is(".ajaxMenu")) {
            opts = $.extend({}, $this.metadata());
            if (opts.url) {
              $this.load(opts.url, function() {
                $this.removeClass("ajaxMenu");
                $this.parent().removeClass("hasAjaxMenu");
              });
            }
          }
        }
      })
      .find("li:has(ul)").addClass("hasSubMenu")
      .find("li:has(.ajaxMenu)").addClass("hasAjaxMenu");

    });
  }

  /**************************************************************************
   * add behavior to top panel
   * 
   */
  function initTopPanel() {

    $(document).on("click", ".natPanelToggle a", function() {
      var $toggle = $(this);
      $toggle.toggleClass("active");
      $(".natTopPanel").slideToggle(200, "shagga");
      return false;
    });
  };

  /**************************************************************************
   * add behavior to various topic actions
   * 
   */
  function initTopicActions() {

    /* add edit topic prefs behavior */
    $(document).on("click", "a.natEditSettingsAction", function() {
      $("#editSettingsForm").submit();    
      return false;
    });

    /* fix topic actions menu */
    $(".natMoreActionsMenu:first").livequery(function() {
      // hide hr if all prev list items are disabled
      // ... or all following list items are disabled
      $(this).find("hr").parent().each(function() {
        var $this = $(this);
        if ($this.prevAll().find(".natTopicAction").not(".natDisabledTopicAction").length === 0 ||
            $this.nextAll().find(".natTopicAction").not(".natDisabledTopicAction").length === 0) {
          $this.hide();
        }
      });
    });

    // init more actions menu
    $(".natMoreActionsMenu:not(.natInitedMoreActionsMenu)").livequery(function() {
      var $this = $(this), 
          opts = $.extend({}, $this.metadata());
      $this.addClass("natInitedMoreActionsMenu").superfish(opts);
      $this.find("a[href]").click(function() {
        $this.superfish("hide");
      });
    });
  }

  /**************************************************************************
   * init overflow elements by adding an overflow div for tables 
   */
  function initOverflows() {
    $(".natMainContents").find(".foswikiTable")
      .not($(".foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow foswikiTableOverflow'></div>");
  }

  /**************************************************************************
   * init ajax busy indicator
   */
  function initBusyIndicator() {

    $(document).ajaxSend(function() {
      if ($(".blockUI").length === 0) { // don't show when a blockUI is active
        $(".natBusy").show();
      }
    });

    $(document).ajaxComplete(function() {
      $(".natBusy").hide();
    });
  }

  /**************************************************************************
   * init sidebar: some typographic improvements and helpers for old IEs
   */
  function initSideBar() {
    $('.natSideBar h2 + h2').livequery(function() {
      var $this = $(this);
      $this.replaceWith('<h3>'+$this.html()+'</h3>');
    });

    $('.natSideBarContents > h2:first-of-type').addClass('natFirstOfType');
  }

  /**************************************************************************
   * init the autosuggestion feature on the search field
   */
  function initSearchBox() {
    $("#searchbox").livequery(function() {
      var $form = $(this),
          $input = $form.find("input[type=text]"),
          submitButton = $form.find("input[type=submit]"),
          position = $.extend({
            my: "right top",
            at: "right+5 bottom+11",
          }, {
            my: $form.data("position-my"),
            at: $form.data("position-at"),
          });

      if (typeof($.fn.autosuggest) === 'function') { // make sure autosuggest realy is present
        $input.autosuggest({
          position: position,
          menuClass: 'natSearchBoxMenu',
          search: function(event) {
            submitButton.hide();
          },
          response: function(event) {
            submitButton.show();
          },
          open: function(event) {
            submitButton.show();
          }
        });
      }
    });
  }

  /**************************************************************************
   * init for mobile devices
   */
  function initMobile() {
    // hide address bar on androids
    if(window.navigator.userAgent.match(/Android/i)){
      window.scrollTo(0,1);
    } 
  }

  /**************************************************************************
   * init responsive navi
   */
  function initResponsiveNavi() {
    var $sidebar = $(".natSideBar");

    function toggleSidebar() {
      $sidebar.toggle("slide", {
        direction: "right",
        duration: 200,
        easing: "shagga",
        complete: function() {
          $("body").toggleClass("natBodyNavToggleActive");
          if($("body").is(".natBodyNavToggleActive")) {
          } else {
            $sidebar.css("display", "");
          }
        }
      });
    }

    $(document).on("click", ".natBodyNavToggleActive", function() {
      toggleSidebar();
      return true;
    });

    $(".natNavToggle").livequery(function() {
      var $this = $(this);

      $this.on("click", function() {
        toggleSidebar();
        return false;
      });
    });
  }

  /**************************************************************************
   * init the scroll to top feature
   */
  function initScrollToTop() {

    $(window).scroll(function() {
      var scrolltop = $(this).scrollTop();
      if (scrolltop > 100) {
        $('a.natScrollTop').fadeIn(1000);
      } else {
        $('a.natScrollTop').fadeOut(100);
      }
    });
  }

  /**************************************************************************
   * init click behavior for broadcastmessage
   */
  function initBroadcastMessage() {

    $(".foswikiBroadcastMessage").livequery(function() {
      var $this = $(this), 
          cookieName = "broadcastMessage_counter",
          counter = $.cookie(cookieName) || 0;

      if (counter > 0) {
        $this.hide();
        counter--;
        $.cookie(cookieName, counter, {path:'/'});
      } else {
        $.cookie(cookieName, null, {path:'/'});
      }

      $this.find(".foswikiBroadcastMessageClose").on("click", function() {
        if (counter > 0) {
          $this.slideDown("fast");
          $.cookie(cookieName, null, {path:'/'});
        } else {
          $this.slideUp("fast");
          $.cookie(cookieName, 4, {path:'/'});
        }
        return false;
      });
    });

  }

  /**************************************************************************
   * init address element
   */
  function initAddressElement() {
    
    $("address").livequery(function() {
      var $this = $(this),
          content = $this.html().replace(/^\s+|\s+$/g, "");

      $this.html(content);
    });
  }

  /**************************************************************************
   * init external links: open them in a separate window.
   * note: you will have to enable {NatSkin}{DetectExternalLinks}
   */
  function initExternalLinks() {
    $(".natMainContents .natExternalLink").livequery(function() {
      $(this).attr("target", "_blank");
    });
  }

  /**************************************************************************
   * init on load
   */
  $(function() { 

    initMobile();

    if (foswiki.getPreference("NatSkin.initWebMenu")) {
      initWebMenu();
    }

    if (foswiki.getPreference("NatSkin.initBusyIndicator")) {
      initBusyIndicator();
    }

    if (foswiki.getPreference("NatSkin.initOverflows")) { 
      initOverflows();
    }

    if (foswiki.getPreference("NatSkin.initSideBar")) { 
      initSideBar();
    }

    if (foswiki.getPreference("NatSkin.initAutoComplete")) {
      initSearchBox();
    }

    if (foswiki.getPreference("NatSkin.initExternalLinks")) {
      initExternalLinks();
    }

    if (foswiki.getPreference("NatSkin.initTopPanel")) {
      initTopPanel();
    }

    // flag a dialog being open to the body element
    $(document).on("dialogopen", function(){
      numDialogsOpen++;
      $("body").addClass("natDialogOpen");
    })
    $(document).on("dialogclose", function(){
      numDialogsOpen--;
      if (numDialogsOpen <= 0) {
        $("body").removeClass("natDialogOpen");
      }
    });


    initTopicActions(); 
    initScrollToTop();
    initResponsiveNavi();
    initBroadcastMessage();
    initAddressElement();

  });

})(jQuery);
