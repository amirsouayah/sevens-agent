export async function POST(req) {
  try {
    const body = await req.json();
    const { imageUrl, prompt, strength, apiKey } = body;
    const key = apiKey || process.env.FAL_API_KEY;
    if (!key) return Response.json({ error: "Clé API Fal.ai manquante" }, { status: 400 });
    if (!imageUrl) return Response.json({ error: "Image manquante" }, { status: 400 });
    if (!prompt) return Response.json({ error: "Prompt manquant" }, { status: 400 });

    // fal.ai requires a real HTTP URL — upload the base64 image to fal.ai storage first
    const match = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/s);
    if (!match) return Response.json({ error: "Format d'image invalide (attendu base64 data URL)" }, { status: 400 });
    const contentType = match[1];
    const ext = contentType.split("/")[1] || "jpeg";
    const buffer = Buffer.from(match[2], "base64");

    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: contentType }), `photo.${ext}`);

    const uploadRes = await fetch("https://rest.alpha.fal.ai/storage/upload", {
      method: "POST",
      headers: { "Authorization": `Key ${key}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.url) {
      return Response.json({ error: "Échec upload vers fal.ai: " + (uploadData.detail || JSON.stringify(uploadData)) }, { status: 500 });
    }

    // Call image-to-image with the real URL
    const res = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${key}`,
      },
      body: JSON.stringify({
        image_url: uploadData.url,
        prompt,
        strength: strength ?? 0.75,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    const data = await res.json();
    if (data.error) return Response.json({ error: data.error }, { status: 400 });
    if (data.detail) return Response.json({ error: data.detail }, { status: 400 });

    const resultUrl = data.images?.[0]?.url;
    if (!resultUrl) {
      return Response.json({ error: "Aucune image retournée par Fal.ai: " + JSON.stringify(data) }, { status: 500 });
    }

    // Return as base64 to avoid CORS issues on canvas
    const imgRes = await fetch(resultUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    const imgBase64 = Buffer.from(imgBuffer).toString("base64");
    const imgType = imgRes.headers.get("content-type") || "image/jpeg";

    return Response.json({ imageUrl: `data:${imgType};base64,${imgBase64}` });
  } catch (e) {
    return Response.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
