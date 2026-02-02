#!/bin/bash
# Fix CJS output: rename .js to .cjs and update require paths

DIR="dist/cjs"

# Rename .js.map to .cjs.map first (before renaming .js files)
find "$DIR" -type f -name '*.js.map' -exec sh -c 'mv "$1" "${1%.js.map}.cjs.map"' _ {} \;

# Rename .js to .cjs
find "$DIR" -type f -name '*.js' -exec sh -c 'mv "$1" "${1%.js}.cjs"' _ {} \;

# Update require paths in .cjs files: replace .js" with .cjs"
find "$DIR" -type f -name '*.cjs' -exec sed -i '' 's/\.js"/\.cjs"/g' {} \;

# Update sourceMappingURL comments
find "$DIR" -type f -name '*.cjs' -exec sed -i '' 's/\.js\.map/.cjs.map/g' {} \;
