#!/bin/sh

# please execute from root directory
readonly projectName="${1:-inteltank}"
readonly cookie="${2}"
readonly userName="${3:-sawachin}"

for partition in  `seq 0 225`
do
  echo $partition
  node ./src/app.js $cookie $projectName $userName $partition
done

