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
        panel, topBarHeight, body, observer;

    if (!topBar.length) {
      return;
    }

    function updateTopBarHeight() {
      topBarHeight = topBar.height();
      cssVar("--top-bar-height", topBarHeight+"px");
    }

    updateTopBarHeight();

    //console.log("topBarHeight=",topBarHeight);

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
/*
 * TopicCreator for NatSkin 1.15
 *
 * (c)opyright 2015-2024 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */
/*eslint no-console: 0 */
"use strict";
(function($) {

  var defaults = {
    debug: false
  };

  /***************************************************************************
   * class definition
   */
  function TopicCreator(elem, opts) {
    var self = this;

    self.template = "newtopic";
    self.steps = [
      {
        "id": ".tcTopicTypes",
        "select": ".tcTopicType"
      },
      {
        "id": ".tcTopicTemplates",
        "expand": "topiccreator::topictemplates",
        "select": ".tcTopicTemplate"

      },
      {
        "id": ".tcInputForm",
        "expand": "topiccreator::inputform"
      }
    ];
  
    self.elem = $(elem);
    self.container = self.elem.find(".tcContainer");
    self.opts = $.extend({
      "topic": foswiki.getPreference("WEB") + "." + foswiki.getPreference("TOPIC")
    }, defaults, self.elem.data(), opts);

    //self.log("new TopicCreator", self);

    // navigation
    self.elem.find(".tcNavi").on("click", function() {
      var target = $(this).attr("href");
      if (target === '#next') {
        self.gotoStep(self.currentStep+1, 1);
      } else if (target === '#prev') {
        self.gotoStep(self.currentStep-1, -1);
      } else {
        console.error("unknown target ",target,"clicking on ",this);
      }
      return false;
    });

    // close event
    self.elem.parents(".ui-dialog-content:first").on("dialogclose", function() {
      if (!self._submit) {
        $(this).dialog("destroy").remove();
      }
    });

    // cancel button
    self.elem.find(".tcAbort").on("click", function() {
      $(this).parents(".ui-dialog-content:first").dialog("close");
      return false;
    });

    // submit button
    self.elem.find(".tcSubmit").on("click", function() {
      var topic = self.elem.find("input[name=topic]").val();
      if (topic !== '' && !$(this).is(".jqButtonDisabled")) {
	//self.container.block({message:""});
        self._submit = true;
        $(this).parents(".ui-dialog-content:first").dialog("close");
	self.elem.find("form").trigger("submit");
      }
      return false;
    });

    // set initial selection
    var stepDesc = self.steps[0],
        stepElem = self.container.find(stepDesc.id),
        $select = stepElem.find(stepDesc.select+".tcSelected");
    if ($select.length) {
      stepDesc.selectedElem = $select;
    }

    // first page
    self.gotoStep(0, 1);
  }

  /***************************************************************************
   * logging
   */
  TopicCreator.prototype.log = function() {
    var self = this, args;

    if (self.opts.debug) {
      args = $.makeArray(arguments);
      args.unshift("TC:");
      console.log.apply(console, args);
    }
  };

  /***************************************************************************
   * goto a step in the list
   */
  TopicCreator.prototype.gotoStep = function(step, dir) {
    var self = this, params = {},
        stepDesc = self.steps[step], i;

    self.log("called gotoStep",step,"dir=",dir);

    if (step < 0 || step > self.steps.length || typeof(stepDesc) === 'undefined') {
      console.error("unknown step "+step);
      return;
    }

    self.currentStep = step;

    for (i = 0; i < step; i++) {
      if (self.steps[i].selectedElem) {
        $.extend(params, self.steps[i].selectedElem.data());
      } else {
        self.log("no selected element in step",i);
      }
    }

    // propagate topic title provided to the dialog, e.g. via NEWTOPICFORMAT
    params["topicTitle"] = self.elem.find("input[name=topicTitle]").val();

    // step 0: remove previous pages 
    if (step === 0 || dir < 0) {
      for (i = step; i < self.steps.length; i++) {
        // remove dynamically loaded pages
        if (self.steps[i].expand) {
          self.log("removing ",self.steps[i].id);
          self.elem.find(self.steps[i].id).remove();
          delete self.steps[i].selectedElem;
        }
      }
    }

    // load it async'ly if there is an "expand" property and it isn't there yet
    if (stepDesc.expand && self.container.find(stepDesc.id).length === 0) {
      self.container.block({message:""});
      $.extend(params, self.opts, {
        "name": self.template,
        "expand": stepDesc.expand,
        "success": function(data) {
          self.container.unblock();
          self.container.append(data);
          self.initStep(step, dir);
        },
        "error": function(xhr) {
          console.error("Error: " + xhr.status + " " + xhr.statusText);
        }
      });

      self.log("loading params=",params);

      foswiki.loadTemplate(params);
    } else {
      self.initStep(step, dir);
    }
  };

  /***************************************************************************
   * init page of given step
   */
  TopicCreator.prototype.initStep = function(step, dir) {
    var self = this,
        stepDesc = self.steps[step],
        stepElem = self.container.find(stepDesc.id),
        optElems = stepElem.find(stepDesc.select),
        foundPrev = false, i;

    self.log("called initStep() - step=",step,"stepDesc=",stepDesc,"currentStep=",self.currentStep,"dir=",dir);

    // scroll it into view
    if (stepElem.length && optElems.length !== 1) {
      self.log("got something to select");
      self.elem.find(".tcViewPort").scrollTo(stepDesc.id, 250);
    } else if (stepElem.length && optElems.length == 1) {
      self.log("selecting the one element");
      stepDesc.selectedElem = optElems;
      stepDesc.isHidden = true;
      stepElem.hide();
      self.gotoStep(self.currentStep + dir, dir);
    } else {
      self.log("nothing to select ... next");
      stepDesc.isHidden = true;
      stepElem.hide();
      return self.gotoStep(self.currentStep+dir, dir);
    }

    // find out whether there is a non-hidden previous step
    for(i = step-1; i >= 0; i--) {
      if (!self.steps[i].isHidden) {
        foundPrev = true;
      }
    }

    // show/hide navi elems
    if (!foundPrev) {
      self.elem.find(".tcNaviPrev").parent().hide();
    } else {
      self.elem.find(".tcNaviPrev").parent().show();
    }
    if (step === self.steps.length -1) {
      self.elem.find(".tcNaviNext").parent().hide();
      self.elem.find(".tcAbort, .tcSubmit").show();
    } else {
      self.elem.find(".tcNaviNext").parent().show();
      self.elem.find(".tcAbort, .tcSubmit").hide();
    }

    // propagate template selection
    if (step === 2) {// input form step
      if (self.steps[1].selectedElem && self.steps[1].selectedElem.data("topicTemplate")) {
        self.container.find(stepDesc.id).find("input[name='templatetopic']").val(
          self.steps[1].selectedElem.data("topicTemplate")
        );
      }
    }    
    
    // layout toggle
    stepElem.find(".tcLayoutToggle").on("click", function() {
      var $this = $(this),
          visible = $this.find(":visible"),
          hidden = $this.find(":hidden");

      visible.hide();
      hidden.show();
      self.elem.toggleClass("tcListLayout");
      sessionStorage.tcListLayout = self.elem.is(".tcListLayout")?"true":"false";
      stepElem.find("input[type=search],input[type=text]").first().focus();
      return false;
    });

    if (typeof(sessionStorage.tcListLayout) === 'undefined' ? self.elem.is(".tcListLayout") : sessionStorage.tcListLayout == "true") {
      self.elem.addClass("tcListLayout");
      stepElem.find(".tcLayoutToggleList").show();
      stepElem.find(".tcLayoutToggleGrid").hide();
    } else {
      self.elem.removeClass("tcListLayout");
      stepElem.find(".tcLayoutToggleGrid").show();
      stepElem.find(".tcLayoutToggleList").hide();
    }

    // add focus
    window.setTimeout(function() {
      stepElem.find("input[type=search],input[type=text]").first().focus();
    });

    // check for init state
    if (stepElem.data("inited")) {
      self.log("element already inited",stepDesc.id);
      return;
    }
    stepElem.data("inited", 1);
    self.log("init ",stepDesc.id);

    // move selected elemet to start of tcPage
    stepElem.find(".tcPage").each(function() {
      var $page = $(this);
      $page.find(".tcSelected").detach().prependTo($page);
    });

    // add return=submit
    stepElem.find("input[type=text]:not(.jqTextboxList)").on("keyup", function(ev) {
      var form, topic;
      if (ev.key === "Enter") {
        form = stepElem.find("form");
        topic = form.find("input[name=topic]").val();

        if (form.length) {
          if (topic) {
            self.container.block({message:""});
            form.trigger("submit");
          }
        } else {
          self.gotoStep(self.currentStep + 1, 1);
        }
        return false;
      }
    });

    // keyboard
    stepElem.on("keydown", function(ev) {
      var selectedElem = stepElem.find(".tcSelected"),
          pageElem = stepElem.find(".tcPage"),
          pageOffset, nextElemOffset,
          nextElem;

      if (selectedElem.length === 0) {
        return;
      }
      self.log("pressed key",ev.key);
      if (self.elem.is(".tcListLayout")) {
        switch(ev.keyCode) {
          case 32: // space
          case 35: // end
            nextElem = stepElem.find(".tcPage").children(":visible").last();
            break;
          case 36: // pos1
            nextElem = stepElem.find(".tcPage").children(":visible").first();
            break;
          case 39: // right
          case 40: // down
            nextElem = selectedElem.nextAll("div:visible:eq(0)");
            break;
          case 37: // left
          case 38: // up
            nextElem = selectedElem.prevAll("div:visible:eq(0)")
            break;
          case 9: // tab
            ev.preventDefault()
            break;
          case 13: //  return
            selectedElem.trigger("click");
            break;
          default:
        }
      } else {
        switch(ev.keyCode) {
          case 32: // space
          case 35: // end
            nextElem = stepElem.find(".tcPage").children(":visible").last();
            break;
          case 36: // pos1
            nextElem = stepElem.find(".tcPage").children(":visible").first();
            break;
          case 39: // right
            nextElem = selectedElem.nextAll("div:visible:eq(0)");
            break;
          case 40: // down
            nextElem = selectedElem.nextAll("div:visible:eq(2)");
            break;
          case 37: // left
            nextElem = selectedElem.prevAll("div:visible:eq(0)");
            break;
          case 38: // up
            nextElem = selectedElem.prevAll("div:visible:eq(2)");
            break;
          case 9: // tab
            ev.preventDefault()
            break;
          case 13: //  return
            selectedElem.trigger("click");
            break;
          default:
        }
      }

      if (nextElem && nextElem.length) {
        selectedElem.removeClass("tcSelected");
        nextElem.addClass("tcSelected");
        stepDesc.selectedElem = nextElem;

        pageOffset = pageElem.offset();
        nextElemOffset = nextElem.offset();
        if (nextElemOffset.top + nextElem.outerHeight() > pageOffset.top + pageElem.innerHeight() ||
            nextElemOffset.top < pageOffset.top) {
          stepElem.find(".tcPage").scrollTo(nextElem, 250);
        }
        
        return false;
      }
    });


    // select 
    if (stepDesc.select) {
      optElems.on("click", function() {
        var $select = $(this);

        optElems.removeClass("tcSelected");
        $select.addClass("tcSelected");

        stepDesc.selectedElem = $select;
        self.log("selected",$select.data());
        self.gotoStep(self.currentStep + 1, 1);
        return false;
      });
    }

    // filter
    stepElem.find(".tcFilter .foswikiInputField").on("input", function() {
      var pattern = $(this).val().toLowerCase();
        optElems.each(function() {
          var $cell = $(this), text = $cell.text().toLowerCase();
          if (text.indexOf(pattern) >= 0) {
            $cell.show();
          } else {
            $cell.hide();
          }
        });
    });

    // init form
    stepElem.find("form").on("invalid-form", function() {
      self.log("validation failed");
      self.container.unblock();
    });

    // topic
    function _updateSubmitButton() {
      var val = stepElem.find("input[name=topic]").val(),
	  submitButton = self.elem.find(".tcSubmit");

      self.log("topic=",val);
      if (val === '') {
	submitButton.addClass("jqButtonDisabled");
      } else {
	submitButton.removeClass("jqButtonDisabled");
      }
    }
    stepElem.find("input[name=topic]").on("change", _updateSubmitButton);
    _updateSubmitButton();

  };

  /***************************************************************************
   * make it a jQuery plugin
   */
  $.fn.topicCreator = function(opts) {
    return this.each(function() {
      if (!$.data(this, "topicCreator")) {
        $.data(this, "topicCreator", new TopicCreator(this, opts));
      }
    });
  };

  /***************************************************************************
   * enable declarative widget instanziation
   */
  $(function() {
    $(".jqTopicCreator").livequery(function() {
      $(this).topicCreator();
    });
  });

})(jQuery);
/*
 * SubscribeButton
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {
  $(".natSubscribeAction").livequery(function() {
    var $this = $(this),
        opts = $.extend({
            subscribed: false,
            topic: foswiki.getPreference('WEB') + '.' + foswiki.getPreference('TOPIC'),
            subscription: foswiki.getPreference('TOPIC'),
          }, $this.data()
        ),
        subElem = $this.children(".natSubscribeLabel"),
        unsubElem = $this.children(".natUnsubscribeLabel");

    if (opts.subscribed) {
      subElem.hide();
      unsubElem.show();
    } else {
      subElem.show();
      unsubElem.hide();
    }

    $this.on("click", function() {
      $.blockUI();

      foswiki.jsonRpc({
        namespace: "NatSkinPlugin",
        method: (opts.subscribed?"unsubscribe":"subscribe"),
        params: {
          topic: opts.topic,
          subscription: opts.subscription
        },
      }).done(function(response) {
        $.unblockUI();
        $.pnotify({
           title: "Success",
           text: response.result,
           type: 'success'
        });
        if (opts.subscribed) {
          subElem.show();
          unsubElem.hide();
          opts.subscribed = false;
        } else {
          subElem.hide();
          unsubElem.show();
          opts.subscribed = true;
        }
      }).fail(function(xhr) {
        $.unblockUI();
        $.pnotify({
           title: "Error",
           text: xhr.responseJSON.error.message,
           type: 'error'
        });
      });

      return false;
    });
  });
});
/*
 * UserTooltip for NatSkin
 *
 * (c)opyright 2020-2024 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

/*eslint-disable no-console */

