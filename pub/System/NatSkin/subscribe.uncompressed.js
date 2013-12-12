jQuery(function($) {
  $(document).on("click", ".natSubscribeButton", function() {
    var $this = $(this), 
        isSubscribed = $this.is(".state-subscribed"),
        endpoint = foswiki.getPreference("SCRIPTURL")+"/rest/NatSkinPlugin/"+(isSubscribed?"unsubscribe":"subscribe"),
        opts = $.extend({
            web: foswiki.getPreference('WEB'),
            topic: foswiki.getPreference('TOPIC'),
            topicTitle: foswiki.getPreference('TOPIC'),
            subscribeMessage: "Subscribed to ${title}",
            unsubscribeMessage: "Unsubscribed from ${title}",
            timeout: 1000
          }, $this.data()
        );

      $.ajax({
        type: "post",
        dataType: "json",
        url: endpoint,
        data: {
          topic: opts.web+'.'+opts.topic
        },
        error: function(xhr, code, error) {
          alert("Error");
        },
        success: function(data, code, xhr) {
          var msg;

          if (isSubscribed) {
            msg = opts.unsubscribeMessage;
            $this.removeClass("state-subscribed").addClass("state-unsubscribed");
          } else {
            msg = opts.subscribeMessage;
            $this.addClass("state-subscribed").removeClass("state-unsubscribed");
          }

          if (opts.timeout) {
            msg = msg
              .replace(/\$\{topicTitle\}/, opts.topicTitle)
              .replace(/\$\{topic\}/, opts.topic)
              .replace(/\$\{web\}/, opts.web);

            $.blockUI({message:'<h1>'+msg+'</h1>', timeout:opts.timeout});
          }
        }
      });

    return false;
  });
});
