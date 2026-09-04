// Same idea as emailChannel.js — mock now, AWS SNS (SMS) or Twilio later, same function shape.
export async function sendSms(to, message) {
  console.log(`[SMS -> ${to}] ${message}`);
  return { channel: 'sms', to, status: 'sent' };
}
