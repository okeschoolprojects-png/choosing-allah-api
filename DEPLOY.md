# Choosing Allah — PDF Build API

This is a self-contained API that produces the exact same interior.pdf as the original pipeline. Deploy it once; call it forever.

---

## Deploy to Railway (recommended, free tier works)

1. Go to [railway.app](https://railway.app) and create a new project
2. Choose **Deploy from GitHub repo** (push this folder to a GitHub repo first)
   — or use **Deploy from local** if Railway CLI is installed
3. Railway detects the Dockerfile automatically
4. Click Deploy. First build takes ~5 minutes (downloads Chromium)
5. Go to Settings → Networking → Generate Domain
6. Your API is live at `https://your-app.up.railway.app`

---

## Deploy to Render (alternative, also free)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Render detects Dockerfile automatically
4. Set:
   - **Build Command**: (leave blank — Dockerfile handles it)
   - **Start Command**: (leave blank — Dockerfile handles it)
   - **Port**: 8000
5. Deploy. First build takes ~5 minutes.

---

## API endpoints

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/health` | Liveness check |
| GET | `/chapters` | All chapters + their markdown content |
| GET | `/chapter/{file}` | Single chapter content |
| PUT | `/chapter/{file}` | Update a chapter (body: `{"content": "..."}`) |
| POST | `/build` | Rebuild PDF — **returns the PDF directly** |
| GET | `/pdf` | Download the last built PDF |

---

## How to wire Lovable to this API

In your Lovable project, set an environment variable:
```
VITE_API_URL=https://your-app.up.railway.app
```

Then in Lovable, the Save + Export flow is:
```js
// 1. Save the edited chapter
await fetch(`${API_URL}/chapter/f_01.md`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: editedText })
});

// 2. Build + download PDF in one step
const res = await fetch(`${API_URL}/build`, { method: 'POST' });
const blob = await res.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'interior.pdf'; a.click();
```

The POST /build call takes ~60–90 seconds (full Chromium render). Show a loading spinner.

---

## Updating book content

To update a chapter permanently on the server:
1. Edit the file in `src16/` locally
2. Commit + push to GitHub → Railway/Render auto-redeploys

Or just call `PUT /chapter/{file}` from Lovable (changes persist until next deploy).

---

## Build time estimates

- Railway / Render free tier: ~60–90 seconds per PDF build
- Railway Pro: ~30–45 seconds
- The PDF is identical to what this AI session produces
