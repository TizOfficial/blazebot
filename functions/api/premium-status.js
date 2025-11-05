export const onRequestGet = async ({ request, env }) => {
  // --- Discord Setup ---
  const BOT_TOKEN = env.DISCORD_BOT_TOKEN;      // dein Bot-Token
  const APP_ID = env.DISCORD_APP_ID;            // Application ID (Developer Portal)
  const SKU_ID = env.DISCORD_PREMIUM_SKU_ID;    // ID deines Premium-Produkts

  // --- User aus URL holen ---
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  if (!user_id) return new Response("Missing user_id", { status: 400 });

  // --- Anfrage an Discord API ---
  const res = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/entitlements?user_id=${user_id}`, {
    headers: { "Authorization": `Bot ${BOT_TOKEN}` }
  });

  // --- Antwort prüfen ---
  if (!res.ok) {
    return new Response(JSON.stringify({ active: false, error: "API request failed" }), {
      headers: { "content-type": "application/json" },
      status: 500
    });
  }

  const data = await res.json();
  const active = data.some(e => e.sku_id === SKU_ID && !e.ended_at);

  return new Response(JSON.stringify({ active }), {
    headers: { "content-type": "application/json" }
  });
};
