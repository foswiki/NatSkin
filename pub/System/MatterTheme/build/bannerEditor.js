"use strict";jQuery((function(n){n.browser.msie?console&&console.warn("banner editor disabled in internet explorer"):(n(".natBannerVideo").on("click",(function(){var e=n(this),a=e.find("video").get(0);if(a&&!e.is(".natBannerEditing"))return a.paused?a.play():a.pause(),!1})),n(".natBannerEditable:not(.natBannerEditableInited)").each((function(){var e,a,t=n(this),i=!!t.is(".natBannerVideo"),o=i?"top":"background-position-y",s=i?t.find("video"):t.children().first(),r=t.innerHeight(),d=!1,c=n("<div class='natBannerButtons' />").appendTo(t).hide(),l=n("<a class='natBannerSaveButton'><i class='fa fa-floppy-o'></i></a>").appendTo(c),p=n("<a class='natBannerCancelButton'><i class='fa fa-ban'></i></a>").appendTo(c),u=0,f=0,g="%";t.addClass("natBannerEditableInited"),s.length&&(l.on("click",(function(){var e,a=n("input[name=validation_key]:first");return"undefined"!=typeof StrikeOne&&a.length>0&&(e=StrikeOne.calculateNewKey(a.val())),c.fadeOut(),d=!1,t.removeClass("natBannerEditing"),n.blockUI({message:"<h1>"+n.i18n("Saving ...")+"</h1>"}),n.ajax({url:foswiki.getScriptUrl("rest","NatEditPlugin","save"),type:"post",data:{topic:foswiki.getPreference("WEB")+"."+foswiki.getPreference("TOPIC"),"Local+NATSKIN_BANNERPOSITION":Math.round(f),validation_key:e}}).then((function(e,t,i){var o=i.getResponseHeader("X-Foswiki-Validation");o&&a.val("?"+o),n.unblockUI()})).fail((function(){alert("ERROR: saving banner property")})),!1})),p.on("click",(function(){return s.css(o,a),c.fadeOut(),d=!1,t.removeClass("natBannerEditing"),!1})),(e=s.css(o).match(/([+-]?\d+(?:\.\d+)?)(%|px)/))&&(f=parseInt(e[1],10)||0,g=e[2]||"%"),"px"===g&&(f=Math.round(f/r*100)),a=f+"%",t.draggable({cursor:"s-resize",axis:"y",scroll:!1,drag:function(n,e){f+=(e.position.top-u)/r*100*(i?1:-1)*.5,u=e.position.top,s.css(o,f+"%"),e.position.top=0},start:function(){d||(c.show().effect("bounce"),d=!0,t.addClass("natBannerEditing"))},stop:function(){u=0}}))})))}));
