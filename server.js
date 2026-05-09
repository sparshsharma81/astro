// Simple Express proxy for Render (or local use)
// Run with: node server.js

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), { maxAge: 0 }));

app.post('/api/gemini', async (req, res) => {
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
    res.json({ text, raw: data });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
