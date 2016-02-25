"use strict";
jQuery(function($) {
  var prefs = foswiki.getPreference("NatSkinEdit");

  $('.natDisplayComments').change(function() {
    var val = $(this).val();
    if (val == 'on') {
      $('#cmtPreferences').fadeIn();
    } else {
      $('#cmtPreferences').fadeOut();
    }
  });

  function setVariations() {
    var style = jQuery('#style').val(),
        varSelect = jQuery('#variation'),
        variation, selected, i;

    varSelect.empty()
        .append("<option value='undefined'>default</option>")
        .append("<option value='none'>none</option>");

    if (prefs.knownVariations[style]) {
      varSelect.removeAttr('disabled');

      for (i = 0; i < prefs.knownVariations[style].length; i++) {
        variation = prefs.knownVariations[style][i],
        selected = variation == prefs.selectedVariation ? 'selected':'';
        varSelect.append('<option '+selected+'>'+prefs.knownVariations[style][i]+'</option>');
      }
    } else {
      varSelect.attr('disabled', 'disabled');
    }
  }

  jQuery('#style').change(function() {
    setVariations();
  }).change();

});

