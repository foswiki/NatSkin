/*
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2018 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.

*/

"use strict";
jQuery(function($) {

  function updateInterface () {
    var modeVal = $('.natBannerModeSettings option:selected').val(),
        isTitleEnabled = $('.natBannerTitleToggle :checked').val() === 'on' ? true : false,
        isPaletteEnabled = $('.natBannerPaletteToggle :checked').val() === 'on' ? true : false,
        isParticlesEnabled = $('.natBannerParticlesToggle :checked').val() === 'on' ? true : false,
        textEffects = $('.natBannerTextEffects select'),
        textEffectVal = textEffects.data('selected');

    // populate textEffects select box
    $.each($.animateCSS.EFFECTS, function(group, effects) {
      var groupElem, 
          groupLabel = group.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(),
          list = [];

      if (!group.match(/Exits/)) {
        groupElem = $("<optgroup>").attr("label", groupLabel).appendTo(textEffects);
        $.each(effects.sort(), function(i, val) {
          if (!val.match(/Out/)) {
            $("<option>"+val+"</option>").prop("selected", textEffectVal === val).appendTo(groupElem);
            list.push(val);
          }
        });

        if (list.length > 1) {
          list = list.join(", ");
          $("<option value='"+list+"'>random "+groupLabel+"</option>").prop("selected", textEffectVal === list).appendTo(groupElem);
        }
      }
    });

    // switch on those that are appropriate for the mode
    $('.natBannerSettings').hide();
    $('.natBannerSettings.show_on_'+modeVal).show();

    if (!isTitleEnabled) {
      $('.natBannerTitleSettings').hide();
    }

    if (modeVal == 'trianglify') {
      if (isPaletteEnabled) {
        $('.jqTrianglifyPaletteSelector').slideDown();
        $('.natBannerSeed').hide();
      } else {
        $('.jqTrianglifyPaletteSelector').slideUp();
        $('.natBannerSeed').show();
        $('.jqTrianglifyPaletteSelector input').prop('checked', false);
      }
    } else {
      if (!isParticlesEnabled) {
        $('.natBannerParticlesSettings').hide();
      }
    }
  }
  $('.natBannerModeSettings select, .natBannerTitleToggle input[type=radio], .natBannerPaletteToggle input[type=radio], .natBannerParticlesToggle input[type=radio]').change(updateInterface);
  updateInterface();
});
