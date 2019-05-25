#!/bin/sh

cd ./mockus-client
echo "#### Deleting old build folder"
rm -rf build/
echo "#### Installing client dependencies"
npm i --silent
echo "#### Building client"
npm run build --silent
cd ../mockus-server
echo "#### Deleting old build & compiled files"
rm -rf build/
rm -rf lib/
echo "#### Installing server dependencies"
npm i
echo "#### Compiling server code"
npm run tsc
echo "#### Copying client output to server folder"
cp ../mockus-client/build/ ./build/ -r
echo "#### Removing development node_modules folder"
rm -rf node_modules
echo "#### Installing production node_modules"
npm i --production
