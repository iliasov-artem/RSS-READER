
install:
	npm install
lint:
	npx eslint .	
build:
	npm run deploy
	surge ./dist rss-art-il.surge.sh/
