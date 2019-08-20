.PHONY: coverage minor patch test

test:
	npm test

lint:
	npm run lint

coverage:
	npm run coverage

patch: test
	npm version patch -m "Bump version"
	git push origin master --tags
	npm publish

minor: test
	npm version minor -m "Bump version"
	git push origin master --tags
	npm publish
