export async function POST(req) {
  try {
    const body = await req.json();
    const { provider, prompt, apiKey } = body;

    // FAL.AI (Flux, SDXL, etc.)
    if (provider === "fal") {
      const key = apiKey || process.env.FAL_API_KEY;
      if (!key) return Response.json({ error: "Clé API Fal.ai manquante" }, { status: 400 });

      const model = body.model || "fal-ai/flux/schnell";
      const res = await fetch(`https://fal.run/${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${key}`,
        },
        body: JSON.stringify({
          prompt,
          image_size: body.imageSize || "landscape_16_9",
          num_images: 1,
          enable_safety_checker: true,
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error }, { status: 400 });
      const imageUrl = data.images?.[0]?.url;
      return Response.json({ imageUrl, provider: "fal" });
    }

    // STABILITY AI (Stable Diffusion)
    if (provider === "stability") {
      const key = apiKey || process.env.STABILITY_API_KEY;
      if (!key) return Response.json({ error: "Clé API Stability AI manquante" }, { status: 400 });

      const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          height: 768,
          width: 1344,
          samples: 1,
          steps: 30,
        }),
      });
      const data = await res.json();
      if (data.message) return Response.json({ error: data.message }, { status: 400 });
      const b64 = data.artifacts?.[0]?.base64;
      return Response.json({ imageUrl: `data:image/png;base64,${b64}`, provider: "stability" });
    }

    // TOGETHER AI (FLUX, SDXL)
    if (provider === "together") {
      const key = apiKey || process.env.TOGETHER_API_KEY;
      if (!key) return Response.json({ error: "Clé API Together AI manquante" }, { status: 400 });

      const model = body.model || "black-forest-labs/FLUX.1-schnell-Free";
      const res = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          width: 1280,
          height: 720,
          steps: 4,
          n: 1,
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      const imageUrl = data.data?.[0]?.url;
      return Response.json({ imageUrl, provider: "together" });
    }

    // OPENAI DALL-E 3
    if (provider === "openai") {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) return Response.json({ error: "Clé API OpenAI manquante" }, { status: 400 });

      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1792x1024",
          quality: "hd",
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      const imageUrl = data.data?.[0]?.url;
      return Response.json({ imageUrl, provider: "openai" });
    }

    // GOOGLE IMAGEN (via Vertex AI) — prompt only, no direct free endpoint
    if (provider === "google") {
      return Response.json({
        error: "Google Imagen nécessite Vertex AI (GCP). Utilise le prompt généré dans Google ImageFX : https://aitestkitchen.withgoogle.com/tools/image-fx",
        isInfo: true,
      }, { status: 200 });
    }

    return Response.json({ error: "Provider non supporté" }, { status: 400 });
  } catch (e) {
    return Response.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
