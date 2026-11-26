# Updating Lightning Server

Build inside a StartOS packaging workspace with `npm ci` and `make x86 arm`. The original container registry no longer serves this release publicly. The build verifies each historical Atoll package by SHA-256 and uses Start9’s CLI to recover its packaged application image. The two input hashes come from the archives listed in Atoll for 0.2.2:1. This preserves the application’s invoice TLS and settings behavior on both architectures.

For an application update, replace these inputs with a reviewed build of the application source, run a Lightning Address invoice against regtest, and verify existing settings through a package upgrade.
