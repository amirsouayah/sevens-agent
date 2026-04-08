# Sevens Content Agent v2

Agent IA complet — contenu texte + génération images avec choix du moteur IA.

## Moteurs image supportés
- **Fal.ai** — FLUX Schnell, FLUX Dev, FLUX Pro, SDXL, AuraFlow
- **Together AI** — FLUX Schnell gratuit, SDXL
- **OpenAI** — DALL-E 3 HD
- **Stability AI** — Stable Diffusion XL
- **Google Imagen** — via lien ImageFX

## Déploiement Vercel (5 min)

### 1. GitHub
Crée un repo `sevens-agent` et uploade tous les fichiers.

### 2. Vercel
- vercel.com → New Project → importe le repo
- Framework : Next.js (auto-détecté)
- Deploy

### 3. Variables d'environnement (Vercel → Settings → Env Vars)
```
ANTHROPIC_API_KEY=sk-ant-...        ← requis
FAL_API_KEY=...                     ← pour Fal.ai
TOGETHER_API_KEY=...                ← pour Together (FLUX gratuit)
OPENAI_API_KEY=sk-proj-...          ← pour DALL-E 3
STABILITY_API_KEY=sk-...            ← pour Stability AI
```

### 4. Redeploy → Live ✅

## Notes
- Les clés peuvent aussi être saisies directement dans l'interface (stockage localStorage)
- Seule la clé Anthropic est requise pour la génération de texte
- Les clés image sont optionnelles selon le provider choisi
# sevens-agent
