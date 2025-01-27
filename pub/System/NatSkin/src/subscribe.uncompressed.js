/*
 * SubscribeButton
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {
  $(".natSubscribeAction").livequery(function() {
    var $this = $(this),
        opts = $.extend({
            subscribed: false,
            topic: foswiki.getPreference('WEB') + '.' + foswiki.getPreference('TOPIC'),
            subscription: foswiki.getPreference('TOPIC'),
          }, $this.data()
        ),
        subElem = $this.children(".natSubscribeLabel"),
        unsubElem = $this.children(".natUnsubscribeLabel");

    if (opts.subscribed) {
      subElem.hide();
      unsubElem.show();
    } else {
      subElem.show();
      unsubElem.hide();
    }

    $this.on("click", function() {
      $.blockUI();

      foswiki.jsonRpc({
        namespace: "NatSkinPlugin",
        method: (opts.subscribed?"unsubscribe":"subscribe"),
        params: {
          topic: opts.topic,
          subscription: opts.subscription
        },
      }).done(function(response) {
        $.unblockUI();
        $.pnotify({
           title: "Success",
           text: response.result,
           type: 'success'
        });
        if (opts.subscribed) {
          subElem.show();
          unsubElem.hide();
          opts.subscribed = false;
        } else {
          subElem.hide();
          unsubElem.show();
          opts.subscribed = true;
        }
      }).fail(function(xhr) {
        $.unblockUI();
        $.pnotify({
           title: "Error",
           text: xhr.responseJSON.error.message,
           type: 'error'
        });
      });

      return false;
    });
  });
});
