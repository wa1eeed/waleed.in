#!/usr/bin/env bash
set -e
git add .
git commit -m "Update CV site" || echo "Nothing to commit"
git push origin main
echo "Pushed. GitHub Pages will publish to https://waleed.in shortly."
