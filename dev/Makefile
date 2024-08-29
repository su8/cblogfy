# The use of GNU/Make in here is to run the most CPU
# intensive tasks such as uglifyjs and lessc in parallel
# utilizing all of the CPU cores

BIN = ./node_modules/.bin
TEMP = ./temp

all: clean

compilehljs:
	@cd $(TEMP)/highlight.js-master && npm install && \
	node 'tools/build.js' :common && \
	cp -r 'build/highlight.pack.js' ../highlight.min.js

minShowdown:
	@cd $(TEMP) && ./uglifyjs --compress --mangle -- \
		'../node_modules/showdown/dist/showdown.js' > ./showdown.min.js

compileES6:
	$(BIN)/rollup --output.format iife -- ${ARG1} | \
		$(BIN)/babel --presets es2015 --plugins array-includes | \
		$(TEMP)/uglifyjs --compress \
		'unused=false,loops=false' --mangle > ${ARG2}

build:
	$(TEMP)/uglifyjs --compress 'unused=false,loops=false' --mangle -- \
		${ARG1} ${ARG2} 'src/post/showdown-highlighting.js' \
		'/tmp/post.js' > ../js/post-engine.min.js

	$(TEMP)/lesshint --config ./css/less/{.lesshintrc,build.less}
	$(TEMP)/lessc ./css/less/build.less '/tmp/cyborg.css'
	$(TEMP)/lesshint --config ./css/less/{.lesshintrc,feed.less}
	$(TEMP)/lessc ./css/less/feed.less ../xml/xml-stylesheet.css
	$(TEMP)/bootlint --disable 'W005' 'src/view/index-dev.html'

clean:
	@rm -rf ./node_modules $(TEMP) /tmp/{*size,*Temp}

.PHONY: minShowdown compilehljs clean compileES6 build
