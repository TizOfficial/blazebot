export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const discord_id = url.searchParams.get("discord_id");
  const active = (await env.BLAZE_PREMIUM.get(`ACTIVE:${discord_id}`)) === "1";
  return new Response(JSON.stringify({ active }), {
    headers: { "content-type": "application/json" }
  });
};
