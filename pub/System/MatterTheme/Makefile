TARGET=\
  matter.css \
  topmenuVariation.css \
  bannerEditor.js \
  bannerSettings.js \
  geopattern.js \
  geopattern.init.js \
  trianglify.js \
  trianglify.init.js \
  particles.js \
  particles.init.js

-include ../NatSkin/Makefile.include

.PHONY: geopattern.git trianglify.git clean

clean: 
	rm -f $(TARGET) *.gz

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
geopattern.uncompressed.js: geopattern.git/js/geopattern.js
	@echo getting $@ from geopattern
	@cp $< $@ 

geopattern.git/js/geopattern.js:
	@echo getting $@ from geopattern.git
	@cd geopattern.git && npm install && browserify -s GeoPattern -i buffer . > js/geopattern.js
endif

ifneq (,$(wildcard trianglify.git))
trianglify.js: trianglify.git/dist/trianglify.min.js
	@echo getting $@ from trianglify.git
	@cp $< $@ 
endif

ifneq (,$(wildcard particles.git))
particles.uncompressed.js: particles.git/src/particles.js
	@echo getting $@ from particles.git
	@cp $< $@ 
endif
