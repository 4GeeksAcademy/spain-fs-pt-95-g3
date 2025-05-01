#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

rm -rf migrations/
./database.sh

pipenv run upgrade
