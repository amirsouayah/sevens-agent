export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ error: "Clé API Anthropic manquante" }, { status: 400 });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: body.messages,
      }),
    });
    const data = await response.json();
    if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
