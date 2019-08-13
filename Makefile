.PHONY: publish-patch test

test:
	node_modules/.bin/tape test/*.js | node_modules/.bin/tap-spec && npm run test-ts

test-ts:
	node_modules/.bin/if-node-version '>= 8' node_modules/.bin/tsd

test-all: test test-ts

patch: test
	npm version patch -m "Bump version"
	git push origin master --tags
	npm publish

minor: test
	npm version minor -m "Bump version"
	git push origin master --tags
	npm publish
