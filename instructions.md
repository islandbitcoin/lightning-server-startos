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

1. Start Lightning Server
2. Open the Web UI from the **Properties** section
3. Review the dashboard to confirm your configuration
4. Set your environment variables (DOMAIN, GRPC_HOST, INVOICE_MACAROON, etc.)

### Required Configuration

You must provide these environment variables for the service to function:

- `DOMAIN` — your domain name (e.g., `yourdomain.com`)
- `GRPC_HOST` — your LND gRPC endpoint (e.g., `lnd.example.com:10009`)
- `INVOICE_MACAROON` — hex-encoded invoice macaroon from your LND node
- `REST_HOST` — your LND REST endpoint (for the notifier WebSocket)

### Optional Configuration

- `USERS` — comma-separated list of valid usernames
- `CATCH_ALL` — accept payments to any username (default: `true`)
- `FORWARDS` — JSON map of username → external Lightning Address
- `USE_MONGO` — enable MongoDB alias forwarding
- `NOSTR_PUBLIC_KEY` / `NOSTR_PRIVATE_KEY` — custom Nostr keys for zap receipts
- `PUSHOVER_TOKEN` / `PUSHOVER_USER` — push notification credentials
- `EMAIL_SENDER` / `EMAIL_PASSWORD` / `EMAIL_RECIPIENT` — email notification config

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
- LND macaroon and Nostr keys are passed via environment variables
- No write/admin surface is exposed without LND credentials

## Upstream

Based on [dplusplus1024/lightning-server](https://github.com/dplusplus1024/lightning-server) (Apache-2.0).
