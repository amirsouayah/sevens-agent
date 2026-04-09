export async function POST(req) {
  try {
    const body = await req.json();
    const { imageUrl, prompt, strength, apiKey } = body;
    const key = apiKey || process.env.FAL_API_KEY;
    if (!key) return Response.json({ error: "Clé API Fal.ai manquante" }, { status: 400 });
    if (!imageUrl) return Response.json({ error: "Image manquante" }, { status: 400 });
    if (!prompt) return Response.json({ error: "Prompt manquant" }, { status: 400 });

    const res = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${key}`,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt,
        strength: strength ?? 0.75,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    const data = await res.json();
    if (data.error) return Response.json({ error: data.error }, { status: 400 });

    const resultUrl = data.images?.[0]?.url;
    if (!resultUrl) return Response.json({ error: "Aucune image retournée par Fal.ai" }, { status: 500 });

    // Fetch the result and return as base64 to avoid CORS issues on canvas
    const imgRes = await fetch(resultUrl);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = imgRes.headers.get("content-type") || "image/png";

    return Response.json({ imageUrl: `data:${contentType};base64,${base64}` });
  } catch (e) {
    return Response.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
