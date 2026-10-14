# ---------------------------------------------------------
# Smarter Chat for Google Tag Manager. See README.md and CLAUDE.md.
# ---------------------------------------------------------
SHELL := /bin/bash
# The developer's shell may export NODE_ENV=production, which makes npm skip devDependencies.
NPM_INSTALL := npm install --include=dev

.PHONY: all init test lint format embed-version clean pre-commit-run help

all: help

init:
	$(NPM_INSTALL)
	pre-commit install

test:
	npm test

lint:
	npm run lint

format:
	npm run format

# make embed-version V=0.9.1
embed-version:
	npm run embed-version -- $(V)

pre-commit-run:
	pre-commit run --all-files

clean:
	rm -rf node_modules coverage

help:
	@echo '===================================================================='
	@echo 'Smarter Chat for Google Tag Manager'
	@echo '===================================================================='
	@echo 'init            - npm dev dependencies, pre-commit hooks'
	@echo 'test            - Vitest: the scenarios, the sandbox lint, the sections'
	@echo 'lint            - ESLint and Prettier'
	@echo 'embed-version   - the default embed script: make embed-version V=0.9.1'
	@echo 'clean           - remove dependencies and build output'
