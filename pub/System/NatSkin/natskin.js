// (c)opyright 2006-2009 Michael Daum http://michaeldaumconsulting.com

// document ready
(function($) {$(function() {

  /* ie6 png transperency fix for img tags */
  if ($.browser.msie && $.browser.version < 7) {
    window.setTimeout(function() {
      $("img[src$='png']").each(function () {
        var img = $(this);
        var width = img.width() || 16;
        var height = img.height() || 16;
        //alert(width);
        img.css({
          "width": width,
          "height": height, 
          "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.attr("src") + "', sizingMethod='scale')"
        });
        img.attr("src", foswiki.pubUrlPath+"/"+foswiki.systemWebName+"/NatSkin/blank.gif");
      });
    }, 10);
  }

  /* move revinfo */
  if (foswiki.NatSkin.fixRevisionPosition) {
    var target = $(".natMain h1:first");
    if (target.length) { 
      $(".natRevision").remove().insertAfter(target);
    }
  }

  /* horiz menu */
  if (foswiki.NatSkin.initWebButtons) {
    $(".natWebButtonsContents > ul").superfish({}).
      find("li:has(ul)").addClass("hasSubMenu");
    $(".natWebButtonsContents").css('display', 'block');
  }

  /* add overflow div for tables */
  if (foswiki.NatSkin.initOverflows) { 
    $(".natMainContents .foswikiTable")
      .not($(".foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow foswikiTableOverflow'></div>");
  }

  /* tooltips */
  if (foswiki.NatSkin.initTooltips && !$.browser.msie) { /* IE6 and IE7 are too buggy for this feature */
    /* tooltip img previews */
    $(".natAttachmentName a").each(function() {
      if ($(this).attr('href').match(/jpe?g|gif|png|bmp/i)) {
        $(this).tooltip({
          delay:350,
          track:true,
          showURL:false,
          bodyHandler: function() { 
            var src = this.href;
            var data = $(this).metadata();
            if (foswiki.ImagePluginEnabled && data) {
              src = foswiki.scriptUrlPath+"/rest/ImagePlugin/resize?"+
                "topic="+data.web+"."+data.topic+";"+
                "file="+data.image+";"+
                "width="+(data.width||300)+";"+
                "height="+(data.height||300)
            }
            var img = $("<img/>").attr('src', src);
            return $("<div class='imgTooltip'></div>").append(img);
          }
        });
      }
    });
  }

  if (foswiki.NatSkin.initTopicActions) { // topicaction tooltips 
    var $tipContainer = $("#natTopicActionTooltip");
    var $topicActions = $("#natTopicActions");
    //$tipContainer.width($topicActions.width());
    //$tipContainer.css('margin-bottom', $topicActions.height());
    $topicActions.hover(
      function() { 
        $tipContainer.fadeIn('slow').css('display', 'inline');
      },
      function() { 
        $tipContainer.html('').css('display', 'none');
      }
    );
    $topicActions.find("a").each(function() {
      var tip = $(this).text();
      //var tip = $(this).attr('title');
      $(this).hover(
        function() { 
          $tipContainer.html(tip);
        },
        function() { 
          //
        }
      );
    });
  }

  if (true) { // set the MakeVisibles and MakeHiddens
    $(".foswikiMakeVisible, .foswikiMakeVisibleInline").css("display", "inline");
    $(".foswikiMakeVisibleBlock").css("display", "block");
    $(".foswikiMakeHidden").css("display", "none");
  }

  if (true) { // remove empty attachment comments
    $("#natTopicAttachments .natAttachmentComment").each(function(){
      var text = $(this).text();
      //alert("text='"+text+"' char="+text.charCodeAt(0));
      if ((text.length == 1 && text.charCodeAt(0) == 160)) {
        $(this).hide();
      }
    });
  }

  if (foswiki.NatSkin.initSideBar) { // typographic improvements in sidebar
    $('.natSideBar h2 + h2').each(function() {
      $(this).replaceWith('<h3>'+$(this).text()+'</h3>');
    });
  }

});}(jQuery));
