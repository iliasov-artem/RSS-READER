
install:
	npm install
lint:
	npx eslint .	
build:
	rm -rf dist
	npm run deploy
	surge ./dist rss-art-il.surge.sh/
