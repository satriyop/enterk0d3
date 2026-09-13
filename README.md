<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ENTERK0D3 // Brutalist Portfolio

High-contrast, brutalist terminal-inspired portfolio featuring live GitHub flows, interactive command shells, and a Gemini-powered Oracle.

## Local Development

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.dev.vars` for local Cloudflare Pages / Wrangler execution:
```bash
cp .env.example .dev.vars
```
Add your credentials:
- `GEMINI_API_KEY`: API key for Gemini Oracle (`gemini-2.0-flash`)
- `GITHUB_TOKEN`: GitHub Personal Access Token (read-only `public_repo` scope) to avoid 60 req/hr rate limiting.

### 3. Run Locally

**Full Environment (Vite + Cloudflare Pages Functions):**
```bash
npm run dev:full
```
This runs Wrangler with the local Pages functions proxying to Vite on `http://localhost:8788`.

**Frontend Only:**
```bash
npm run dev
```

### 4. Typecheck & Build
```bash
npm run build
```
Runs `tsc --noEmit` followed by `vite build`.
