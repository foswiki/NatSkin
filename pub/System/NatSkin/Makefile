TARGET= \
  $(BUILD_DIR)/BaseStyle.css \
  $(BUILD_DIR)/print.css \
  $(BUILD_DIR)/history.js \
  $(BUILD_DIR)/edit.js \
  $(BUILD_DIR)/login.js \
  $(BUILD_DIR)/rename.js \
  $(BUILD_DIR)/childtopics.js \
  $(BUILD_DIR)/backlinks.js \
  $(BUILD_DIR)/changeform.js \
  $(BUILD_DIR)/polyfills.js \
  $(BUILD_DIR)/groups.js \
  $(BUILD_DIR)/userregistration.js \
  $(BUILD_DIR)/changepassword.js  \
  $(BUILD_DIR)/pkg.js \
  $(BUILD_DIR)/darkmode.js

#  $(BUILD_DIR)/paged.polyfill.js \
#  $(BUILD_DIR)/paged.interface.css 

POLYFILLS_SOURCE= \
  $(LIB_DIR)/array-polyfill.uncompressed.js \
  $(LIB_DIR)/string-polyfill.uncompressed.js \

BASESTYLE_SOURCE=\
  $(SRC_DIR)/reset.uncompressed.css \
  $(SRC_DIR)/base.uncompressed.css \
  $(SRC_DIR)/messages.uncompressed.css \
  $(SRC_DIR)/jquery-ui.uncompressed.css \
  $(SRC_DIR)/flexbox.uncompressed.css \
  $(SRC_DIR)/columns.uncompressed.css \
  $(SRC_DIR)/colors.uncompressed.css \
  $(SRC_DIR)/typography.uncompressed.css \
  $(SRC_DIR)/forms.uncompressed.css \
  $(SRC_DIR)/lists.uncompressed.css \
  $(SRC_DIR)/tables.uncompressed.css \
  $(SRC_DIR)/tinymce.uncompressed.css \
  $(SRC_DIR)/highcharts.uncompressed.css \
  $(SRC_DIR)/vars.uncompressed.css \
  $(SRC_DIR)/highcharts-vars.uncompressed.css \
  $(SRC_DIR)/topiccreator.uncompressed.css

PKG_SOURCE=\
  $(SRC_DIR)/natskin.uncompressed.js \
  $(SRC_DIR)/topiccreator.uncompressed.js \
  $(SRC_DIR)/subscribe.uncompressed.js \
  $(SRC_DIR)/usertooltip.uncompressed.js 

#  $(SRC_DIR)/obfuscator.uncompressed.js \
#  $(SRC_DIR)/vars.uncompressed.js \
	

-include Makefile.include

SUBDIRS=../JazzyNoteTheme ../CustomatoTheme

$(BUILD_DIR)/polyfills.uncompressed.js: Makefile $(POLYFILLS_SOURCE)
	@echo generating $@
	@cat $(POLYFILLS_SOURCE) > $@

$(BUILD_DIR)/BaseStyle.uncompressed.css: Makefile $(BASESTYLE_SOURCE)
	@echo generating $@
	@cat $(BASESTYLE_SOURCE) > $@

$(BUILD_DIR)/pkg.uncompressed.js: Makefile $(PKG_SOURCE)
	@echo generating $@
	@cat $(PKG_SOURCE) > $@

clean: 
	rm -f *.jslint $(BUILD_DIR)/*
