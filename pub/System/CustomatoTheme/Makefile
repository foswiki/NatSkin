TARGET= \
  customato.css \
  customato-base.css \
  customato-colors.css \
  customato.js

-include ../NatSkin/Makefile.include

customato.uncompressed.css: customato-base.uncompressed.css customato-colors.uncompressed.css
	@echo creating $@ from $^; $(CAT) $^ > $@

