(function($){var lastElem;function toggleAttachmentEditor(elem,state){if(lastElem&&lastElem!=elem){toggleAttachmentEditor(lastElem,'off');}
var $elemStep=$(elem).parents(".foswikiFormStep");var $editor=$elemStep.find(".natAttachmentEditor");var $comment=$elemStep.find(".natAttachmentComment");var text=$editor.find("textarea").text();if(state=='off'){$editor.slideUp('fast');if(!isEmptyComment($comment)){$comment.show();}
lastElem='';}else{lastElem=elem;if($editor.is(":visible")){if(!isEmptyComment($comment)){$comment.show();}}else{$comment.hide();}
$editor.slideToggle('fast');}}
function isEmptyComment($comment){var text=$comment.text();return text.length==1&&text.charCodeAt(0)==160;}
$(function(){$("#main").validate();$(".natAttachEdit").click(function(){toggleAttachmentEditor(this);return false;});});})(jQuery);