// (c)opyright 2006-2019 Michael Daum http://michaeldaumconsulting.com
"use strict";

(function($) {

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
      $this.find(".natWebMenuContents > ul > li > a[href]").each(function() {
        var el = $(this);
        $("<option />", {
            "value"   : el.attr("href"),
            "text"    : el.text()
        }).appendTo(sel);
      });

      sel.on("change", function() {
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
    var $panel = $(".natTopPanel"), 
        $toggle = $(".natPanelToggle"),
        $searchBox = $panel.find(".natSearchBox .foswikiInputField"),
        url = $panel.find("form").attr("action"),
        openTimer,
        opts = $.extend({
          openDuration: 200,
          openEasing: "shagga",
          closeDuration: 200,
          closeEasing: "shagga"
        }, $panel.data());

    function openPanel() {
      if (typeof(openTimer) === 'undefined') {
        openTimer = window.setTimeout(function() {
          $toggle.addClass("open");
          openTimer = undefined;

          $panel.slideDown({
            duration: opts.openDuration,
            easing: opts.openEasing,
            complete: function() {
              $panel.addClass("open");
            }
          });

          window.scrollTo(0,0);
          $searchBox.focus();
        }, 250); // timeout to detect a double click
      }
    }

    function closePanel() {
      $toggle.removeClass("open");

      $panel.slideUp({
        duration: opts.closeDuration,
        easing: opts.closeEasing,
        complete: function() {
          $panel.removeClass("open");
        }
      });
    }

    function togglePanel(e) {
      if ($panel.is(".open")) {
        closePanel();
      } else {
        openPanel();
      }
    }

    $(document).on("dblclick", ".natPanelToggleSearch", function(e) {
      window.clearTimeout(openTimer);
      $(this).addClass("natWaiting");
      window.location.href = url;
      e.preventDefault();  
      return false;
    });


    $(document)
      .on("open_panel", openPanel)
      .on("close_panel", closePanel)
      .on("click", ".natPanelToggle a", togglePanel)
      .on("keydown", function(e) {
        if (e.altKey && e.shiftKey && e.keyCode === 70) { /* alt+shift+f */
          openPanel();
        } 
      });

    $searchBox.on("keydown", function(e) {
      if (e.keyCode === 27) {
        closePanel();
      }
    }).on("blur", function() {
      window.setTimeout(function() {
        closePanel();
      }, 100);
    });
  }

  /**************************************************************************
   * add behavior when the hash of the window.location changes
   * 
   */
  function initHashChange() {

    function animateHashChange() {
      var hash = window.location.hash.substring(1).replace(/([#\.])/g, '\\$1'), elem;
      if (hash !== '' && !hash.match(/^GoSlide\d/) ) { // prevent blinking SlideShowPlugin slides
        try {
          elem = $("#"+hash);
          elem.addClass("natBlinker");
          window.setTimeout(function() {
            elem.removeClass("natBlinker");
          }, 2500);
        } catch (error) {
          return false;
        }
      }

      return true;
    }

    $(window).on("hashchange", animateHashChange);
    animateHashChange();
  }

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

    // init more actions menu
    $(".natMoreActionsMenu:not(.natInitedMoreActionsMenu)").livequery(function() {
      var $this = $(this),
          opts = $.extend({menu: "ul:first"}, $this.data()),
          $menu = $this.find(opts.menu);

      $this.hoverIntent({
        over: function() {
          $menu.fadeIn("fast");
          //$menu.show();
        }, 
        out: function() {
          $menu.hide();
        },
        timeout: 500,
        sensitivity: 3
      });
      $this.find("a[href]").click(function() {
        $menu.hide();
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
          if(!$("body").is(".natBodyNavToggleActive")) {
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
          id = $this.attr("id"),
          cookieNamePrefix = foswiki.getPreference("COOKIENAMEPREFIX") || '',
          cookieName = cookieNamePrefix + "FOSWIKI_NATSKIN_broadcastMessage_"+id,
          cookieDomain = foswiki.getPreference('COOKIEREALM'),
          cookieSecure = foswiki.getPreference('URLHOST').indexOf('https://') === 0,
          cookieCheckSum = parseInt($.cookie(cookieName), 10),
          checkSum;

      if (typeof(cookieCheckSum) === 'undefined') {
        $this.show();
      } else {
        checkSum = _hashCode($this.text());
        if (checkSum !== cookieCheckSum) {
          $this.show();
        }
      }

      $this.find(".foswikiBroadcastMessageClose").on("click", function() {
        checkSum = checkSum || _hashCode($this.text());

        $this.slideUp("fast");
        $.cookie(cookieName, checkSum, {
          path:'/',
          domain: cookieDomain,
          secure: cookieSecure
        });

        return false;
      });
    });

  }

  function _hashCode(str) { 
    var hash = 5381, i = str.length;

    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    return hash >>> 0;
  }

  /**************************************************************************
   * add behavior to cookie info
   * 
   */
  function initCookieInfo() {

    $(".natCookieInfo").livequery(function() {
      var $this = $(this),
          cookieName = "FOSWIKI_NATSKIN_cookieInfo",
          cookieDomain = foswiki.getPreference('COOKIEREALM'),
          cookieSecure = foswiki.getPreference('URLHOST').indexOf('https://') === 0,
          cookieAgreed = $.cookie(cookieName);

      if (!cookieAgreed) {
        window.setTimeout(function () {
          $this.fadeIn(200);
        }, 2000);
      
        $this.find(".natCookieInfoOK").click(function() {
          $this.fadeOut(200);
          $.cookie(cookieName, true, {
            path:'/',
            domain: cookieDomain,
            secure: cookieSecure
          });
        }); 
      }
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
   * init top bar to shrink when scrolling
   */
  function initTopBar() {
    var $panel = $(".natTopPanel"),
        timer;

    function updateTopBar() {
      var scrollTop = $(window).scrollTop();

      //console.log("scrollTop=",scrollTop);

      if (scrollTop >= 100) {
        //console.log("... making it smaller");
        if ($panel.is(".open")) {
          $(document).trigger("close_panel");
        } else {
          $("body").addClass("natBodyStickyTopBar");
        }
      } else {
        //console.log("... making it larger again");
        $("body").removeClass("natBodyStickyTopBar");
      }
    }

    $(window).on('scroll', function() {
      window.cancelAnimationFrame(timer);
      timer = window.requestAnimationFrame(function() {
        updateTopBar();
      }); 
    });
  }

  /**************************************************************************
   * init external links: open them in a separate window.
   * note: you will have to enable {NatSkin}{DetectExternalLinks}
   */
  function initExternalLinks() {
    $(".natExternalLink").livequery(function() {
      $(this).attr("target", "_blank").attr("rel", "noopener noreferrer");
    });
  }

  /**************************************************************************
   * show accesskeys on the current page
   */
  function showAccessKeys() {
    var text = "", keys = [], descr = {};

    $("[accesskey]").each(function() {
      var $this = $(this), 
          key = $this.attr("accesskey");
      if (typeof(descr[key]) === 'undefined') {
        descr[key] = $this.attr("title") || "???";
        keys.push(key);
      }
    });
    if (keys.length) {
      $(keys.sort()).each(function(i, key) {
        text += "<tr><th>"+key+":</th><td>"+descr[key]+"</td></tr>"
      });
      text = "<table class='foswikiLayoutTable'><tbody>"+text+"</tbody></table>";
      $.pnotify({
        title: $.i18n("Access Keys"),
        text: text,
        type: "notice"
      });
    }
  }

  /**************************************************************************
   * init on load
   */
  $(function() { 
    var prefs = foswiki.getPreference("NatSkin");

    initMobile();

    if (prefs.initWebMenu) {
      initWebMenu();
    }

    if (prefs.initBusyIndicator) {
      initBusyIndicator();
    }

    if (prefs.initOverflows) { 
      initOverflows();
    }

    if (prefs.initSideBar) { 
      initSideBar();
    }

    if (prefs.initExternalLinks) {
      initExternalLinks();
    }

    if (prefs.initTopPanel) {
      initTopPanel();
    }

    if (prefs.initTopBar) {
      initTopBar();
    }

    if (prefs.initCookieInfo) {
      initCookieInfo();
    }

    // flag a dialog being open to the body element
    $(document).on("dialogopen", function(){
      numDialogsOpen++;
      $("body").addClass("natDialogOpen");
    });
    $(document).on("dialogclose", function(){
      numDialogsOpen--;
      if (numDialogsOpen <= 0) {
        $("body").removeClass("natDialogOpen");
      }
    });

    // show access keys
    $(document).on("keydown", function(e) {
      if (e.altKey && e.shiftKey && e.keyCode === 219) { /* alt+shift+? */
        showAccessKeys();          
      }
    });

    initHashChange(); 
    initTopicActions(); 
    initScrollToTop();
    initResponsiveNavi();
    initBroadcastMessage();
    initAddressElement();

  });

})(jQuery);
