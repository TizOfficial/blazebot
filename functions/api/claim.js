export const onRequestPost = async ({ request, env }) => {
  const { discord_id } = await request.json();
  // sehr einfache Token-Erzeugung (rand + upper)
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
  const token = rand.slice(0, 6);

  // Token -> discord_id (1h gültig)
  await env.BLAZE_PREMIUM.put(`CLAIM:${token}`, discord_id, { expirationTtl: 3600 });

  return new Response(JSON.stringify({ token }), {
    headers: { "content-type": "application/json" }
  });
};
