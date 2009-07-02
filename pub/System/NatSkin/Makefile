TARGET= \
  attach.js \
  BaseBorder.css \
  BaseButtons.css \
  BaseStyle.css \
  BaseThin.css \
  BlueNoteBorder.css \
  BlueNoteButtons.css \
  BlueNoteStyle.css \
  BlueNoteThin.css \
  print.css \
  natskin.js \
  obfuscator.js


GZIP=gzip


.SUFFIXES: .js .css

all: $(TARGET) $(TARGET:.js=.js.gz) $(TARGET:.css=.css.gz)

%.gz: %
	@echo compressing $< to $@
	@$(GZIP) -c $< > $@
