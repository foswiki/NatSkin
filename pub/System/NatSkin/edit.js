(function($) {
  function setPermission(type, rules) {
    $.log("EDIT: called setPermission()");
    $(".permset_"+type).each(function() { 
      $(this).val("undefined");
    });
    for (var key in rules) {
      var val = rules[key];
      $.log("EDIT: setting #"+key+"_"+type+"="+val); 
      $("#"+key+"_"+type).val(val);
    }
  }

  function switchOnDetails(type) {
    $("#details_"+type+"_container").slideDown(300);
    var names = [];
    $("input[name='Local+PERMSET_"+type.toUpperCase()+"_DETAILS']").each(function() {
      var val = $(this).val();
      if (val && val != '') 
        names.push(val);
    });
    names = names.join(', ');
    $.log("EDIT: switchOnDetails - names="+names);
    setPermission(type, {
      allow: names
    });
  }

  function switchOffDetails(type) {
    $("#details_"+type+"_container").slideUp(300);
    setPermission(type, {
      allow: ""
    });
  }

  function setPermissionSet(permSet) {
    $.log("EDIT: called setPermissionSet "+permSet);
    switch(permSet) {
      /* change rules */
      case 'default_change':
        switchOffDetails("change");
        setPermission("change", {
        });
        break;
      case 'nobody_change':
        switchOffDetails("change");
        setPermission("change", {
          allow: ' ',
          deny: undefined
        });
        break;
      case 'registered_users_change':
        switchOffDetails("change");
        setPermission("change", {
          deny: foswiki.wikiName
        });
        break;
      case 'just_author_change':
        switchOffDetails("change");
        setPermission("change", {
          allow: foswiki.wikiName
        });
        break;
      case 'details_change':
      case 'details_change_toggle':
        switchOnDetails("change");
        break;
      /* view rules */
      case 'default_view':
        switchOffDetails("view");
        setPermission("view");
        break;
      case 'everybody_view':
        switchOffDetails("view");
        setPermission("view", {
          deny: ' '
        });
        break;
      case 'nobody_view':
        switchOffDetails("view");
        setPermission("view", {
          allow: ' ',
          deny: undefined
        });
        break;
      case 'registered_users_view':
        switchOffDetails("view");
        setPermission("view", {
          deny: foswiki.wikiName
        });
        break;
      case 'just_author_view':
        switchOffDetails("view");
        setPermission("view", {
          allow: foswiki.wikiName
        });
        break;
      case 'details_view':
      case 'details_view_toggle':
        switchOnDetails("view");
        break;
      default:
        alert("unregistered permission-set '"+permSet+"'");
        break;
    };
  }

  $(function() {
    if (0) { /* debugging */
      $(".permset_view, .permset_change").each(function() {
        $(this).wrap("<div></div>").parent().prepend("<b>"+$(this).attr('name')+": </b>");
      });
    }
    $("#details_change, #details_view").textboxlist({
      onSelect: function(input) {
        var currentValues = input.currentValues;
        $.log("EDIT: currentValues="+currentValues);
        var type = (input.opts.inputName=="Local+PERMSET_CHANGE_DETAILS")?"change":"view";
        setPermission(type, {
          allow: currentValues.join(", ")
        });
      },
      autocomplete:foswiki.scriptUrl+"/view/"+foswiki.systemWebName+"/JQueryAjaxHelper?section=user;contenttype=text/plain;skin=text",
      autocompleteOpts: {
        autoFill: false,
        matchCase: false,
        multiple: true,
        formatItem: function(row, index, max, search) {
          return "<table width='100%'><tr><td width='60px'><img width='50' src='"+row[2]+"' /></td><td>"+row[0]+"<br />"+row[1]+"</td></tr></table>";
        }
      }
    });
    $("input[type=radio], input[type=checkbox]").click(function() {
      $(this).blur();
    });
    $("#permissionsForm input[type=radio]").click(function() {
      setPermissionSet($(this).attr('id'));
    });
  });
})(jQuery);

