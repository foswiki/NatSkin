/*
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2018-2023 Foswiki Contributors. Foswiki Contributors
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
(function($) {

  function sortOptions (elem) {
    var options = elem.children("option"),
        arr = options.map(function(_, o) { 
          var $o = $(o);
          return { 
            text: $o.text(), 
            val: $o.val(),
            sel: $o.prop("selected")
          }; 
        }).get();

    arr.sort(function(o1, o2) {
      var t1 = o1.text.toLowerCase(), 
          t2 = o2.text.toLowerCase();
      if (o1.val === '') {
        return -1;
      }
      if (o2.val === '') {
        return 1;
      }
      return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
    });

    options.each(function(i, o) {
      $(o).val(arr[i].val)
        .text(arr[i].text)
        .prop("selected", arr[i].sel);
    });
  }

  function updateInterface () {
    var bannerMode = $('.natBannerModeSettings option:selected').val(),
        contentMode = $('.natBannerContentToggle :checked').val(),
        isPaletteEnabled = $('.natBannerPaletteToggle :checked').val() === 'on' ? true : false,
        isRawCssEnabled = $('.natBannerCssToggle :checked').val() === 'on' ? true : false,
        isLinearGradient = $('.natBannerGradientTypeToggle :checked').val() === 'linear' ? true : false,
        isRadialGradient = $('.natBannerGradientTypeToggle :checked').val() === 'radial' ? true : false,
        isParticlesEnabled = $('.natBannerParticlesToggle :checked').val() === 'on' ? true : false;

    // switch on those that are appropriate for the mode
    $('.natBannerSettings').hide();
    if (bannerMode !== '' && bannerMode !== 'off') {
      $('.natBannerSettings.show_on_'+bannerMode).show();
      $('.natBannerSettings.show_on_all').show();
      $('.natBannerContentSettings.show_on_'+contentMode).show();
      $('.natBannerSettings.hide_on_'+bannerMode).hide();
      $('.natBannerContentSettings.hide_on_'+contentMode).hide().find("input[type=radio]").prop("checked", false);
    }

    //console.log("bannerMode=",bannerMode,"contentMode=",contentMode);
    if (isRawCssEnabled) {
      $(".natBannerCssSettings").fadeIn();
    } else {
      $(".natBannerCssSettings").hide();
    }

    if (bannerMode === 'trianglify') {
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
      if (!isLinearGradient) {
        $('.natBannerGradientDegree').hide();
      }
      if (!isRadialGradient) {
        $('.natBannerGradientPosition').hide();
      }
    }

  }

  function init() {
    var textEffects = $('.natBannerTextEffects select'),
        textEffectVal = textEffects.data('selected');

    // populate textEffects select box
    $.each($.animateCSS.EFFECTS, function(group, effects) {
      var groupElem, 
          groupLabel = group.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/ entrances/, ""),
          list = [];

      if (!group.match(/Exits/)) {
        groupElem = $("<optgroup>").attr("label", groupLabel).appendTo(textEffects);
        $.each(effects.sort(), function(i, val) {
          $("<option>"+val+"</option>").prop("selected", textEffectVal === val).appendTo(groupElem);
          list.push(val);
        });

        if (list.length > 1) {
          list = list.join(", ");
          $("<option value='"+list+"'>random "+groupLabel+"</option>").prop("selected", textEffectVal === list).appendTo(groupElem);
        }
      }
    });
    $('.natBannerModeSettings select, .natBannerCssToggle input[type=radio], .natBannerContentToggle input[type=radio], .natBannerPaletteToggle input[type=radio], .natBannerParticlesToggle input[type=radio], .natBannerGradientTypeToggle input[type=radio]').on("change", updateInterface);
    updateInterface();

    $(".natSortOptions").each(function() {
      sortOptions($(this));
    });
  }

  // on dom ready
  $(function() {
    init();
  });

})(jQuery);
