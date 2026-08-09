#!/bin/zsh
cd "$(dirname "$0")"
./scripts/dev-server.sh start
open "http://localhost:3000"
echo "The local site is running. Keep this window open while you test it."
tail -f .local/fields-of-mistria-dev.log
