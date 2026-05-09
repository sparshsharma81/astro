const fs = require('fs');

// Build-time script for static deployments.
// It reads process.env values and writes a client-side env.js exposing window.__ENV.
// Use in Render/Vercel build step: `node scripts/write-env.js`

const env = {
  opencageKey: process.env.OPENCAGE_KEY || process.env.OPENCAGEKEY || '',
  geminiKey: process.env.GEMINI_KEY || process.env.GEMIN IKEY || process.env.GEMINIKEY || '',
  modelName: process.env.MODEL_NAME || process.env.MODELNAME || 'gemini-2.0-flash'
};

// pickup numbered astro keys automatically
for (let i = 1; i <= 12; i++) {
  const names = [
    `ASTRO_KEY_${i}`,
    `ASTRO_KEY${i}`,
    `ASTROKEY${i}`,
    `ASTROKEY_${i}`,
    `ASTROKEY${i}`
  ];
  for (const n of names) {
    if (process.env[n]) {
      env[`astroKey${i}`] = process.env[n];
      break;
    }
  }
}

// fallback single key if provided
if (!env.astroKey1) env.astroKey1 = process.env.ASTRO_KEY || process.env.ASTROKEY || process.env.ASTRO || '';

const out = `window.__ENV = ${JSON.stringify(env, null, 2)};`;
fs.writeFileSync('env.js', out, { encoding: 'utf8' });
console.log('env.js written with keys:', Object.keys(env).filter(k => !!env[k]));
