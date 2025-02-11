TARGET=\
  $(BUILD_DIR)/matter.css \
  $(BUILD_DIR)/topmenuVariation.css \
  $(BUILD_DIR)/profile.css \
  $(BUILD_DIR)/bannerEditor.js \
  $(BUILD_DIR)/bannerSettings.js \
  $(BUILD_DIR)/geopattern.js \
  $(BUILD_DIR)/particles.js \
  $(BUILD_DIR)/parallax.js \
  $(BUILD_DIR)/trianglify.js

TRIANGLIFY_SOURCE=\
  $(LIB_DIR)/trianglify.uncompressed.js\
  $(SRC_DIR)/trianglify.init.uncompressed.js

PARTICLES_SOURCE=\
  $(LIB_DIR)/particles.uncompressed.js\
  $(SRC_DIR)/particles.init.uncompressed.js

GEOPATTERN_SOURCE=\
  $(LIB_DIR)/geopattern.uncompressed.js \
  $(SRC_DIR)/geopattern.init.uncompressed.js \

MATTERSTYLE_SOURCE=\
  $(SRC_DIR)/base.uncompressed.css \
  $(SRC_DIR)/jquery-ui.uncompressed.css \
  $(SRC_DIR)/forms.uncompressed.css \
  $(SRC_DIR)/comments.uncompressed.css \
  $(SRC_DIR)/vars.uncompressed.css 

-include ../NatSkin/Makefile.include

.PHONY: geopattern.git trianglify.git particles.git git clean

clean: 
	rm -f $(BUILD_DIR)/* 

$(BUILD_DIR)/matter.css: $(MATTERSTYLE_SOURCE)
	@echo generating $@; cat $^ | $(CSSMIN) $(CSSMIN_ARGS)> $@

$(BUILD_DIR)/particles.js: $(PARTICLES_SOURCE)
	@echo generating $@; $(JSMIN) $^ > $@; \

$(BUILD_DIR)/geopattern.js: $(GEOPATTERN_SOURCE)
	@echo generating $@; $(JSMIN) $^ > $@; \

$(BUILD_DIR)/trianglify.js: $(TRIANGLIFY_SOURCE)
	@echo generating $@; $(JSMIN) $^ > $@; \

git: geopattern.git trianglify.git particles.git

geopattern.git:
	@if test -d geopattern.git; then \
	  cd geopattern.git && git pull; \
	else \
	  git clone https://github.com/btmills/geopattern.git geopattern.git; \
	fi

trianglify.git:
	@if test -d trianglify.git; then \
	  cd trianglify.git && git pull; \
	else \
	  git clone https://github.com/qrohlf/trianglify.git trianglify.git; \
	fi

particles.git:
	@if test -d particles.git; then \
	  cd particles.git && git pull; \
	else \
	  git clone https://github.com/marcbruederlin/particles.js.git particles.git; \
	fi

ifneq (,$(wildcard geopattern.git))
$(LIB_DIR)/geopattern.uncompressed.js: geopattern.git/js/geopattern.js
	@echo getting $@ from geopattern
	@cp $< $@ 

geopattern.git/js/geopattern.js:
	@echo getting $@ from geopattern.git
	@cd geopattern.git && npm install && browserify -s GeoPattern -i buffer . > js/geopattern.js
endif

ifneq (,$(wildcard trianglify.git))
$(LIB_DIR)/trianglify.uncompressed.js: trianglify.git/dist/trianglify.bundle.js
	@echo getting $@ from trianglify.git
	@cp $< $@ 
endif

ifneq (,$(wildcard particles.git))
$(LIB_DIR)/particles.uncompressed.js: particles.git/src/particles.js
	@echo getting $@ from particles.git
	@cp $< $@ 
endif
