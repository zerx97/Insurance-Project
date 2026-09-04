// A mock channel: prints to stdout instead of actually sending email.
// PRODUCTION UPGRADE PATH: swap this file's internals for AWS SES (`@aws-sdk/client-sesv2`).
// Nothing else in this service needs to change — that's the point of isolating "channels"
// behind one function signature.
export async function sendEmail(to, subject, body) {
  console.log(`[EMAIL -> ${to}] ${subject}\n${body}`);
  return { channel: 'email', to, status: 'sent' };
}
