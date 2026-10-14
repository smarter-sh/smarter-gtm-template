# ---------------------------------------------------------
# Smarter Chat for Google Tag Manager. See README.md and CLAUDE.md.
# ---------------------------------------------------------
SHELL := /bin/bash
# The developer's shell may export NODE_ENV=production, which makes npm skip devDependencies.
NPM_INSTALL := npm install --include=dev
PYTHON := python3
VENV := venv

.PHONY: all init test coverage lint format embed-version clean pre-commit-run help

all: help

# pre-commit, in a Python virtual environment of the repository: see requirements/local.txt.
init:
	$(NPM_INSTALL)
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements/local.txt
	$(VENV)/bin/pre-commit install
	@echo 'Activate the Python virtual environment, for pre-commit and codespell: source $(VENV)/bin/activate'

test:
	npm test

coverage:
	npm run coverage

lint:
	npm run lint

format:
	npm run format

# make embed-version V=0.9.1
embed-version:
	npm run embed-version -- $(V)

pre-commit-run:
	$(VENV)/bin/pre-commit run --all-files

clean:
	rm -rf node_modules coverage $(VENV)

help:
	@echo '===================================================================='
	@echo 'Smarter Chat for Google Tag Manager'
	@echo '===================================================================='
	@echo 'init            - npm dev dependencies, pre-commit and its hooks (in venv/)'
	@echo 'test            - Vitest: the scenarios, the sandbox lint, the sections'
	@echo 'coverage        - the tests, with a coverage report of the template code'
	@echo 'lint            - ESLint and Prettier'
	@echo 'embed-version   - the default embed script: make embed-version V=0.9.1'
	@echo 'clean           - remove dependencies and build output'
