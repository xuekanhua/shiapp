#! /bin/bash

JS_PATH=/home/shig/shiapp/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js
find $JS_PATH_SRC -type f -name '*.js' | sort

cd ..
pwd
echo yes | python3 manage.py collectstatic
cd scripts


