export const onRequestPost = async ({ request, env }) => {
  const event = await request.json();
  const res = event.resource || {};
  const custom = res.custom_id || res.custom || null;
  if (!custom) return new Response("OK");
  const discord_id = await env.BLAZE_PREMIUM.get(`CLAIM:${custom}`);
  if (!discord_id) return new Response("OK");

  const type = event.event_type;
  if (["BILLING.SUBSCRIPTION.ACTIVATED","PAYMENT.CAPTURE.COMPLETED","PAYMENT.SALE.COMPLETED"].includes(type)) {
    await env.BLAZE_PREMIUM.put(`ACTIVE:${discord_id}`, "1");
  }
  if (["BILLING.SUBSCRIPTION.CANCELLED","BILLING.SUBSCRIPTION.SUSPENDED"].includes(type)) {
    await env.BLAZE_PREMIUM.put(`ACTIVE:${discord_id}`, "0");
  }
  return new Response("OK");
};
