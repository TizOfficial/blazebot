export const onRequestPost = async ({ request, env }) => {
  // Minimal: ohne Signatur-Prüfung (erst Sandbox testen)
  const ev = await request.json();
  const res = ev?.resource || {};
  const custom = res.custom_id || res.custom;
  if (!custom) return new Response("OK"); // kein Token -> ignorieren

  // Token -> Discord-ID finden
  const discordId = await env.BLAZE_PREMIUM.get(`CLAIM:${custom}`);
  if (!discordId) return new Response("OK"); // abgelaufen oder ungültig

  const onEvents = [
    "BILLING.SUBSCRIPTION.ACTIVATED",
    "PAYMENT.CAPTURE.COMPLETED",
    "PAYMENT.SALE.COMPLETED"
  ];
  const offEvents = [
    "BILLING.SUBSCRIPTION.CANCELLED",
    "BILLING.SUBSCRIPTION.SUSPENDED"
  ];

  if (onEvents.includes(ev?.event_type)) {
    await env.BLAZE_PREMIUM.put(`ACTIVE:${discordId}`, "1");
  } else if (offEvents.includes(ev?.event_type)) {
    await env.BLAZE_PREMIUM.put(`ACTIVE:${discordId}`, "0");
  }

  return new Response("OK");
};
