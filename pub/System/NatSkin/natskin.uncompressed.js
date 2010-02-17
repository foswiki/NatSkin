// (c)opyright 2006-2010 Michael Daum http://michaeldaumconsulting.com

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
    var $container = $(".natWebButtonsContents");
    $container.children("ul").superfish({
      autoArrows: false
    }).find("li:has(ul)").addClass("hasSubMenu");
    $container.removeClass('natWebButtonsHidden');
  }

  /* add overflow div for tables */
  if (foswiki.NatSkin.initOverflows) { 
    $(".natMainContents .foswikiTable")
      .not($(".foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow foswikiTableOverflow'></div>");
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

  if (true) { // add foswikiFormLast to last form step
    $(".foswikiFormSteps").each(function() {
      var $this = $(this);
      $this.find(".foswikiFormStep:last").addClass("foswikiFormLast");
      $this.find(".foswikiFormStep:first").addClass("foswikiFormFirst");
    });
  }

  if (false) { // add foswikiLast to last row of a foswikiTable/foswikiLayoutTable/foswikiNullTable
    $(".foswikiLayoutTable, .foswikiTable, .foswikiNullTable").each(function() {
      var $this = $(this);
      $this.find("tr:last").addClass("foswikiLast");
      $this.find("tr:first").addClass("foswikiFirst");
    });
  }

  if (foswiki.NatSkin.initSideBar) { // typographic improvements in sidebar
    $('.natSideBar h2 + h2').not(".jqInited").each(function() {
      var $this = $(this);
      $this.addClass('.jqInited');
      $this.replaceWith('<h3>'+$(this).text()+'</h3>');
    });
  }

  if (foswiki.NatSkin.initRedDot) { // helpers for mysidebar reddots
    $('.natMySideBarRedDot').not('.jqInited').each(function() {
      var $this = $(this);
      $this.addClass('.jqInited');
      $this.hide();
      $this.parent().hover(
        function() {
          $this.fadeIn(300, function() {
            $this.css({opacity: 1.0});
          });
        },
        function() {
          $this.stop();
          $this.css({display:'none', opacity: 1.0});  
        });
    });
  }

  if (foswiki.NatSkin.initAutocomplete) {// autocompletion using solr 
    var currentTerm;
    var $input = $("#searchbox input[type=text]");
    $input.autocomplete(foswiki.scriptUrl+'/rest/SolrPlugin/terms?ellipsis=on&length=5', {
      selectFirst: false,
      autoFill:false,
      matchCase:true,
      matchSubset:false,
      matchContains:false,
      scrollHeight:'20em',
      formatItem: function(row, index, max, value, term) {
        currentTerm = row[2];
        return row[1];
      },
      highlight: function(value, term) {
        term = currentTerm;
        return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
      }
    });
  }

  if (foswiki.NatSkin.initSearchBox) { 
    $(".natSearchBox form").each(function() {
      var $this = $(this);
      var $input = $this.find("input[type=text]");
      var color = $input.css('color');
      var options = $.extend( {
          title:'Search'
        }, $input.metadata());
      if (options.color) {
	$input.css('color', options.color);
      }

      $input.blur(function() {
        if ($input.val() == '') {
          $input.val(options.title);
	  if (options.color) {
	    $input.css('color', options.color);
	  }
        }
      });
      $input.focus(function() {
        if ($input.val() == options.title) {
          $input.val('');
          $input.css('color', color);
        }
      });
      $this.submit(function() {
        if ($input.val() == options.title) {
          $input.val('');
        }
      });
    });
  }

});}(jQuery));
