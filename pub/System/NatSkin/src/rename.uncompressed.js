/*
 * Rename 
 *
 * (c)opyright 2008-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";

jQuery(function($) {
  var $form = $("form[name='rename']");

  function updateWikifyNewTopic() {
    var $target = $("input[name='newtopic']"),
        $source = $("#topictitle");
        
    if ($("#wikifynewtopic").prop("checked")) {
      $target.prop("disabled", true);
      $target.wikiword({
        source: "#topictitle",
        transliterate: true
      });
    } else {
      $target.prop("disabled", false);
      $source.unbind();
    }
  }

  function updateRestoreTopic() {
    var $this = $("#restoretopic"), 
        $newTopicElem = $form.find("[name=newtopic]"),
        $newWebElem = $form.find("[name=newweb]"),
        web, topic;

    if ($this.prop("checked")) {
      [web, topic] = foswiki.normalizeWebTopicName("", $this.val());
      $newTopicElem.data("origVal", $newTopicElem.val());
      $newWebElem.data("origVal", $newWebElem.val());
    } else {
      web = $newWebElem.data("origVal");
      topic = $newTopicElem.data("origVal");
    }

    if (topic) {
      $newTopicElem.val(topic);
    }

    if (web) {
      $newWebElem.select2("val", web);
    }
  }

  $(".natRenameSetAll").on("click", function() {
    $(this).parents("form:first").find("input[name=referring_topics]").prop('checked', true);
    return false;
  });
  $(".natRenameClearAll").on("click", function() {
    $(this).parents("form:first").find("input[name=referring_topics]").prop('checked', false);
    return false;
  });

  $("#wikifynewtopic").on("change", function() {
    updateWikifyNewTopic();
  });

  $("#restoretopic").on("change", function() {
    updateRestoreTopic();
  });

  updateWikifyNewTopic();
  updateRestoreTopic();

  $form.on("submit", function() {
    $("input[name='newtopic']").prop("disabled", false);
    return true;
  });

});
