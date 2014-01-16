// (c)opyright 2006-2014 Michael Daum http://michaeldaumconsulting.com

jQuery(function($) {
  "use strict";

  // flag browser deprecation
  function uaMatch(ua) { // borrowed from jQuery
      ua = ua.toLowerCase();

      var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
              /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
              /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
              /(msie) ([\w.]+)/.exec( ua ) ||
              ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
              [];

      return {
              browser: match[ 1 ] || "",
              version: match[ 2 ] || "0"
      };
  }

  var deprecatedBrowsers,
      agent = uaMatch(window.navigator.userAgent),
      i, target, busyIndicator;

  // simplify
  agent = agent.browser + agent.version.replace(/\..*$/, '');

  if (agent) {
    deprecatedBrowsers = foswiki.getPreference("NatSkin.deprecatedBrowsers") || [];
    for (i = 0; i < deprecatedBrowsers.length; i++) {
      if (agent === deprecatedBrowsers[i]) {
        $("body").addClass("natDeprecatedBrowser");
        break;
      }
    }
  }

  /* move revinfo */
  if (foswiki.getPreference("NatSkin.fixRevisionPosition")) {
    target = $(".natMainContents h1:first");
    if (target.length) { 
      $(".natRevision").remove().insertAfter(target);
    }
  }

  /* horiz menu */
  if (foswiki.getPreference("NatSkin.initWebMenu")) {
    $(".natWebMenu").each(function() {
      var $this = $(this), 
          opts = $this.data(),
          topElems, count, width, elemWidth, lastWidth;

      $this.find(".natWebMenuContents > ul").superfish({
        dropShadows: false, 
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

      /* stretch top navi evenly based on the number of top elems */
      if ($this.is(".natWebMenuStretch")) {
        topElems = $this.find(".natWebMenuContents > ul > li");
        count = topElems.length;
        width = 100 - (count-1) * (opts.margin||0);
        elemWidth =  width / count;
        lastWidth = width - elemWidth * (count-1);

        elemWidth = elemWidth+"%";
        lastWidth = lastWidth+"%";
        //console.log("count=",count,"width=",width,"elemWidth=",elemWidth,"lastWidth=",lastWidth);

        topElems.outerWidth(elemWidth).last().outerWidth(lastWidth);
      }

      $this.removeClass('natWebMenuHidden');
    });

  }

  /* add edit topic prefs behavior */
  $("a.natEditSettingsAction").on("click", function() {
    $("#editSettingsForm").submit();    
    return false;
  });

  /* fix topic actions menu */
  $(".natMoreActionsMenu:first").each(function() {
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

  /* add overflow div for tables */
  if (foswiki.getPreference("NatSkin.initOverflows")) { 
    $(".natMainContents").find(".foswikiTable")
      .not($(".foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow foswikiTableOverflow'></div>");
  }

  // init more actions menu
  $(".natMoreActionsMenu:not(.natInitedMoreActionsMenu)").livequery(function() {
    var $this = $(this), 
        opts = $.extend({}, $this.metadata());
    $this.addClass("natInitedMoreActionsMenu").superfish(opts);
    $this.find("a[href]").click(function() {
      $this.superfish("hide");
    });
  });

  /* init ajax busy indicator */
  if (foswiki.getPreference("NatSkin.initBusyIndicator")) {
    busyIndicator = $("<div class='natBusy' />").appendTo("body");
    $(document).ajaxSend(function() {
      if ($(".blockUI").length === 0) { // don't show when a blockUI is active
        busyIndicator.show();
      }
    });
    $(document).ajaxComplete(function() {
      busyIndicator.hide();
    });
  }

  // remove empty attachment comments
  $("#natTopicAttachments .natAttachmentComment").livequery(function(){
    var text = $(this).text();
    //alert("text='"+text+"' char="+text.charCodeAt(0));
    if ((text.length == 1 && text.charCodeAt(0) == 160)) {
      $(this).hide();
    }
  });

  if (false) {
    $(".foswikiFormSteps").livequery(function() {
      var $this = $(this);
      $this.find("> .foswikiFormStep:last, > form > .foswikiFormStep:last").addClass("foswikiFormLast");
      $this.find("> .foswikiFormStep:first, > form > .foswikiFormStep:first").addClass("foswikiFormFirst");
    });
  }

  if (foswiki.getPreference("NatSkin.initSideBar")) { // typographic improvements in sidebar
    $('.natSideBar h2 + h2:not(.jqInitedSideBar)').livequery(function() {
      var $this = $(this);
      $this.addClass('jqInitedSideBar');
      $this.replaceWith('<h3>'+$this.html()+'</h3>');
    });
  }

  if (foswiki.getPreference("NatSkin.initAutoComplete")) {// autosuggest using solr 
    $("#searchbox").each(function() {
      var $form = $(this),
          $input = $form.find("input[type=text]"),
          submitButton = $form.find("input[type=submit]");

      $input.autosuggest({
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
    });
  }

  // hide address bar on mobile devices
  if(window.navigator.userAgent.match(/Android/i)){
    window.scrollTo(0,1);
  } 

  /* scroll to top */
  $(window).scroll(function() {
    var scrolltop = $(this).scrollTop();
    if (scrolltop > 100) {
      $('a.natScrollTop').fadeIn(1000);
    } else {
      $('a.natScrollTop').fadeOut(100);
    }
  });

  /* responsive navi */
  $(".natNavToggle").livequery(function() {
    var $this = $(this), 
        $sidebar = $(".natSideBar");

    if ($sidebar.length === 0) {
      $this.hide();
      return false;
    }

    $this.on("click", function(ev) {

      $sidebar.toggle("slide", {
        direction: "right"
      });

      if (ev.preventDefault) {
        ev.preventDefault();
        ev.stopPropagation();
      } else {
        ev.returnValue = false;
      }

      return false;
    });

    // switch on the sidebar when there's no toggle in sight
    $(window).resize(function() {
      if (!$this.is(":visible") && !$sidebar.is(":visible")) {
        $sidebar.show();
      }
    });
  });



  /* clean up address */
  $("address").livequery(function() {
    var $this = $(this),
        content = $this.html().replace(/^\s+|\s+$/g, "");
    $this.html(content);
  });

  /* click behavior for broadcastmessage */
  $(".foswikiBroadcastMessage").each(function() {
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

});
