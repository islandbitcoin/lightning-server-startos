# Lightning Server

Self-hosted Lightning Address server with Nostr zap receipts and payment notifications.

## What is Lightning Server?

Lightning Server enables you to receive **Lightning Address** payments at `you@yourdomain.com`. It connects to your LND node via gRPC to generate BOLT11 invoices, publishes **Nostr zap receipts** (NIP-57), and sends **email** and **push notifications** for every payment received.

**Key features:**

- **Lightning Address**: LNURL-pay endpoints at `/.well-known/lnurlp/:user`
- **Nostr Zap Receipts**: automatically publishes kind 9735 zap receipts to relays
- **Payment Notifications**: HTML email + Pushover push alerts
- **Multi-user**: configure multiple Lightning Addresses
- **Alias Forwarding**: forward addresses to external Lightning Addresses
- **MongoDB Integration**: dynamically add aliases via database
- **Phoenixd Webhooks**: receive payment notifications from phoenixd
- **Web Dashboard**: view configuration, API endpoints, and status

## Getting Started

1. Install and start the LND dependency on this StartOS server.
2. Add a public domain to Lightning Server if you want a public Lightning Address.
3. Run **Configure Lightning Address**. The domain field will prefer your public outbound gateway domain when one is available.
4. Run **Configure LND Node**. Enter the invoice macaroon and TLS certificate from the same LND node. This step is required on first install and after upgrading from 0.2.2:1. Existing Lightning Address and notification settings carry over.
5. Optional: run the notification, Nostr, and MongoDB alias actions.
6. Start Lightning Server and open the Web UI from the **Properties** section.

### Required Configuration

Lightning Server is configured through StartOS actions. The main required settings are:

- Lightning Address domain: your public domain, such as `pay.example.com`
- LND dependency: the local StartOS LND service
- LND gRPC endpoint: defaults to `lnd.embassy:10009`
- LND REST endpoint: defaults to `lnd.embassy:8080`
- Invoice macaroon: paste the hex encoding of `invoice.macaroon` from your LND node. From an authorized LND shell, `xxd -p -c 100000 invoice.macaroon` prints it. Keep this value private.
- TLS certificate: paste the contents of the same node’s `tls.cert`, including its BEGIN and END CERTIFICATE lines.
- Use a gRPC address listed in the certificate. Re-run **Configure LND Node** if you rotate either credential. Enter these settings in StartOS. The web dashboard’s saved LND settings do not control this connection.

### Optional Configuration

- Users: comma-separated list of valid usernames
- Catch-All: accept payments to any username
- Forwards: JSON map of username to external Lightning Address
- MongoDB aliases: dynamic Lightning Address aliases
- Nostr public/private keys: custom keys for zap receipts
- Pushover token/user: push notification credentials
- Email sender/password/recipient: email notification config

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/.well-known/lnurlp/:user` | LNURL-pay request |
| `/api/getInvoice/:user` | Generate BOLT11 invoice |
| `/api/notifier/:user` | Start LND invoice subscriber |
| `/api/phoenixd/:user` | Phoenixd webhook receiver |
| `/api/health` | Health check |

## Backups

StartOS backs up the main data and settings volume together with the private LND credentials volume. Protect backups as you would the invoice credential.

## Security

- All traffic is encrypted via StartOS's Tor or LAN interfaces
- LND macaroon and Nostr keys are stored on encrypted StartOS volumes
- Only the invoice credential and certificate you supply are available to Lightning Server. The package has no mount into LND.
- No write/admin surface is exposed without LND credentials

## Upstream

Based on [dplusplus1024/lightning-server](https://github.com/dplusplus1024/lightning-server) (Apache-2.0).
