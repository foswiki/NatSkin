TARGET= \
  $(BUILD_DIR)/customato.css \
  $(BUILD_DIR)/blue.css 

CUSTOMATOSTYLE_SOURCE=\
  $(SRC_DIR)/base.uncompressed.css \
  $(SRC_DIR)/colors.uncompressed.css \
  $(SRC_DIR)/vars.uncompressed.css 

-include ../NatSkin/Makefile.include

clean: 
	rm -f $(TARGET) *.gz *jslint igp_*

$(BUILD_DIR)/customato.uncompressed.css: $(CUSTOMATOSTYLE_SOURCE)
	@echo generating $@
	@cat $^ > $@
