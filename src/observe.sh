#!/bin/bash

# if you input command line argument,
# the argument is reflected in. 
readonly SOURCE_PATH="src/${1:-app.ts}"
readonly OUTPUT_PATH="dist/${1:-app.ts}"

if which fswatch > /dev/null 2>&1 ; then
  echo "start observation $SOURCE_PATH"
  fswatch -0 $SOURCE_PATH | while read -d "" event; do
    echo "1. compile logs---------------------------"
    tsc
    echo "2. compiled ---------------------------"
    cat $OUTPUT_PATH 
    echo "3. executed ---------------------------"
    node $OUTPUT_PATH
  done
else
  echo "fswatch is not found."
fi
