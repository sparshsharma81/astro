Deploying to Vercel / Render (static site)

1. Add environment variables in the platform UI:
   - OPENCAGE_KEY
   - GEMINI_KEY (only if you accept exposing it client-side; recommended: keep Gemini server-side)
   - ASTRO_KEY_1, ASTRO_KEY_2, ... (optional)
   - MODEL_NAME (optional)

2. Ensure the repo build command runs `node scripts/write-env.js` before publishing.
   Example build command:

   node scripts/write-env.js

   This writes `env.js` at the project root which the client app reads at runtime.

3. Vercel example (project settings):
   - Build Command: `node scripts/write-env.js`
   - Output Directory: `/` (root)

4. Render static site example:
   - Build Command: `node scripts/write-env.js`
   - Publish Directory: `/`

Server-side Gemini proxy (recommended)
-------------------------------------
To avoid exposing your Gemini/Generative API key client-side, deploy a server-side proxy.

- Vercel: place `api/gemini.js` in the `api/` folder (already provided). Add `GEMINI_KEY` in the Vercel environment variables.
- Render (or local server): use `server.js` which exposes `/api/gemini` and serves the static site. Add `GEMINI_KEY` in the Render service environment variables. Set the service `Start Command` to `node server.js`.

Client usage:
- The app will call Google directly only if a client `geminiKey` is present in the `config` textarea or `window.__ENV.geminiKey`.
- If no client key is available, the app will attempt to call `/api/gemini` (server proxy). The proxy uses `GEMINI_KEY` from the server environment.

Local dev:
- To run everything locally (static files + proxy):

```bash
npm install
npm run write-env   # optional: writes env.js from local env vars
npm run start       # starts Express server with proxy at /api/gemini
```

Or to quickly serve static files without proxy:

```bash
npm run serve
```

Security:
- Do not put private keys into `env.js` for public static sites. Use the server proxy for secrets.

Security note:
- `env.js` is public; do NOT put secrets you don't want exposed client-side. For secret server-only keys (Gemini), set up a serverless function to proxy requests and keep the secret on the server.

Optional improvements:
- Create a serverless endpoint to call Gemini (recommended) so the model key stays secret.
- Use `write-env.js` to selectively include only non-sensitive public keys.
