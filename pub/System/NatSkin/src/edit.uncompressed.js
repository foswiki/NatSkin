/*
 * NatEdit addons
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {
  var prefs = foswiki.getPreference("NatSkinEdit");

  $('.natDisplayComments').on("change", function() {
    var val = $(this).val();
    if (val == 'on') {
      $('#cmtPreferences').fadeIn();
    } else {
      $('#cmtPreferences').fadeOut();
    }
  });

  function updateVariations() {
    var selectedStyle = $('#style').val(),
        variationElem = $('#variation');

    variationElem.empty().append("<option value='undefined'>default</option>")

    $("<option value='none'>none</option>").prop("selected", prefs.selectedVariation === "none")
      .appendTo(variationElem);

    if (prefs.knownVariations[selectedStyle]) {
      variationElem.prop('disabled', false);

      $.each(prefs.knownVariations[selectedStyle], function(i, variation) {
        $('<option>' + variation + '</option>').prop("selected", prefs.selectedVariation === variation)
          .appendTo(variationElem);
      });
    } else {
      variationElem.val("undefined");
    }
  }

  $('#style').on("change", function() {
    updateVariations();
  });

  updateVariations();
});

