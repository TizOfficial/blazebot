export const onRequestPost = async ({ request, env }) => {
  const { discord_id } = await request.json();
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  await env.BLAZE_PREMIUM.put(`CLAIM:${token}`, discord_id, { expirationTtl: 3600 });
  return new Response(JSON.stringify({ token }), { headers: { "content-type": "application/json" } });
};
