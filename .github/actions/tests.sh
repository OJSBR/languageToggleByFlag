#!/bin/bash

set -e

npx cypress run  --headless --browser chrome  --config '{"specPattern":["plugins/blocks/languageToggleByFlag/cypress/tests/functional/*.cy.js"]}'
