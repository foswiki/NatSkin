"use strict";!function(e){function n(){var n=e(".natBannerModeSettings option:selected").val(),t=e(".natBannerContentToggle :checked").val(),a="on"===e(".natBannerPaletteToggle :checked").val(),o="on"===e(".natBannerCssToggle :checked").val(),r="linear"===e(".natBannerGradientTypeToggle :checked").val(),i="radial"===e(".natBannerGradientTypeToggle :checked").val(),l="on"===e(".natBannerParticlesToggle :checked").val();e(".natBannerSettings").hide(),""!==n&&"off"!==n&&(e(".natBannerSettings.show_on_"+n).show(),e(".natBannerSettings.show_on_all").show(),e(".natBannerContentSettings.show_on_"+t).show(),e(".natBannerSettings.hide_on_"+n).hide(),e(".natBannerContentSettings.hide_on_"+t).hide().find("input[type=radio]").prop("checked",!1)),o?e(".natBannerCssSettings").fadeIn():e(".natBannerCssSettings").hide(),"trianglify"===n?a?(e(".jqTrianglifyPaletteSelector").slideDown(),e(".natBannerSeed").hide()):(e(".jqTrianglifyPaletteSelector").slideUp(),e(".natBannerSeed").show(),e(".jqTrianglifyPaletteSelector input").prop("checked",!1)):(l||e(".natBannerParticlesSettings").hide(),r||e(".natBannerGradientDegree").hide(),i||e(".natBannerGradientPosition").hide())}function t(){var t=e(".natBannerTextEffects select"),a=t.data("selected");e.each(e.animateCSS.EFFECTS,(function(n,o){var r,i=n.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase().replace(/ entrances/,""),l=[];n.match(/Exits/)||(r=e("<optgroup>").attr("label",i).appendTo(t),e.each(o.sort(),(function(n,t){e("<option>"+t+"</option>").prop("selected",a===t).appendTo(r),l.push(t)})),l.length>1&&(l=l.join(", "),e("<option value='"+l+"'>random "+i+"</option>").prop("selected",a===l).appendTo(r)))})),e(".natBannerModeSettings select, .natBannerCssToggle input[type=radio], .natBannerContentToggle input[type=radio], .natBannerPaletteToggle input[type=radio], .natBannerParticlesToggle input[type=radio], .natBannerGradientTypeToggle input[type=radio]").on("change",n),n(),e(".natSortOptions").each((function(){var n,t,a;n=e(this),t=n.children("option"),(a=t.map((function(n,t){var a=e(t);return{text:a.text(),val:a.val(),sel:a.prop("selected")}})).get()).sort((function(e,n){var t=e.text.toLowerCase(),a=n.text.toLowerCase();return""===e.val?-1:""===n.val||t>a?1:t<a?-1:0})),t.each((function(n,t){e(t).val(a[n].val).text(a[n].text).prop("selected",a[n].sel)}))}))}e((function(){t()}))}(jQuery);
