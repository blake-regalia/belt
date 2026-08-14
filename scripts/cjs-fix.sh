#!/bin/bash
# Fix CJS output: rename .js to .cjs and update require paths

DIR="dist/cjs"

# Rename .d.ts.map to .d.cts.map first
find "$DIR" -type f -name '*.d.ts.map' -exec sh -c 'mv "$1" "${1%.d.ts.map}.d.cts.map"' _ {} \;

# Rename .d.ts to .d.cts
find "$DIR" -type f -name '*.d.ts' -exec sh -c 'mv "$1" "${1%.d.ts}.d.cts"' _ {} \;

# Rename .js.map to .cjs.map first (before renaming .js files)
find "$DIR" -type f -name '*.js.map' -exec sh -c 'mv "$1" "${1%.js.map}.cjs.map"' _ {} \;

# Rename .js to .cjs
find "$DIR" -type f -name '*.js' -exec sh -c 'mv "$1" "${1%.js}.cjs"' _ {} \;

# Update require paths
find "$DIR" -type f \( -name '*.cjs' -o -name '*.d.cts' \) -exec sed -i.bak -e 's/\.js"/\.cjs"/g' -e "s/\.js'/\.cjs'/g" {} \; -exec rm '{}.bak' \;

# Update sourceMappingURL comments
find "$DIR" -type f -name '*.cjs' -exec sed -i.bak 's/\.js\.map/.cjs.map/g' {} \; -exec rm '{}.bak' \;

# Update source map filenames
find "$DIR" -type f -name '*.cjs.map' -exec sed -i.bak 's/"file":"\([^"]*\)\.js"/"file":"\1.cjs"/' {} \; -exec rm '{}.bak' \;

# Update declaration sourceMappingURL comments
find "$DIR" -type f -name '*.d.cts' -exec sed -i.bak 's/\.d\.ts\.map/.d.cts.map/g' {} \; -exec rm '{}.bak' \;

# Update declaration map filenames
find "$DIR" -type f -name '*.d.cts.map' -exec sed -i.bak 's/\.d\.ts"/.d.cts"/g' {} \; -exec rm '{}.bak' \;
