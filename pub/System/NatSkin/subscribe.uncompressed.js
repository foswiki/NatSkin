jQuery(function($) {
  $(document).on("click", ".natSubscribeButton", function() {
    var $this = $(this), 
        endpoint = foswiki.getPreference("SCRIPTURL")+"/rest/SubscribePlugin/subscribe",
        isSubscribed = $this.is(".state-subscribed"),
        opts = $.extend({
            subscribeTopic: foswiki.getPreference('WEB')+'.'+foswiki.getPreference('TOPIC'),
            subscriber: foswiki.getPreference('WIKINAME')
          }, $this.data()
        );

      $.ajax({
        type: "post",
        dataType: "json",
        url: endpoint,
        data: {
          topic: opts.subscribeTopic,
          subscriber: opts.subscriber,
          subscribe_remove: isSubscribed?1:0
        },
        error: function(xhr, code, error) {
          alert("Error");
        },
        success: function(data, code, xhr) {
          $(".natSubscribeButton").each(function() {
            var $this = $(this);
            if (isSubscribed) {
              $this.removeClass("state-subscribed").addClass("state-unsubscribed");
            } else {
              $this.addClass("state-subscribed").removeClass("state-unsubscribed");
            }
          });
        }
      });

    return false;
  });
});
