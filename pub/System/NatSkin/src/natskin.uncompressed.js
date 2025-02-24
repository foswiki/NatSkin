/*
 * NatSkin
 *
 * (c)opyright 2006-2024 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

/*eslint-disable no-console */

"use strict";

(function($) {

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
   * globals
   */
  var numDialogsOpen = 0,
      defaultPageControl = {
        bodyElem: "body",
        sidebarElem: ".natSideBar",
        navToggleElem: ".natNavToggle",
        animate: true,
        animateSpeed: 250,
	animateEase: "swing",
        showIcon: "ma ma-menu",
        hideIcon: "ma ma-close",
        breakPoint: 1000
      };


  /**************************************************************************
   * NaviControl
   */

  function NaviControl(opts) {
    var self = this;

    self.opts = $.extend({}, defaultPageControl, opts);
    self.init();
  };

  // init the page control
  NaviControl.prototype.init = function() {
    var self = this;

    self.body = $(self.opts.bodyElem);
    self.sidebar = $(self.opts.sidebarElem);
    self.navToggle = $(self.opts.navToggleElem);
    self.windowWidth = $(window).width();
    self.isNaviOn = true;
    self.mouseTimer = null;
    self.isMediaDriven = false;

    if (!self.sidebar.length) {
      return;
    }

    $(document).on("click", function() {
      if (self.isNavToggleEnabled()) {
        self.hideNavi(self.opts.animate);
      }
      return true;
    });

    $(window).on("resize", function() {
      self.windowWidth = $(window).width();
      if ((!self.isMediaDriven && self.isNavToggleEnabled()) || self.windowWidth <= self.opts.breakPoint) {
        self.showNavToggle();
      } else {
        self.hideNavToggle();
      }
    });

    self.navToggle.on("click", function() {
      self.toggleNavi();
      return false;
    });

    if (self.isNavToggleEnabled()) {
      self.showNavToggle();
    } else {
      self.isMediaDriven = true;
      if ($(window).width() <= self.opts.breakPoint) {
	self.showNavToggle();
      }
    }
  };

  // returns true when the navToggle is enabled
  NaviControl.prototype.isNavToggleEnabled = function() {
    var self = this;
    return self.body.is(".natBodyNavToggleEnabled");
  }

  NaviControl.prototype.hideNavi = function(animate) {
    var self = this;

    //console.log("called hideNavi");
    if (self.isNaviOn) {
      //console.log("here1");
      self.navToggle.removeClass(self.opts.hideIcon).addClass(self.opts.showIcon);

      if (animate) {
        //console.log("here2");
        //console.log("self.sidebar=",self.sidebar[0]);
	self.sidebar.animate({
	  right: -self.sidebar.outerWidth(),
	}, self.opts.animateSpeed, self.opts.animateEase, function() {
	    self.isNaviOn = false;
	});
      } else {
        //console.log("here3");
	self.sidebar.css("right", -self.sidebar.outerWidth());
	self.isNaviOn = false;
      }
    }
    //console.log("here4");
  };

  NaviControl.prototype.showNavi = function(animate) {
    var self = this;

    if (!self.isNaviOn) {
      self.navToggle.removeClass(self.opts.showIcon).addClass(self.opts.hideIcon);

      if (animate) {
	self.sidebar.animate({
	  right: 0,
	}, self.opts.animateSpeed, self.opts.animateEase, function() {
	    self.isNaviOn = true;
	});
      } else {
	self.sidebar.css("right", 0);
	self.isNaviOn = true;
      }
    }
  };

  NaviControl.prototype.toggleNavi = function() {
    var self = this;

    //console.log("called toggleNavi");
    if(self.isNaviOn) {
      self.hideNavi(self.opts.animate);
    } else {
      self.showNavi(self.opts.animate);
    }
  };

  NaviControl.prototype.showNavToggle = function() {
    var self = this;

    self.hideNavi();
    if (self.isMediaDriven) {
      self.body.addClass("natBodyNavToggleEnabled");
    }
  };

  NaviControl.prototype.hideNavToggle = function() {
    var self = this;

    self.showNavi();
    //self.navToggle.removeClass(self.opts.showIcon);
    if (self.isMediaDriven) {
      self.body.removeClass("natBodyNavToggleEnabled");
    }
  };

  /**************************************************************************
   * init horizontal navigation
   */
  function initWebMenu() {
    $(".natWebMenu").livequery(function() {
      var $this = $(this),
          $content = $this.find(".natWebMenuContents"),
          $elems = $content.find("> ul li > a[href]"),
          sel;

      if (!$elems.length) {
        return;
      }

      // Create the dropdown base
      sel = $("<select name='web' />").addClass("natWebMenuSelect").insertAfter($content);

      // Create default option "Go to..."
      $("<option />", {
         "value"   : "",
         "text"    : "Go to..."
      }).prop("selected", true).appendTo(sel);

      // Populate dropdown with menu items
      $elems.each(function() {
        var $el = $(this), 
            text = $el.text().trim(),
            depth = $el.parents("ul").length - 1;

        //console.log("this=",text,"depth=",depth);

        if (depth) {
          text = "&nbsp;".repeat(depth*4) + text;
        }

        $("<option />", {
            "value": $el.attr("href")
        }).append(text).appendTo(sel);
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
            opts = $.extend({}, $this.data());
            if (opts.url) {
              $this.load(opts.url, function() {
                $this.removeClass("ajaxMenu");
                $this.parent().removeClass("hasAjaxMenu");
              });
            }
          }
        }
      });
    });
    $(".natWebMenuContents li").livequery(function() {
      var $this = $(this);

      if ($this.is("li:has(.ajaxMenu)")) {
        $this.addClass("hasAjaxMenu");
      }

      if ($this.is("li:has(ul)")) {
        $this.addClass("hasSubMenu");
      }
    });
  }

  /**************************************************************************
   * display FLASHNOTE as a pnotify
   */
  function initFlashNote() {
    $(".foswikiFlashNote").livequery(function() {
      var $this = $(this);

      $.pnotify({
        title: $.i18n("Attention"),
        text: $this.html(),
        type: "info"
      });
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
        origin = $panel.find("form input[name='origin']").val(),
        openTimer,
        opts = $.extend({
          openDuration: 200,
          openEasing: "swing",
          closeDuration: 200,
          closeEasing: "swing"
        }, $panel.data());

    if (origin !== '') {
      url += "?origin="+origin;
    }

    function openPanel() {
      if (typeof(openTimer) === 'undefined') {
        openTimer = window.setTimeout(function() {
          $toggle.addClass("open");
          $("body").addClass("natBodyPanelOpen");
          openTimer = undefined;

          $panel.slideDown({
            duration: opts.openDuration,
            easing: opts.openEasing,
            complete: function() {
              $panel.addClass("open");
            }
          });

          window.scrollTo(0,0);
          $searchBox.trigger("focus");
        }, 250); // timeout to detect a double click
      }
    }

    function closePanel() {
      $toggle.removeClass("open");
      $("body").removeClass("natBodyPanelOpen");

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
   * add behavior to various topic actions
   */
  function initTopicActions() {

    /* add edit topic prefs behavior */
    $("a.natEditSettingsAction").on("click", function() {
      $("#editSettingsForm").trigger("submit");    
      return false;
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
   * init for mobile devices
   */
  function initMobile() {
    // hide address bar on androids
    if(window.navigator.userAgent.match(/Android/i)){
      window.scrollTo(0,1);
    } 
  }

  /**************************************************************************
   * init the scroll to top feature
   */
  function initScrollToTop() {
    var elem = $("a.natScrollTop");

    $(window).on("scroll", function() {
      var scrolltop = $(this).scrollTop();
      if (scrolltop > 100) {
        if (!elem.is(":visible")) {
          elem.fadeIn(1000);
        }
      } else {
        if (elem.is(":visible")) {
          elem.fadeOut(100);
        }
      }
    });
  }

  /**************************************************************************
   * init click behavior for broadcastmessage
   */
  function initBroadcastMessage() {

    $(".foswikiBroadcastMessage").livequery(function() {
      var $this = $(this), 
          remember = $this.data("remember"),
          cookieName, cookieCheckSum, checkSum;

      remember = typeof(remember) === 'undefined' ? 1 : remember;

      if (remember) {
        cookieName =  (foswiki.getPreference("COOKIENAMEPREFIX") || '') + "FOSWIKI_NATSKIN_broadcastMessage_"+ $this.attr("id");
        cookieCheckSum = parseInt($.cookie(cookieName), 10);
      }

      if (!remember || typeof(cookieCheckSum) === 'undefined') {
        $this.show();
      } else {
        checkSum = _hashCode($this.text());
        if (checkSum !== cookieCheckSum) {
          $this.show();
        }
      }

      $this.find(".foswikiBroadcastMessageClose").on("click", function() {
        $this.slideUp("fast");

        if (remember) {
          checkSum = checkSum || _hashCode($this.text());

          $.cookie(cookieName, checkSum, {
            path:'/',
            domain: foswiki.getPreference('COOKIEREALM'),
            secure: true,
            samesite: "strict"
          });
        }

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
          cookieAgreed = $.cookie(cookieName);

      if (!cookieAgreed) {
        window.setTimeout(function () {
          $this.fadeIn(200);
        }, 2000);
      
        $this.find(".natCookieInfoOK").on("click", function() {
          $this.fadeOut(200);
          $.cookie(cookieName, true, {
            path:'/',
            domain: cookieDomain,
            secure: true,
            samesite: "strict"
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
   * init verbatim elements adding a copy-to-clipboard button
   */
  function initVerbatim() {
    $(".natViewBody .natMainContents pre:not(.CodeMirror-line), .clipboard").livequery(function() {
      var $this = $(this),
          opts = $.extend({
            showButton: true,
          },$this.data()),
          $wrapper, $clickElem;

      if (opts.showButton) {
        $clickElem = $("<button title='Copy to clipboard' class='i18n'><i class='fa fa-clipboard' /></button>").css({
          "position": "absolute",
          "top": 5,
          "right": 5
        }).hide();
        $wrapper = $this.wrap("<div />")
          .parent().css({
            "position": "relative"
          }).append($clickElem);

        $wrapper.on("mouseenter", function() {
          $clickElem.fadeIn();
        }).on("mouseleave", function() {
          $clickElem.hide();
        });
      } else {
        $clickElem = $this;
      }

      $clickElem.on("click", function() {
        var $clone = $this.clone(), val;

        $clone.find(".rowNum").remove(); // hack out SyntaxHighlightingPlugin's row numbers
        val = $clone.text().replace(/^\s+|\s+$/g, "")

        if (val !== '') {
          navigator.clipboard.writeText(val);
          $.pnotify({
            "text": "<span class='i18n'>Content copied to clipboard</span>",
            "type": "info",
            "delay": 500
          });
        }
        return false;
      });
    });
  }

  /**************************************************************************
   * add anchors to headings
   */
  function initHeaderAnchors() {
    
    $(".natViewBody .natMainContents").find("h2[id], h3[id], h4[id], h5[id], h6[id]").livequery(function() {
      var $this = $(this);

      $this.addClass("natAnchorContainer");
      $("<a>&#182;</a>").prependTo($this)
        .addClass("natAnchor")
        .attr("href", "#"+$this.attr("id"));
    });
  }

  /**************************************************************************
   * set a css variable
   */
  function cssVar(key, val) {
    var root = document.querySelector(":root");

    if (typeof(val) === 'undef') {
      return getComputedStyle(root).getPropertyValue(key);
    } else {
      return root.style.setProperty(key, val);
    }
  }

  /**************************************************************************
   * init top bar to shrink when scrolling
   */
  function initTopBar() {
    var topBar = $(".natTopBar"),
        panel, body, observer;

    if (!topBar.length) {
      return;
    }

    function updateTopBarHeight() {
      var height = topBar.height();
      topBar.css("top", (height * -1) + "px"); /* SMELL: ... to make transitions work */
      cssVar("--top-bar-height", height+"px");
    }

    updateTopBarHeight();

    body = $("body");
    panel = $(".natTopPanel");

    if (body.is(".natBodySticky")) {
      return;
    }

    observer = new IntersectionObserver(function(ev) {
      var ratio = ev[0].intersectionRatio;

      //console.log("ratio=",ratio);

      if (panel.is(".open")) {
        $(document).trigger("close_panel");
      }

      if (body.is(".natBodyStickyTopBar")) {
        if (ratio == 1) {
          body.removeClass("natBodyStickyTopBar");
          updateTopBarHeight();
        }
      } else {
        if (ratio <= 0.1) {
          body.addClass("natBodyStickyTopBar");
          updateTopBarHeight();
        }
      }
    }, {
      threshold: [0.1, 1]
    });

    observer.observe(topBar[0])
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
   * show selfxss warning message in console
  */
  function initConsole() {
    if (console && console.log) {
      console.log("%cWarning!", "color:red;font-size:32px;font-weight:bold;margin-top:28px");
      console.log("%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS.", "color:black;font-size:18px");
      console.log("%cDo not enter or paste code that you do not understand.","color:black;font-size:16px");
      console.log("%cRead more at https://en.wikipedia.org/wiki/Self-XSS", "color:black;font-size:16px;margin-bottom:34px");
    }
  }

  /**************************************************************************
   * init on load
   */
  $(function() { 
    var prefs = foswiki.getPreference("NatSkin");

    initMobile();

    if (prefs.initConsole) {
      initConsole();
    }

    if (prefs.initWebMenu) {
      initWebMenu();
    }

    if (prefs.initBusyIndicator) {
      initBusyIndicator();
    }

    if (prefs.initOverflows) { 
      initOverflows();
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

    if (prefs.initHeaderAnchors) {
      initHeaderAnchors();
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
      if (e.altKey && e.shiftKey && e.key === '?') { /* alt+shift+? */
        showAccessKeys();          
      }
    });

    // create page control
    $("body").data("naviControl", new NaviControl());

    initFlashNote(); 
    initTopicActions(); 
    initScrollToTop();
    initBroadcastMessage();
    initAddressElement();
    initVerbatim();

    // pnotify defaults
    $.pnotify.defaults.icon = false;

    // reenable caching in case it has been disabled
    $.ajaxPrefilter('json script', function(opts) {
      opts.cache = true;
    });
  });

})(jQuery);
