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
      $(".jqUserTooltip:not(.inited), .foswikiUserField:not(.inited):not(.foswikiTopicFieldEditor").livequery(function() {
        $(this).addClass("inited").userTooltip();
      });
    } else {
      //console.log("NatSkin is not init'ing userTooltips automatically");
    }
  });

})(jQuery);
