// (c)opyright 2006-2010 Michael Daum http://michaeldaumconsulting.com

// document ready
jQuery(function($) {

  /* ie6 png transperency fix for img tags */
  if ($.browser.msie && $.browser.version < 7) {
    window.setTimeout(function() {
      $("img[src$='png']").livequery(function () {
        var img = $(this);
        var width = img.width() || 16;
        var height = img.height() || 16;
        //alert(width);
        img.css({
          "width": width,
          "height": height, 
          "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.attr("src") + "', sizingMethod='scale')"
        });
        img.attr("src", foswiki.getPreference("PUBURLPATH")+"/"+foswiki.getPreference("SYSTEMWEB")+"/NatSkin/blank.gif");
      });
    }, 10);
  }

  /* move revinfo */
  if (foswiki.getPreference("NatSkin.fixRevisionPosition") == 'true') {
    var target = $(".natMain h1:first");
    if (target.length) { 
      $(".natRevision").remove().insertAfter(target);
    }
  }

  /* horiz menu */
  if (foswiki.getPreference("NatSkin.initWebMenu") == 'true') {
    var $container = $(".natWebMenuContents");
    $container.children("ul").superfish({
      autoArrows: false
    }).find("li:has(ul)").addClass("hasSubMenu");
    $container.removeClass('natWebMenuHidden');
    if ($.browser.msie) {
      $container.css('display', 'block');
    }
  }

  /* add overflow div for tables */
  if (foswiki.getPreference("NatSkin.initOverflows") == 'true') { 
    $(".natMainContents").find(".foswikiTable, .DISui-jqgrid")
      .not($(".foswikiTable .foswikiTable", this))
      .wrap("<div class='overflow foswikiTableOverflow'></div>");
  }

  if (foswiki.getPreference("NatSkin.initTopicActions") == 'true') { // topicaction tooltips 
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
      var $this = $(this);
      var tip = $this.text() || $this.attr('title');
      $this.hover(
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
    $("#natTopicAttachments .natAttachmentComment").livequery(function(){
      var text = $(this).text();
      //alert("text='"+text+"' char="+text.charCodeAt(0));
      if ((text.length == 1 && text.charCodeAt(0) == 160)) {
        $(this).hide();
      }
    });
  }

  if (true) { // add foswikiFormLast to last form step
    $(".foswikiFormSteps").livequery(function() {
      var $this = $(this);
      $this.children(".foswikiFormStep:last").addClass("foswikiFormLast");
      $this.children(".foswikiFormStep:first").addClass("foswikiFormFirst");
    });
  }

  if (false) { // add foswikiLast to last row of a foswikiTable/foswikiLayoutTable/foswikiNullTable
    $(".foswikiLayoutTable, .foswikiTable, .foswikiNullTable").livequery(function() {
      var $this = $(this);
      $this.find("tr:last").addClass("foswikiLast");
      $this.find("tr:first").addClass("foswikiFirst");
    });
  }

  if (foswiki.getPreference("NatSkin.initSideBar") == 'true') { // typographic improvements in sidebar
    $('.natSideBar h2 + h2:not(.jqInitedSideBar)').livequery(function() {
      var $this = $(this);
      $this.addClass('jqInitedSideBar');
      $this.replaceWith('<h3>'+$this.html()+'</h3>');
    });
  }

/*
  if (0) {// autocompletion using solr for topic names
    var currentTerm;
    var $input = $("#searchbox input[type=text]");
    var width = $("#searchbox").width()-7;
    $input.autocomplete(foswiki.getPreference("SCRIPTURL")+'/rest/SolrPlugin/terms?ellipsis=on&length=5', {
      selectFirst: false,
      autoFill:false,
      matchCase:true,
      matchSubset:false,
      matchContains:false,
      scrollHeight:'20em',
      width:width,
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
*/

  if (foswiki.getPreference("NatSkin.initAutocomplete") == 'true') {// autocompletion using solr 
    var $input = $("#searchbox input[type=text]"),
        width = $("#searchbox").width()-7;

    $input.autocomplete(foswiki.getPreference("SCRIPTURL")+'/rest/SolrPlugin/autocomplete', {
      selectFirst: false,
      autoFill:false,
      matchCase:false,
      matchSubset:false,
      matchContains:false,
      scrollHeight:'20em',
      width:width,
      formatItem: function(row, index, max, search) {
        return "<table width='100%'><tr><td>"+row[0]+"</td><td align='right'>"+row[2]+"</td></tr></table>";
      }
    }).bind("beforeSearch", function() {
      $input.parent().find(".foswikiSubmit").hide();
    }).bind("afterSearch" ,function() {
      $input.parent().find(".foswikiSubmit").show();
    });
  }

  if (foswiki.getPreference("NatSkin.initSearchBox") == 'true') { 
    $(".natSearchBox form").livequery(function() {
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
        var $submit = $this.find(".foswikiSubmit");
        var spinner = foswiki.getPreference("PUBURLPATH")+"/"+foswiki.getPreference("SYSTEMWEB")+"/JQueryPlugin/images/spinner.gif";
        $submit.blur().css({
          'background': 'url('+spinner+') no-repeat 50% 50% transparent'
        });
        if ($input.val() == options.title) {
          $input.val('');
        }
      });
    });
  }

  // raw dialog
  $(".natRawTopicAction").click(function() { 
    $.blockUI({
      message:"<h1>Loading wiki text ...</h1>",
      fadeIn: 0,
      fadeOut: 0
    });
    foswiki.openDialog("#natPreviewRaw", {
      persist:false, 
      close:false, 
      containerCss: {
        width:800
      },
      onShow: function(dialog) { 
        var web = foswiki.getPreference("WEB"),
            topic = foswiki.getPreference("TOPIC"),
            url = foswiki.getPreference("SCRIPTURL")+"/"+ 
                  web+"/"+topic;

        $.unblockUI();
        dialog.container.find(".topic").text(web.replace(/\//, ".")+"."+topic);
        dialog.container.find(".separate").attr("target", "_blank").click(function() {
          $.modal.close();
        });

        $.ajax({
          url: url,
          data: {
            "raw":"text",
            "skin":"text"
          },
          async:false,
          dataType:"text",
          success: function(data, status, xhr) {
            var $textarea = dialog.container.find(".foswikiTextarea");
            $textarea.text(data);
            setTimeout(function() { $textarea.focus(); }, 100);
          }
        });
      } 
    }); 
    return false; 
  }); 

});
