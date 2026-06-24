# Lightning Server

Self-hosted Lightning Address server with Nostr zap receipts and payment notifications.

## What is Lightning Server?

Lightning Server enables you to receive **Lightning Address** payments at `you@yourdomain.com`. It connects to your LND node via gRPC to generate BOLT11 invoices, publishes **Nostr zap receipts** (NIP-57), and sends **email** and **push notifications** for every payment received.

**Key features:**

- **Lightning Address** — LNURL-pay endpoints at `/.well-known/lnurlp/:user`
- **Nostr Zap Receipts** — automatically publishes kind 9735 zap receipts to relays
- **Payment Notifications** — beautiful HTML email + Pushover push alerts
- **Multi-user** — configure multiple Lightning Addresses
- **Alias Forwarding** — forward addresses to external Lightning Addresses
- **MongoDB Integration** — dynamically add aliases via database
- **Phoenixd Webhooks** — receive payment notifications from phoenixd
- **Web Dashboard** — view configuration, API endpoints, and status

## Getting Started

1. Install and start the LND dependency on this StartOS server.
2. Add a public domain to Lightning Server if you want a public Lightning Address.
3. Run **Configure Lightning Address**. The domain field will prefer your public outbound gateway domain when one is available.
4. Run **Configure LND Node**. By default, Lightning Server uses the self-hosted LND dependency mounted on this server.
5. Optional: run the notification, Nostr, and MongoDB alias actions.
6. Start Lightning Server and open the Web UI from the **Properties** section.

### Required Configuration

Lightning Server is configured through StartOS actions. The main required settings are:

- Lightning Address domain — your public domain, such as `pay.example.com`
- LND dependency — the local StartOS LND service
- LND gRPC endpoint — defaults to `lnd.embassy:10009`
- LND REST endpoint — defaults to `lnd.embassy:8080`
- Invoice macaroon — defaults to the mounted LND invoice macaroon

### Optional Configuration

- Users — comma-separated list of valid usernames
- Catch-All — accept payments to any username
- Forwards — JSON map of username to external Lightning Address
- MongoDB aliases — dynamic Lightning Address aliases
- Nostr public/private keys — custom keys for zap receipts
- Pushover token/user — push notification credentials
- Email sender/password/recipient — email notification config

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/.well-known/lnurlp/:user` | LNURL-pay request |
| `/api/getInvoice/:user` | Generate BOLT11 invoice |
| `/api/notifier/:user` | Start LND invoice subscriber |
| `/api/phoenixd/:user` | Phoenixd webhook receiver |
| `/api/health` | Health check |

## Backups

This service stores its data in a single volume (`main`). Standard StartOS backup/restore is supported.

## Security

- All traffic is encrypted via StartOS's Tor or LAN interfaces
- LND macaroon and Nostr keys are stored on encrypted StartOS volumes
- The default LND macaroon is read from the mounted local LND dependency
- No write/admin surface is exposed without LND credentials

## Upstream

Based on [dplusplus1024/lightning-server](https://github.com/dplusplus1024/lightning-server) (Apache-2.0).
