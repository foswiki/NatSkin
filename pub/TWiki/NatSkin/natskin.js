// (c)opyright 2006-2009 Michael Daum http://michaeldaumconsulting.com
$(function() {
  /* move revinfo */
  if (true) {
    var target = $(".natMain h1:first");
    if (target.length) { 
      $(".natRevision").remove().insertAfter(target);
    }
  }

  /* horiz menu */
  if (true) {
    $(".natWebButtonsContents > ul").
      superfish({}).
      find("li:has(ul)").
      addClass("hasSubMenu");
    $(".natWebButtonsContents").css('display', 'block');
  }

  /* add overflow div for tables */
  if (true) { 
    $(".natMainContents .twikiTable, .natMainContents .foswikiTable")
      .not($(".twikiTable .twikiTable, .foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow'></div>");
  }

  /* tooltips */
  if (true) {
    /* tooltip img previews */
    $(".natAttachmentName a").each(function() {
      if ($(this).attr('href').match(/jpe?g|gif|png|bmp/i)) {
        $(this).tooltip({
          delay:350,
          track:true,
          showURL:false,
          bodyHandler: function() { 
            var img = $("<img/>").attr({
              src: this.href
            }); 
            return $("<div class='imgTooltip'></div>").append(img);
          }
        });
      }
    });
  }

  if (true) { // topicaction tooltips 
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

  if (true) { // remove empty attachment comments
    $("#natTopicAttachments .natAttachmentComment").each(function(){
      var text = $(this).text();
      //alert("text='"+text+"' char="+text.charCodeAt(0));
      if ((text.length == 1 && text.charCodeAt(0) == 160)) {
        $(this).hide();
      }
    });
  }

}); 
