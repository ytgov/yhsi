#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  # Production migrations will run separately, before the application is deployed.
  # exec node ./dist/index.js
  printf '%s\n' "Production boot via boot-app.sh is disabled." >&2
  exit 1
else
  npm run initializers
  npm run start
fi
