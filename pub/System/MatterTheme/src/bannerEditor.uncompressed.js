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

/*global StrikeOne:false */

"use strict";
jQuery(function($) {
  if ($.browser.msie) {
    if (console) {
      console.warn("banner editor disabled in internet explorer"); // eslint-disable-line no-console
    }
    return;
  }

  $(".natBannerVideo").on("click", function() {
    var $this = $(this),
        vid = $this.find("video").get(0);

    if (!vid || $this.is(".natBannerEditing")) {
      return;
    }

    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }

    return false;
  });

  $(".natBannerEditable:not(.natBannerEditableInited)").each(function() {
    var $this = $(this), 
        useTopPos = $this.is(".natBannerVideo")?true:false,
        cssProperty = useTopPos ? "top": "background-position-y",
        $target = useTopPos?$this.find("video"):$this.children().first(),
        height = $this.innerHeight(),
        match, 
        bounced = false,
        $buttons = $("<div class='natBannerButtons' />").appendTo($this).hide(),
        $saveButton = $("<a class='natBannerSaveButton'><i class='fa fa-floppy-o'></i></a>").appendTo($buttons),
        $cancelButton = $("<a class='natBannerCancelButton'><i class='fa fa-ban'></i></a>").appendTo($buttons),
        origVal,
        prevTop = 0,
        newVal = 0,
        unit = '%'; // or px

    $this.addClass("natBannerEditableInited");

    if (!$target.length) {
      return;
    }

    $saveButton.on("click", function() {
      var keyElem = $("input[name=validation_key]:first"), keyVal;
      if (typeof(StrikeOne) !== 'undefined' && keyElem.length > 0) {
        keyVal = StrikeOne.calculateNewKey(keyElem.val());
      }
      $buttons.fadeOut();
      bounced = false;
      $this.removeClass("natBannerEditing");
      $.blockUI({message:"<h1>"+$.i18n("Saving ...")+"</h1>"});
      $.ajax({
        url: foswiki.getScriptUrl("rest", "NatEditPlugin", "save"), 
        type: "post",
        data : {
          topic: foswiki.getPreference("WEB") + "." + foswiki.getPreference("TOPIC"),
          "Local+NATSKIN_BANNERPOSITION": Math.round(newVal),
          "validation_key": keyVal
        }
      }).then(function(status, text, xhr) {
        var nonce = xhr.getResponseHeader('X-Foswiki-Validation');
        if (nonce) {
          // patch in new nonce
          keyElem.val("?" + nonce);
        }
        $.unblockUI();
      }).fail(function() {
        alert("ERROR: saving banner property");
      });
      return false;
    });

    $cancelButton.on("click", function() {
      $target.css(cssProperty, origVal);
      $buttons.fadeOut();
      bounced = false;
      $this.removeClass("natBannerEditing");
      return false;
    });

    match = $target.css(cssProperty).match(/([+-]?\d+(?:\.\d+)?)(%|px)/);
    if (match) {
      newVal = parseInt(match[1], 10) || 0;
      unit = match[2] || '%';
    }

    if (unit === 'px') {
      newVal = Math.round(newVal / height * 100);
    }
    origVal = newVal + '%';

    //console.log("cssProperty=",cssProperty,"newVal=",newVal,"height=",height);

    $this.draggable({
      cursor: "s-resize",
      axis: "y",
      scroll: false,
      drag: function(ev, ui) {

        newVal += (ui.position.top - prevTop) / height * 100 * (useTopPos?1:-1) * 0.5;
        prevTop = ui.position.top;

        $target.css(cssProperty, newVal+'%');
        //console.log("newVal=",newVal);
        ui.position.top = 0;
      },
      start: function() {
        if (!bounced) {
          $buttons.show().effect("bounce");
          bounced = true;
          $this.addClass("natBannerEditing");
        }
      },
      stop: function() {
        prevTop = 0;
      }
    });
  });
});

