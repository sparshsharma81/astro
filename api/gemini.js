// Vercel Serverless Function (Node)
// Place under `api/gemini.js` for Vercel. It proxies requests to Google Generative API using a server-side key.

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const GEMINI_KEY = process.env.GEMINI_KEY || process.env.GEMIN IKEY || process.env.GEMINIKEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Server Gemini key not configured' });

  try {
    const { prompt, modelName = 'gemini-2.0-flash' } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'Upstream error', status: r.status, body: txt });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return res.status(200).json({ text, raw: data });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
};
