#!/bin/bash

SCRIPT_ROOT=`pwd`
PUBLIC_FOLDER=public
COMPILED_FOLDER=markdown/compiled

echo "[INFO] Entering" $COMPILED_FOLDER
pushd $COMPILED_FOLDER "$@" > /dev/null

for FILENAME in *; do \
  echo -n "[INFO]" $FILENAME;
  cp -r $FILENAME $SCRIPT_ROOT/public
  sync
  echo " =======>" $PUBLIC_FOLDER/$FILENAME
done

echo "[INFO] Leaving" $COMPILED_FOLDER
popd "$@" > /dev/null
