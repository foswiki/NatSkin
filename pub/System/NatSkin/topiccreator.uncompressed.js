/*
 * topic creator for natskin 0.99
 *
 * (c)opyright 2015 Michael Daum http://michaeldaumconsulting.com
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function($) {
"use strict";

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
    }, self.elem.data(), opts);

    //self.log("new TopicCreator", self);

    // navigation
    self.elem.find(".tcNavi").on("click", function() {
      var target = $(this).attr("href");
      if (target == '#next') {
        self.gotoStep(self.currentStep+1, 1);
      } else if (target == '#prev') {
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
      self.container.block();
      self.elem.find("form").submit();
      return false;
    });

    // first page
    self.gotoStep(0);
  }

  /***************************************************************************
   * logging
   */
  TopicCreator.prototype.log = function() {
    var self = this,
      args = $.makeArray(arguments);

    args.unshift("TC:");
    $.log.apply(self, args);
  };

  /***************************************************************************
   * goto a step in the list
   */
  TopicCreator.prototype.gotoStep = function(step, dir) {
    var self = this, params = {},
        stepDesc = self.steps[step], i;

    self.log("called gotoStep",step);

    if (step < 0 || step > self.steps.length || typeof(stepDesc) === 'undefined') {
      //console.error("unknown step "+step);
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

    // step 0: remove previous pages 
    if (step == 0 || dir < 0) {
      for (i = step; i < self.steps.length; i++) {
        // remove dynamically loaded pages
        if (self.steps[i].expand) {
          self.log("removing ",self.steps[i].id);
          self.elem.find(self.steps[i].id).remove();
          delete self.steps[i].selectedElem;
        }
      };
    }

    // load it async'ly if there is an "expand" property and it isn't there yet
    if (stepDesc.expand && self.container.find(stepDesc.id).length == 0) {
      self.container.block();
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

      //console.log("loading params=",params);

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
        stepElem = self.container.find(stepDesc.id);

    // scroll it into view
    if (self.container.find(stepDesc.id).length) {
      self.elem.find(".tcViewPort").scrollTo(stepDesc.id, 250);
    } else {
      return self.gotoStep(self.currentStep+dir, dir);
    }

    // show/hide navi elems
    if (step == 0) {
      self.elem.find(".tcNaviPrev").hide();
    } else {
      self.elem.find(".tcNaviPrev").show();
    }
    if (step == self.steps.length -1) {
      self.elem.find(".tcNaviNext").hide();
      self.elem.find(".tcAbort, .tcSubmit").show();
    } else {
      self.elem.find(".tcNaviNext").show();
      self.elem.find(".tcAbort, .tcSubmit").hide();
    }

    // propagate template selection
    if (step == 2) {// input form step
      if (self.steps[1].selectedElem && self.steps[1].selectedElem.data("topicTemplate")) {
        self.container.find(stepDesc.id).find("input[name='templatetopic']").val(
          self.steps[1].selectedElem.data("topicTemplate")
        );
      }
    }    

    // add focus
    stepElem.find("input[type=text]:first").focus();
    
    // add return=submit
    stepElem.find("input[type=text]:not(.jqTextboxList)").on("keyup", function(ev) {
      if (ev.keyCode == 13) {
        self.container.block();
        self.elem.find("form").submit();
        return false;
      }
    });

    // check for init state
    if (stepElem.data("inited")) {
      self.log("element already inited",stepDesc.id);
      return;
    }
    stepElem.data("inited", 1);

    self.log("init ",stepDesc.id);


    // select 
    if (stepDesc.select) {
      stepElem.find(stepDesc.select).on("click", function() {
        var $select = $(this);

        stepElem.find(stepDesc.select).removeClass("tcSelected");
        $select.addClass("tcSelected");

        stepDesc.selectedElem = $select;
        self.log("selected",$select.data());
        self.gotoStep(self.currentStep + 1, 1);
        return false;
      });
    }

    // filter
    stepElem.find("input.tcFilter").on("keyup", function() {
      var pattern = $(this).val().toLowerCase();

        stepElem.find(stepDesc.select).each(function() {
          var $cell = $(this), text = $cell.text().toLowerCase();
          if (text.indexOf(pattern) >= 0) {
            $cell.show();
          } else {
            $cell.hide();
          }
        });
    });

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
