#!/bin/bash

SCRIPT_ROOT=`pwd`

MD_FOLDER=markdown
COMPILED_FOLDER=compiled
CSS=default.css
PAGES_FOLDER=pages
IMG_FOLDER=img

PREC_FOLDER=precompiled
HEAD=head.html
BEFORE=before.html
AFTER=after.html

LOG_FOLDER=$SCRIPT_ROOT/logs/pandoc

PAGE_FILENAMES=( enroll index science )

PANDOC_FLAGS="--from=markdown \
--smart \
--to=html5 \
--highlight-style=haddock \
--mathjax \
--css=$CSS \
--include-in-header=$PREC_FOLDER/$HEAD \
--include-before-body=$PREC_FOLDER/$BEFORE \
--include-after-body=$PREC_FOLDER/$AFTER"

echo "[INFO] Entering" $MD_FOLDER/$PAGES_FOLDER
pushd $MD_FOLDER/$PAGES_FOLDER "$@" > /dev/null

echo "[INFO] Running pandoc" `pandoc --version | head -n 1 | cut -d' ' -f 2` # "with flags" $PANDOC_FLAGS

date >> $LOG_FOLDER/compile_pages.log

for FILENAME in ${PAGE_FILENAMES[@]}; do \
    echo -n "[INFO]" $FILENAME.md
    pandoc $PANDOC_FLAGS $FILENAME.md -o ../$COMPILED_FOLDER/$FILENAME.html 2>> $LOG_FOLDER/compile_pages.log;
    rc=$?;
    if [[ $rc != 0 ]];
      then \
      echo " =======X"
      echo "[ERROR] Pandoc error, refer to log:" $LOG_FOLDER/compile_pages.log;
      echo "[ERROR] Leaving" $MD_FOLDER/$PAGES_FOLDER
      popd "$@" > /dev/null;
      exit $rc;
    fi
    echo " =======>" ../$COMPILED_FOLDER/$FILENAME.html;
done

echo -n "[INFO]" $IMG_FOLDER
cp -r $IMG_FOLDER ../$COMPILED_FOLDER
echo " =======>" ../$COMPILED_FOLDER/$IMG_FOLDER;
sync

echo "Success" >> $LOG_FOLDER/compile_pages.log

echo "[INFO] Leaving" $MD_FOLDER/$PAGES_FOLDER
popd "$@" > /dev/null

echo -n "[INFO]" $CSS "====";
cp $MD_FOLDER/$CSS $MD_FOLDER/$COMPILED_FOLDER
echo $"===>" $COMPILED_FOLDER/$CSS
