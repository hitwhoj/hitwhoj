#!/bin/bash
set -e

search() {
  for file in $(find tests | grep .spec.ts$); do
    echo "require(\"$file\");"
  done
}

search | node -r esbuild-register
