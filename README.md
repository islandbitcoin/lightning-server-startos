# Lightning Server for StartOS

Lightning Server receives Lightning Address payments through LND. Configure the public payment domain and invoice connection in StartOS. See [the operating instructions](instructions.md) for first setup and upgrades.

The application data and address settings live on the main volume. **Configure LND Node** validates the macaroon’s permissions offline with LND’s own parser and checks the TLS certificate before saving both on the separate credentials volume. StartOS backs up both volumes. The daemon receives the validated invoice credential and certificate at startup. It has no mount into the LND package.

The full application image from the previous Atoll release is pinned for both supported architectures. See [the update procedure](UPDATING.md).
