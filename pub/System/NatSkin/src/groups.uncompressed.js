/*
 * WikiGroups
 *
 * (c)opyright 2006-2023 Michael Daum http://michaeldaumconsulting.com
 *
 * Licensed under the GPL license http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
jQuery(function($) {

  /* create group form */
  $('.createGroupForm').on("submit", function() {
    var $this = $(this),
        groupName = $this.find('input[name=topic]').val();
    $this.find('.allowTopicChange').val(groupName);
  });

  /* add member form */
  $(".addMemberForm").on("submit", function() {
    var $this = $(this),
        membersElem = $this.find(".groupMembers"),
        members = membersElem.val().split(/\s*,\s*/),
        userNames = $this.find("[name=username]").val().split(/\s*,\s*/);

    $.each(userNames, function(i, val) {
      var user = foswiki.normalizeWebTopicName(foswiki.getPreference("USERSWEB"), val);
      val = user[1] || val;
      if (members.indexOf(val) < 0 ) {
        members.push(val);
      }
    });

    members = members.filter(function(el) {
      return typeof(el) !== 'undefined' && el !== '';
    }).sort();

    membersElem.val(members.join(", "));
  });

  /* remove member form */
  $('.removeMemberForm').each(function() {
    var $this = $(this);

    // hide-show submit button
    $this.find('input[type="checkbox"]').on("change", function() {
      if ($this.find('input[type="checkbox"]:checked').length) {
        $('.removeButton').fadeIn();
      } else {
        $('.removeButton').hide();
      }
    });
  });

  $('.removeButton').on("click", function() {
    $('.removeMemberForm').trigger("submit");
    return false;
  });

  $(".removeMemberForm").on("submit", function() {
    var $this = $(this),
        membersElem = $this.find(".groupMembers"),
        members = membersElem.val().split(/\s*,\s*/),
        userNames = $this.find("[name=username]:checked").map(function() { return this.value}).get(),
        newMembers = [];

    newMembers = members.filter(function(val) {
      var user = foswiki.normalizeWebTopicName(foswiki.getPreference("USERSWEB"), val);
      val = user[1] || val;
      return val !== '' && userNames.indexOf(val) < 0;
    }).sort();

    membersElem.val(newMembers.join(", "));
  });
});
