# !/bin/bash
# v14.18.0
if ! node -v | grep -Fxq "v16.9.1"; then
    # Source nvm first
    . ~/.nvm/nvm.sh
    nvm use
fi
npx tsc --build --clean && npx tsc && caffeinate -i node ./dist/index.js