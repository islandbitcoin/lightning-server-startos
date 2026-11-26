const { X509Certificate } = require('node:crypto')
const { execFileSync } = require('node:child_process')
const { readFileSync } = require('node:fs')

const directory = '/run/lightning-server-lnd'
const invoicePath = directory + '/invoice.macaroon'
const certPath = directory + '/tls.cert'

// LND's stock invoice.macaroon includes address operations and on-chain reads.
// Allow narrower invoice credentials, and fail closed on any additional grant.
const allowed = new Set(['invoices:read', 'invoices:write', 'address:read', 'address:write', 'onchain:read'])
function validate() {
  const pem = readFileSync(certPath, 'utf8').trim()
  if (!/^-----BEGIN CERTIFICATE-----\s+[A-Za-z0-9+/=\s]+-----END CERTIFICATE-----$/.test(pem)) {
    throw new Error('Expected a PEM certificate')
  }
  new X509Certificate(pem)
  const output = execFileSync('/usr/local/bin/lncli', ['printmacaroon', '--macaroon_file=' + invoicePath], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  })
  const { permissions } = JSON.parse(output)
  if (!Array.isArray(permissions) || !permissions.includes('invoices:read') ||
      !permissions.includes('invoices:write') || permissions.some(p => !allowed.has(p))) {
    throw new Error('Invoice permissions required')
  }
}

try {
  validate()
} catch {
  console.error('Supply an LND invoice-only macaroon and a valid PEM TLS certificate in Configure LND Node.')
  process.exit(1)
}
if (process.argv[2] === 'start') {
  // start.js gives the web settings precedence. Always pair the validated
  // credential with the endpoint configured by the StartOS operator.
  const config = require('/app/lib/config')
  const original = config.configToEnv
  const managed = {
    GRPC_HOST: process.env.GRPC_HOST,
    REST_HOST: process.env.REST_HOST,
    INVOICE_MACAROON: readFileSync(invoicePath).toString('hex'),
  }
  config.configToEnv = settings => ({ ...original(settings), ...managed })
  require('/app/start.js')
}
