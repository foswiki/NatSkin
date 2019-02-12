TARGET= \
  customato.css \
  customato-base.css \
  customato-colors.css \
  blue.css 

-include ../NatSkin/Makefile.include

customato.uncompressed.css: customato-base.uncompressed.css customato-colors.uncompressed.css
	@echo creating $@ from $^; echo "/* WARNING: THIS IS A DERIVED FILE. DON'T MODIFIY. */" > $@; $(CAT) $^ >> $@