"use strict";
(function($) {

  var TooltipCache = {}; // SMELL: make it a class
  var defaults = {
      debug: false,
      ignoreWikiNames: "AdminUser, ProjectContributor, RegistrationAgent, UnknownUser, WikiGuest",
      duration: 200,
      cache: true,
      showDelay: 500,
      hideDelay: 200,
      showEffect:"fadeIn",
      hideEffect: "fadeOut",
      track: false,
      items: "*",
      userTemplate: "user",
      userTemplateDef: "user::tooltip",
      classes: {
        "ui-tooltip": "ui-corner-all ui-widget-shadow ui-user-tooltip"
      },
      position: {
        my: "center top", 
        at: "center bottom+13",
        collision: "flipfit",
        using: function( position, feedback ) {
          var $this = $(this);
          $this.css( position );
          $("<div>").addClass( "ui-arrow" ).prependTo(this);
          $this
            .addClass(feedback.vertical === "top"?"position-bottom":"position-top")
            .addClass(feedback.horizontal === "left" ? "position-right" : feedback.horizontal === "center" ? "position-center":"position-left");
        }
      }
    };

  /***************************************************************************
   * class definition
   */
  function UserTooltip(elem, opts) {
    var self = this;

    self.elem = $(elem);
    self.opts = $.extend({}, defaults, self.elem.data(), opts);
    self.init();
  }

  /***************************************************************************
   * init
   */
  UserTooltip.prototype.init = function() {
    var self = this;

    self.ignoreWikiNames = new RegExp("^("+self.opts.ignoreWikiNames.split(/\s*,\s*/).join("|")+")$");
    self.wikiName = self.opts.wikiName || self.opts.topic || self.elem.attr("href").replace(/^.*\//, "");

    if (self.ignoreWikiNames.test(self.wikiName)) {
      self.log("ignoring ",self.wikiName);
      self.elem.removeClass("jqUserTooltip");
      return;
    }

    self.elem.addClass("jqUserTooltip");

    self.opts.show = self.opts.show || {
      effect: self.opts.showEffect,
      delay: self.opts.showDelay,
      duration: self.opts.duration
    };

    self.opts.hide = self.opts.hide || {
      effect: self.opts.hideEffect,
      delay: self.opts.hideDelay,
      duration: self.opts.duration,
    };

    self.opts.ajax = self.opts.ajax || foswiki.getScriptUrl("rest", "RenderPlugin", "template", {
      topic: foswiki.getPreference("USERSWEB") + "." + self.wikiName,
      name: self.opts.userTemplate,
      expand: self.opts.userTemplateDef,
      render: "on"
    });

    self.opts.content = self.opts.content || function(callback) {
      var content = TooltipCache[self.opts.ajax];

      if (typeof(content) !== 'undefined') {
        self.log("found in cache");
        if (self.isBlocked) {
          self.log("blocking content");
        } else {
          return content;
        }
      }

      $.get(self.opts.ajax).then(function(data) {
        if (self.opts.cache) {
          self.log("setting cache");
          TooltipCache[self.opts.ajax] = data;
        }
        if (self.isBlocked) {
          self.log("blocking no content");
        } else {
          callback(data);
        }
      });
    };

    self.elem.tooltip(self.opts);
    self.updateHandlers();
  };

  /***************************************************************************
   * init
   */
  UserTooltip.prototype.updateHandlers = function() {
    var self = this;

    self.log("updateHandlers");

    // switch off all standard events
    self.elem.off();
   
    // and replace it with hoverIntent wrt opening the tooltip
    self.elem.hoverIntent({
      over: function() {
        self.log("### over");
        self.isBlocked = false;
        self.elem.tooltip("open");
      },
      out: function() {
        // nop
      }
    });

    // close the tooltip on these events
    self.elem.on("tooltipopen", function(ev, ui) {
      self.log("got tooltipopen event");

      // ... when clicking anywhere
      $(document).one("click", function() {
        self.log("closing by document click");
        self.elem.tooltip("close");
      });

      // ... when leaving the tooltip with the mouse
      ui.tooltip.on("mouseleave", function() {
        self.log("closing as leaving the tooltip");
        self.elem.tooltip("close");
      });

      // close all other tooltips once this one has appeared
      $(".jqUserTooltip.inited").not(self.elem).each(function() {
        $(this).tooltip("close");
      });
    
      // after opening this tooltip, erase and reestablish all handlers again
      self.updateHandlers();
    });

    self.elem.on("tooltipclose", function () { 
      /* work around https://bugs.jqueryui.com/ticket/10689 */

      self.log("got tooltipclose event");
      $(".ui-helper-hidden-accessible > *:not(:last)").remove(); 

      self.updateHandlers();
    });
  };

  /***************************************************************************
   * logging
   */
  UserTooltip.prototype.log = function() {
    var self = this, args;

    if (!console || !self.opts.debug) {
      return;
    }

    args = $.makeArray(arguments);
    args.unshift("UT:");
    console.log.apply(console, args);
  };

  /***************************************************************************
   * make it a jQuery plugin
   */
  $.fn.userTooltip = function(opts) {
    return this.each(function() {
      if (!$.data(this, "userTooltip")) {
        $.data(this, "userTooltip", new UserTooltip(this, opts));
      }
    });
  };

  /***************************************************************************
   * enable declarative widget instanziation
   */
  $(function() {
    if (foswiki.getPreference("NatSkin").initUserTooltips) {
      $(".jqUserTooltip:not(.inited), .foswikiUserField:not(.inited)").livequery(function() {
        $(this).addClass("inited").userTooltip();
      });
    } else {
      //console.log("NatSkin is not init'ing userTooltips automatically");
    }
  });

})(jQuery);
