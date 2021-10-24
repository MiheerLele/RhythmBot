#!/bin/bash
if ! node -v | grep -Fxq "v14.18.0"; then
    # Source nvm first
    . ~/.nvm/nvm.sh
    nvm use
fi
npx tsc --build --clean && npx tsc && node ./dist/index.js