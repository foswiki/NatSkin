/*
 * topic creator for natskin 1.10
 *
 * (c)opyright 2015-2019 Michael Daum http://michaeldaumconsulting.com
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
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

    // cancel button
    self.elem.find(".tcAbort").on("click", function() {
      $(this).parents(".ui-dialog-content:first").dialog("close");
      return false;
    });

    // submit button
    self.elem.find(".tcSubmit").on("click", function() {
      var topic = self.elem.find("input[name=topic]").val();
      if (topic !== '' && !$(this).is(".jqButtonDisabled")) {
	self.container.block({message:""});
	self.elem.find("form").submit();
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
    stepElem.find(".tcLayoutToggle:not(.inited)").on("click", function() {
      var $this = $(this).addClass("inited"),
          visible = $this.find(":visible"),
          hidden = $this.find(":hidden");

      visible.hide();
      hidden.show();
      self.elem.toggleClass("tcListLayout");
      sessionStorage.tcListLayout = self.elem.is(".tcListLayout")?"true":"false";
      stepElem.find("input[type=text]:first").focus();
      return false;
    });

    if (sessionStorage.tcListLayout == "true" || self.elem.is(".tcListLayout")) {
      self.elem.addClass("tcListLayout");
      stepElem.find(".tcLayoutToggleList").show();
      stepElem.find(".tcLayoutToggleGrid").hide();
    }

    // add focus
    window.setTimeout(function() {
      stepElem.find("input[type=text]:first").focus();
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
      if (ev.keyCode === 13) {
        form = stepElem.find("form");
        topic = form.find("input[name=topic]").val();

        if (form.length) {
          if (topic) {
            self.container.block({message:""});
            form.submit();
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
      self.log("pressed key",ev.keyCode);
      if (self.elem.is(".tcListLayout")) {
        switch(ev.keyCode) {
          case 32: // space
          case 39: // right
          case 40: // down
            nextElem = selectedElem.nextAll("div:eq(0)");
            break;
          case 37: // left
          case 38: // up
            nextElem = selectedElem.prevAll("div:eq(0)")
            break;
          case 9: // tab
            ev.preventDefault()
            break;
          default:
        }
      } else {
        switch(ev.keyCode) {
          case 32: // space
          case 39: // right
            nextElem = selectedElem.nextAll("div:eq(0)");
            break;
          case 40: // down
            nextElem = selectedElem.nextAll("div:eq(2)");
            break;
          case 37: // left
            nextElem = selectedElem.prevAll("div:eq(0)");
            break;
          case 38: // up
            nextElem = selectedElem.prevAll("div:eq(2)");
            break;
          case 9: // tab
            ev.preventDefault()
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
    stepElem.find(".tcFilter .foswikiInputField").on("keyup", function() {
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
  $(".jqTopicCreator:not(.jqInitedTopicCreator)").livequery(function() {
    $(this).addClass("jqInitedTopicCreator").topicCreator();
  });

})(jQuery);
