#!/bin/sh
set -eu
cd "$(dirname "$0")"
mkdir -p inputs
work=$(mktemp -d ./inputs/build.XXXXXX)
trap 'rm -rf "$work"' EXIT
extract() {
    arch=$1
    target=$2
    checksum=$3
    name="lightning-server_${arch}.s9pk"
    curl -fsSL --retry 2 "https://github.com/islandbitcoin/lightning-server-startos/releases/download/v0.2.2/$name" -o "$work/$name"
    (cd "$work" && echo "$checksum  $name" | shasum -a 256 -c -)
    start-cli s9pk inspect "$work/$name" cat "images/$arch/lightning-server.squashfs" > "$work/$target.squashfs"
    mv "$work/$target.squashfs" "inputs/$target.squashfs"
}
extract x86_64 amd64 06c8aaf139956e00cadd97881d4aa30a346b151ad50d7ac5ff35dd59886d7c89
extract aarch64 arm64 897f6a34394d7da82015addb88ff792912532b2daaf2be7856eb726acba2de92
