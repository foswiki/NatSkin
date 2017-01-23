TARGET= \
  BaseStyle.css \
  history.js \
  edit.js \
  login.js \
  natskin.js \
  obfuscator.js \
  print.css \
  rename.js \
  password.js \
  subscribe.js \
  angular.js \
  topiccreator.js \
  topiccreator.css \
  childtopics.js \
  backlinks.js \
  changeform.js

-include Makefile.include

SUBDIRS=../JazzyNoteTheme ../CustomatoTheme

password.uncompressed.js: jen.js password.init.js 
	cat $^ > $@
