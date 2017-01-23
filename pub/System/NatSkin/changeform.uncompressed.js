"use strict";
jQuery(function($) {
  var $formlist = $("#formlist"), 
      selectClass = "checked";

  function update() {
    $formlist.find(".row").removeClass(selectClass);
    $formlist.find("input:checked").parents(".row:first").addClass(selectClass);
  }

  $formlist.find(".row").on("click", function() {
    update($(this));
  }).mouseenter(function() {
    $(this).addClass("hover");
  }).mouseleave(function() {
    $(this).removeClass("hover");
  });
  update();
});
