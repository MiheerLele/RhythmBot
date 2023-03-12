# !/bin/bash
if ! node -v | grep -Fxq "v14.18.0"; then
    # Source nvm first
    . ~/.nvm/nvm.sh
    nvm use
fi
npx tsc --build --clean && npx tsc && caffeinate -i node ./dist/index.js