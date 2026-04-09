"use client";
import { useState, useEffect } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────
const IMAGE_PROVIDERS = [
  {
    id: "fal",
    name: "Fal.ai",
    badge: "⚡ Rapide",
    badgeColor: "#22c55e",
    description: "FLUX Schnell — ultra rapide, qualité excellente",
    free: "Crédits gratuits au départ",
    link: "https://fal.ai/dashboard/keys",
    envKey: "FAL_API_KEY",
    models: [
      { id: "fal-ai/flux/schnell", label: "FLUX Schnell (rapide)" },
      { id: "fal-ai/flux/dev", label: "FLUX Dev (qualité)" },
      { id: "fal-ai/flux-pro", label: "FLUX Pro (premium)" },
      { id: "fal-ai/stable-diffusion-xl", label: "Stable Diffusion XL" },
      { id: "fal-ai/aura-flow", label: "AuraFlow" },
    ],
    sizes: [
      { id: "landscape_16_9", label: "Paysage 16:9 (Banner)" },
      { id: "square_hd", label: "Carré HD (Post IG)" },
      { id: "portrait_4_3", label: "Portrait 4:3 (Story)" },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    badge: "🆓 Gratuit",
    badgeColor: "#3b82f6",
    description: "FLUX Schnell Free — entièrement gratuit",
    free: "FLUX.1 Schnell gratuit sans limite",
    link: "https://api.together.xyz/settings/api-keys",
    envKey: "TOGETHER_API_KEY",
    models: [
      { id: "black-forest-labs/FLUX.1-schnell-Free", label: "FLUX Schnell (gratuit)" },
      { id: "black-forest-labs/FLUX.1-dev", label: "FLUX Dev" },
      { id: "stabilityai/stable-diffusion-xl-base-1.0", label: "SDXL Base" },
    ],
    sizes: [],
  },
  {
    id: "openai",
    name: "DALL-E 3",
    badge: "🎨 HD",
    badgeColor: "#8b5cf6",
    description: "OpenAI DALL-E 3 — qualité photographique HD",
    free: "Payant (~0.08$/image HD)",
    link: "https://platform.openai.com/api-keys",
    envKey: "OPENAI_API_KEY",
    models: [{ id: "dall-e-3", label: "DALL-E 3 HD" }],
    sizes: [],
  },
  {
    id: "stability",
    name: "Stability AI",
    badge: "🖼️ SDXL",
    badgeColor: "#f59e0b",
    description: "Stable Diffusion XL 1.0 — contrôle total du style",
    free: "25 crédits gratuits",
    link: "https://platform.stability.ai/account/keys",
    envKey: "STABILITY_API_KEY",
    models: [{ id: "stable-diffusion-xl-1024-v1-0", label: "SDXL 1.0" }],
    sizes: [],
  },
  {
    id: "google",
    name: "Google Imagen",
    badge: "🔗 Lien",
    badgeColor: "#06b6d4",
    description: "Google ImageFX — génère le prompt, ouvre Google",
    free: "Gratuit via ImageFX",
    link: "https://aitestkitchen.withgoogle.com/tools/image-fx",
    envKey: null,
    models: [],
    sizes: [],
  },
];

const STYLE_PRESETS = [
  {
    id: "luxury",
    label: "Luxury Méditerranée",
    emoji: "🌊",
    imagePrompt: "luxury Tunisian holiday villa, Mediterranean architecture, warm golden hour light, turquoise pool, jasmine flowers, cinematic photography, high-end real estate, soft bokeh, editorial style, 8k, photorealistic",
    tone: "prestige et exclusivité, pour clientèle européenne aisée",
  },
  {
    id: "authentic",
    label: "Authentique Tunisien",
    emoji: "🏺",
    imagePrompt: "authentic Tunisian riad, traditional white and blue architecture, handcrafted zellige tiles, bougainvillea, Sidi Bou Said inspired, warm afternoon light, travel photography style, 8k, photorealistic",
    tone: "chaleur, authenticité, dépaysement total",
  },
  {
    id: "modern",
    label: "Modern Getaway",
    emoji: "✨",
    imagePrompt: "modern minimalist Tunisian beach house, clean lines, open terrace, sea view, contemporary furniture, white walls, natural linen textures, lifestyle photography, bright and airy, 8k, photorealistic",
    tone: "moderne, épuré, lifestyle aspirationnel",
  },
  {
    id: "family",
    label: "Famille & Détente",
    emoji: "🌴",
    imagePrompt: "spacious Tunisian family holiday home, large garden, BBQ area, palm trees, relaxed summer atmosphere, bright natural light, candid lifestyle photography, 8k, photorealistic",
    tone: "convivial, chaleureux, rassurant pour familles",
  },
];

const CONTENT_TYPES = [
  { id: "post_ig", label: "Post Instagram", icon: "📸" },
  { id: "story", label: "Story / Reels", icon: "🎬" },
  { id: "description", label: "Description Propriété", icon: "🏠" },
  { id: "ad_fb", label: "Pub Facebook/Meta", icon: "📣" },
  { id: "email", label: "Email Voyageur", icon: "✉️" },
];

const LANGUAGES = [
  { id: "fr", label: "FR", flag: "🇫🇷" },
  { id: "en", label: "EN", flag: "🇬🇧" },
  { id: "ar", label: "AR", flag: "🇹🇳" },
];

// ─── STYLES ───────────────────────────────────────────────────
const css = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0b0f1a", minHeight: "100vh", color: "#e8e4dc" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(232,228,220,0.4)", marginBottom: "7px", fontWeight: "500" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "11px 13px", color: "#e8e4dc", fontSize: "13px", boxSizing: "border-box", outline: "none", fontFamily: "'DM Sans', sans-serif" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "11px 13px", color: "#e8e4dc", fontSize: "13px", resize: "none", boxSizing: "border-box", outline: "none", fontFamily: "'DM Sans', sans-serif" },
  select: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "11px 13px", color: "#e8e4dc", fontSize: "13px", outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  btn: { width: "100%", padding: "13px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #C9A96E, #a87c3a)", color: "#0b0f1a", cursor: "pointer", fontSize: "14px", fontWeight: "700", letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" },
  btnDisabled: { background: "rgba(201,169,110,0.2)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "12px", padding: "18px" },
  ghost: { background: "transparent", border: "1px solid rgba(201,169,110,0.35)", color: "#C9A96E", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" },
  section: { marginBottom: "22px" },
  gold: { color: "#C9A96E" },
  row: { display: "flex", gap: "10px" },
};

// ─── MAIN ─────────────────────────────────────────────────────
export default function SevensAgent() {
  const [tab, setTab] = useState("content"); // content | image | settings
  const [style, setStyle] = useState(STYLE_PRESETS[0]);
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [propertyInfo, setPropertyInfo] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [customStyle, setCustomStyle] = useState("");
  const [customStyleMode, setCustomStyleMode] = useState(false);

  // Content state
  const [contentResult, setContentResult] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  // Image state
  const [imageProvider, setImageProvider] = useState(IMAGE_PROVIDERS[0]);
  const [imageModel, setImageModel] = useState(IMAGE_PROVIDERS[0].models[0]?.id || "");
  const [imageSize, setImageSize] = useState(IMAGE_PROVIDERS[0].sizes[0]?.id || "landscape_16_9");
  const [imagePromptInput, setImagePromptInput] = useState("");
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imageError, setImageError] = useState("");

  // API Keys (stored in localStorage)
  const [keys, setKeys] = useState({ anthropic: "", fal: "", together: "", openai: "", stability: "" });
  const [showKeys, setShowKeys] = useState({});
  const [keysSaved, setKeysSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sevens_keys");
      if (saved) setKeys(JSON.parse(saved));
    } catch {}
  }, []);

  const saveKeys = () => {
    localStorage.setItem("sevens_keys", JSON.stringify(keys));
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 2000);
  };

  const toggleKey = (k) => setShowKeys(p => ({ ...p, [k]: !p[k] }));

  // ── Generate content text ──
  const generateContent = async () => {
    if (!propertyInfo.trim()) return;
    setLoadingContent(true);
    setContentResult("");
    const tone = customStyleMode ? customStyle : style.tone;
    const langLabel = lang.id === "fr" ? "français" : lang.id === "en" ? "anglais" : "arabe tunisien";
    const prompt = `Tu es un expert marketing pour sevens.tn, plateforme premium de location vacances en Tunisie ciblant les voyageurs européens.

Génère un ${contentType.label} en ${langLabel}.
Ton/style : ${tone}
Propriété : ${propertyInfo}
${customNote ? `Note : ${customNote}` : ""}

Règles : emojis pertinents, CTA vers sevens.tn, aspirationnel, adapté aux européens. Pour IG/story : hashtags en fin. Pas de prix.
Génère UNIQUEMENT le contenu final.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], apiKey: keys.anthropic }),
      });
      const data = await res.json();
      if (data.error) { setContentResult("❌ " + data.error); }
      else { setContentResult(data.content?.map(b => b.text || "").join("") || "Erreur"); }
    } catch { setContentResult("❌ Erreur de connexion."); }
    setLoadingContent(false);
  };

  // ── Generate image prompt ──
  const generateImagePrompt = async () => {
    setLoadingPrompt(true);
    setGeneratedImagePrompt("");
    setImageUrl("");
    setImageError("");
    const baseStyle = customStyleMode ? customStyle : style.imagePrompt;
    const context = propertyInfo ? `${baseStyle}, ${propertyInfo}` : baseStyle;
    const prompt = `Tu es expert en prompt engineering pour ${imageProvider.name}.
Génère 1 prompt image optimisé pour ce provider pour sevens.tn.
Style : ${context}
${customNote ? `Note : ${customNote}` : ""}
Retourne UNIQUEMENT le prompt en anglais, directement copiable, sans explication.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], apiKey: keys.anthropic }),
      });
      const data = await res.json();
      if (data.error) { setGeneratedImagePrompt("❌ " + data.error); }
      else { setGeneratedImagePrompt(data.content?.map(b => b.text || "").join("") || ""); }
    } catch { setGeneratedImagePrompt("❌ Erreur."); }
    setLoadingPrompt(false);
  };

  // ── Generate actual image ──
  const generateImage = async () => {
    const finalPrompt = imagePromptInput || generatedImagePrompt;
    if (!finalPrompt) return;
    setLoadingImage(true);
    setImageUrl("");
    setImageError("");

    if (imageProvider.id === "google") {
      window.open(`https://aitestkitchen.withgoogle.com/tools/image-fx`, "_blank");
      setImageError("💡 Google ImageFX ouvert dans un nouvel onglet. Colle le prompt là-bas.");
      setLoadingImage(false);
      return;
    }

    const providerKey = { fal: keys.fal, together: keys.together, openai: keys.openai, stability: keys.stability }[imageProvider.id];

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: imageProvider.id,
          prompt: finalPrompt,
          model: imageModel,
          imageSize,
          apiKey: providerKey,
        }),
      });
      const data = await res.json();
      if (data.error) { setImageError("❌ " + data.error); }
      else if (data.imageUrl) { setImageUrl(data.imageUrl); }
    } catch { setImageError("❌ Erreur de connexion."); }
    setLoadingImage(false);
  };

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const providerChanged = (pid) => {
    const p = IMAGE_PROVIDERS.find(x => x.id === pid);
    setImageProvider(p);
    setImageModel(p.models[0]?.id || "");
    setImageSize(p.sizes[0]?.id || "landscape_16_9");
    setImageUrl("");
    setImageError("");
    setGeneratedImagePrompt("");
  };

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div style={css.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(201,169,110,0.15)", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "21px", fontWeight: "700", color: "#C9A96E" }}>🌊 sevens</span>
            <span style={{ fontSize: "10px", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E", padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.1em" }}>CONTENT AGENT</span>
          </div>
          <p style={{ margin: "3px 0 0", fontSize: "12px", color: "rgba(232,228,220,0.38)" }}>Marketing & Image IA — sevens.tn</p>
        </div>
        <button onClick={() => setTab("settings")} style={{ ...css.ghost, fontSize: "13px" }}>⚙️ Clés API</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 73px)" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "20px 16px", background: "rgba(0,0,0,0.2)", overflowY: "auto" }}>

          {/* Style */}
          <div style={css.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={css.label}>Style</span>
              <button onClick={() => setCustomStyleMode(!customStyleMode)} style={{ ...css.ghost, padding: "3px 8px", fontSize: "10px" }}>
                {customStyleMode ? "✓ Custom" : "+ Custom"}
              </button>
            </div>
            {customStyleMode ? (
              <textarea value={customStyle} onChange={e => setCustomStyle(e.target.value)}
                placeholder="Ton style unique, ambiance, cible..." style={{ ...css.textarea, height: "70px" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {STYLE_PRESETS.map(s => (
                  <button key={s.id} onClick={() => setStyle(s)} style={{
                    padding: "10px 12px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    border: style.id === s.id ? "1.5px solid #C9A96E" : "1px solid rgba(255,255,255,0.07)",
                    background: style.id === s.id ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.03)",
                    color: "#e8e4dc",
                  }}>
                    <span style={{ marginRight: "7px" }}>{s.emoji}</span>
                    <span style={{ fontSize: "12px", fontWeight: "500" }}>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property */}
          <div style={css.section}>
            <label style={css.label}>Propriété</label>
            <textarea value={propertyInfo} onChange={e => setPropertyInfo(e.target.value)}
              placeholder="Villa Mélika, Sousse, 4 chambres, piscine, 150m mer..." style={{ ...css.textarea, height: "80px" }} />
          </div>

          {/* Note */}
          <div style={css.section}>
            <label style={css.label}>Note spéciale</label>
            <textarea value={customNote} onChange={e => setCustomNote(e.target.value)}
              placeholder="Promo, focus, ton particulier..." style={{ ...css.textarea, height: "60px" }} />
          </div>

          {/* Nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "8px" }}>
            {[{ id: "content", label: "✍️ Contenu texte" }, { id: "image", label: "🎨 Génération images" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "10px 12px", borderRadius: "8px", border: "none", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                background: tab === t.id ? "rgba(201,169,110,0.15)" : "transparent",
                color: tab === t.id ? "#C9A96E" : "rgba(232,228,220,0.5)",
                fontWeight: tab === t.id ? "600" : "400",
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── RIGHT MAIN ── */}
        <div style={{ padding: "24px 28px", overflowY: "auto" }}>

          {/* ── CONTENT TAB ── */}
          {tab === "content" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "17px", fontWeight: "600", color: "#C9A96E" }}>✍️ Génération de contenu</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={css.label}>Type de contenu</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {CONTENT_TYPES.map(c => (
                      <button key={c.id} onClick={() => setContentType(c)} style={{
                        padding: "9px 12px", borderRadius: "7px", border: contentType.id === c.id ? "1.5px solid rgba(201,169,110,0.6)" : "1px solid rgba(255,255,255,0.07)",
                        background: contentType.id === c.id ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.03)",
                        color: "#e8e4dc", cursor: "pointer", textAlign: "left", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "8px",
                      }}>{c.icon} {c.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={css.label}>Langue</label>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                    {LANGUAGES.map(l => (
                      <button key={l.id} onClick={() => setLang(l)} style={{
                        flex: 1, padding: "9px 6px", borderRadius: "7px",
                        border: lang.id === l.id ? "1.5px solid rgba(201,169,110,0.6)" : "1px solid rgba(255,255,255,0.07)",
                        background: lang.id === l.id ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.03)",
                        color: "#e8e4dc", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                      }}>{l.flag} {l.label}</button>
                    ))}
                  </div>
                  <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "rgba(232,228,220,0.55)", lineHeight: "1.6" }}>
                    <strong style={css.gold}>Style actif :</strong><br />{customStyleMode ? (customStyle || "—") : style.label} — {customStyleMode ? "" : style.tone}
                  </div>
                </div>
              </div>

              <button onClick={generateContent} disabled={loadingContent || !propertyInfo.trim()}
                style={{ ...css.btn, ...(loadingContent || !propertyInfo.trim() ? css.btnDisabled : {}), marginBottom: "16px" }}>
                {loadingContent ? "✨ Génération..." : `✍️ Générer ${contentType.label}`}
              </button>

              {contentResult && (
                <div style={css.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A96E", fontWeight: "500" }}>
                      {contentType.icon} {contentType.label} · {lang.flag}
                    </span>
                    <button style={css.ghost} onClick={() => copy(contentResult, setCopiedContent)}>
                      {copiedContent ? "✓ Copié !" : "Copier"}
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", whiteSpace: "pre-wrap" }}>{contentResult}</p>
                </div>
              )}
            </div>
          )}

          {/* ── IMAGE TAB ── */}
          {tab === "image" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "17px", fontWeight: "600", color: "#C9A96E" }}>🎨 Génération d'images IA</h2>

              {/* Provider Selector */}
              <div style={css.section}>
                <label style={css.label}>Choisir le moteur IA</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "12px" }}>
                  {IMAGE_PROVIDERS.map(p => (
                    <button key={p.id} onClick={() => providerChanged(p.id)} style={{
                      padding: "12px 10px", borderRadius: "9px", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                      border: imageProvider.id === p.id ? "1.5px solid #C9A96E" : "1px solid rgba(255,255,255,0.08)",
                      background: imageProvider.id === p.id ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.03)",
                      color: "#e8e4dc",
                    }}>
                      <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "3px" }}>{p.name}</div>
                      <span style={{ fontSize: "10px", background: p.badgeColor + "22", color: p.badgeColor, padding: "1px 6px", borderRadius: "10px", border: `1px solid ${p.badgeColor}44` }}>{p.badge}</span>
                      <div style={{ fontSize: "10px", color: "rgba(232,228,220,0.4)", marginTop: "4px" }}>{p.free}</div>
                    </button>
                  ))}
                </div>

                {/* Provider info */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "rgba(232,228,220,0.55)", marginBottom: "12px" }}>
                  {imageProvider.description}
                  {imageProvider.link && (
                    <a href={imageProvider.link} target="_blank" rel="noreferrer"
                      style={{ color: "#C9A96E", marginLeft: "8px", textDecoration: "none", fontWeight: "500" }}>
                      → Obtenir clé API ↗
                    </a>
                  )}
                </div>

                {/* Model selector */}
                {imageProvider.models.length > 1 && (
                  <div style={{ marginBottom: "10px" }}>
                    <label style={css.label}>Modèle</label>
                    <select value={imageModel} onChange={e => setImageModel(e.target.value)} style={css.select}>
                      {imageProvider.models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </div>
                )}

                {/* Size selector */}
                {imageProvider.sizes.length > 0 && (
                  <div style={{ marginBottom: "10px" }}>
                    <label style={css.label}>Format image</label>
                    <select value={imageSize} onChange={e => setImageSize(e.target.value)} style={css.select}>
                      {imageProvider.sizes.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Prompt generation */}
              <div style={css.section}>
                <label style={css.label}>Prompt image</label>
                <button onClick={generateImagePrompt} disabled={loadingPrompt}
                  style={{ ...css.btn, ...(loadingPrompt ? css.btnDisabled : {}), marginBottom: "10px", background: loadingPrompt ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.15)", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.3)" }}>
                  {loadingPrompt ? "🤖 Génération prompt..." : "🤖 Générer prompt IA optimisé"}
                </button>

                {generatedImagePrompt && !generatedImagePrompt.startsWith("❌") && (
                  <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "12px", marginBottom: "10px", position: "relative" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#C9A96E", letterSpacing: "0.06em", textTransform: "uppercase" }}>Prompt généré :</p>
                    <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.7", color: "rgba(232,228,220,0.8)", fontFamily: "monospace" }}>{generatedImagePrompt}</p>
                    <button style={{ ...css.ghost, marginTop: "8px", fontSize: "11px" }} onClick={() => copy(generatedImagePrompt, setCopiedPrompt)}>
                      {copiedPrompt ? "✓ Copié" : "Copier"}
                    </button>
                  </div>
                )}

                <label style={css.label}>Prompt personnalisé (optionnel — remplace le généré)</label>
                <textarea value={imagePromptInput} onChange={e => setImagePromptInput(e.target.value)}
                  placeholder="Colle ou écris ton propre prompt ici..."
                  style={{ ...css.textarea, height: "70px", marginBottom: "12px" }} />

                <button onClick={generateImage}
                  disabled={loadingImage || (!generatedImagePrompt && !imagePromptInput)}
                  style={{ ...css.btn, ...(loadingImage || (!generatedImagePrompt && !imagePromptInput) ? css.btnDisabled : {}) }}>
                  {loadingImage ? "🎨 Génération image..." : `🎨 Générer avec ${imageProvider.name}`}
                </button>
              </div>

              {imageError && (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "rgba(232,228,220,0.7)", marginTop: "10px" }}>
                  {imageError}
                </div>
              )}

              {imageUrl && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A96E", fontWeight: "500" }}>Image générée</span>
                    <a href={imageUrl} download="sevens-image.png" target="_blank" rel="noreferrer" style={{ ...css.ghost, textDecoration: "none", fontSize: "11px" }}>⬇️ Télécharger</a>
                  </div>
                  <img src={imageUrl} alt="Generated" style={{ width: "100%", borderRadius: "10px", border: "1px solid rgba(201,169,110,0.2)" }} />
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "600", color: "#C9A96E" }}>⚙️ Clés API</h2>
              <p style={{ margin: "0 0 22px", fontSize: "13px", color: "rgba(232,228,220,0.45)", lineHeight: "1.6" }}>
                Stockées localement dans ton navigateur. Non envoyées à un serveur tiers.<br />
                Tu peux aussi les configurer comme variables d'environnement sur Vercel.
              </p>

              {[
                { key: "anthropic", label: "Anthropic (Claude)", required: true, link: "https://console.anthropic.com/", env: "ANTHROPIC_API_KEY", placeholder: "sk-ant-..." },
                { key: "fal", label: "Fal.ai (FLUX, SDXL)", required: false, link: "https://fal.ai/dashboard/keys", env: "FAL_API_KEY", placeholder: "xxxxxxxx-xxxx-..." },
                { key: "together", label: "Together AI (FLUX gratuit)", required: false, link: "https://api.together.xyz/settings/api-keys", env: "TOGETHER_API_KEY", placeholder: "xxxxxxxxxxxxxxxx..." },
                { key: "openai", label: "OpenAI (DALL-E 3)", required: false, link: "https://platform.openai.com/api-keys", env: "OPENAI_API_KEY", placeholder: "sk-proj-..." },
                { key: "stability", label: "Stability AI (SDXL)", required: false, link: "https://platform.stability.ai/account/keys", env: "STABILITY_API_KEY", placeholder: "sk-..." },
              ].map(item => (
                <div key={item.key} style={{ ...css.card, marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#e8e4dc" }}>{item.label}</span>
                      {item.required && <span style={{ marginLeft: "6px", fontSize: "10px", color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "1px 6px", borderRadius: "10px" }}>Requis</span>}
                    </div>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#C9A96E", textDecoration: "none" }}>Obtenir ↗</a>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type={showKeys[item.key] ? "text" : "password"}
                      value={keys[item.key]}
                      onChange={e => setKeys(p => ({ ...p, [item.key]: e.target.value }))}
                      placeholder={item.placeholder}
                      style={{ ...css.input, flex: 1, fontFamily: "monospace", fontSize: "12px" }}
                    />
                    <button onClick={() => toggleKey(item.key)} style={{ ...css.ghost, padding: "8px 10px", flexShrink: 0 }}>
                      {showKeys[item.key] ? "🙈" : "👁"}
                    </button>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: "10px", color: "rgba(232,228,220,0.3)", letterSpacing: "0.04em" }}>
                    Var. Vercel : <code style={{ color: "rgba(201,169,110,0.6)" }}>{item.env}</code>
                  </p>
                </div>
              ))}

              <button onClick={saveKeys} style={css.btn}>
                {keysSaved ? "✓ Clés sauvegardées !" : "💾 Sauvegarder les clés"}
              </button>

              <div style={{ marginTop: "20px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "9px", padding: "14px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "600", color: "#C9A96E" }}>🔐 Déploiement Vercel — Variables d'environnement</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(232,228,220,0.5)", lineHeight: "1.7" }}>
                  Pour ne pas entrer les clés manuellement, configure-les dans<br />
                  <strong style={{ color: "rgba(232,228,220,0.7)" }}>Vercel → Settings → Environment Variables</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
