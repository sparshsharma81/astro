
    const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const API_BASE_URL = "https://json.freeastrologyapi.com";
    const API_CATALOG = [
      { id: "planets", name: "Planets", path: "planets", group: "primitive", default: false },
      { id: "d1", name: "Planets Extended (D1)", path: "planets/extended", group: "core", default: true, required: true },
      { id: "d9", name: "Navamsa Chart Info (D9)", path: "navamsa-chart-info", group: "core", default: true, required: true },
      { id: "d2", name: "D2 Chart Info", path: "d2-chart-info", group: "divisional", default: true },
      { id: "d3", name: "D3 Chart Info", path: "d3-chart-info", group: "divisional", default: false },
      { id: "d4", name: "D4 Chart Info", path: "d4-chart-info", group: "divisional", default: false },
      { id: "d5", name: "D5 Chart Info", path: "d5-chart-info", group: "divisional", default: false },
      { id: "d6", name: "D6 Chart Info", path: "d6-chart-info", group: "divisional", default: false },
      { id: "d7", name: "D7 Chart Info", path: "d7-chart-info", group: "divisional", default: false },
      { id: "d8", name: "D8 Chart Info", path: "d8-chart-info", group: "divisional", default: false },
      { id: "d10", name: "D10 Chart Info", path: "d10-chart-info", group: "divisional", default: true },
      { id: "d11", name: "D11 Chart Info", path: "d11-chart-info", group: "divisional", default: true },
      { id: "d12", name: "D12 Chart Info", path: "d12-chart-info", group: "divisional", default: false },
      { id: "d16", name: "D16 Chart Info", path: "d16-chart-info", group: "divisional", default: false },
      { id: "d20", name: "D20 Chart Info", path: "d20-chart-info", group: "divisional", default: false },
      { id: "d24", name: "D24 Chart Info", path: "d24-chart-info", group: "divisional", default: false },
      { id: "d27", name: "D27 Chart Info", path: "d27-chart-info", group: "divisional", default: false },
      { id: "d30", name: "D30 Chart Info", path: "d30-chart-info", group: "divisional", default: false },
      { id: "d40", name: "D40 Chart Info", path: "d40-chart-info", group: "divisional", default: false },
      { id: "d45", name: "D45 Chart Info", path: "d45-chart-info", group: "divisional", default: false },
      { id: "d60", name: "D60 Chart Info", path: "d60-chart-info", group: "divisional", default: false },
      { id: "sunrise", name: "Sun Rise and Sun Set", path: "getsunriseandset", group: "panchang", default: false },
      { id: "tithi", name: "Tithi Timings", path: "tithi-durations", group: "panchang", default: false },
      { id: "nakshatra", name: "Nakshatra Durations", path: "nakshatra-durations", group: "panchang", default: false },
      { id: "yoga", name: "Yoga Timings", path: "yoga-durations", group: "panchang", default: false },
      { id: "karana", name: "Karana Timings", path: "karana-durations", group: "panchang", default: false },
      { id: "rahukalam", name: "Rahu Kalam", path: "rahu-kalam", group: "panchang", default: false },
      { id: "yamagandam", name: "Yama Gandam", path: "yama-gandam", group: "panchang", default: false },
      { id: "gulika", name: "Gulika Kalam", path: "gulika-kalam", group: "panchang", default: false },
      { id: "durmuhurat", name: "Dur Muhurat", path: "dur-muhurat", group: "panchang", default: false },
      { id: "varjyam", name: "Varjyam", path: "varjyam", group: "panchang", default: false },
      { id: "ashtakoot", name: "Ashtakoot Score", path: "match-making/ashtakoot-score", group: "match-making", default: false },
      { id: "shadbala-summary", name: "Shad Bala Summary", path: "shadbala/summary", group: "shadbala", default: false },
      { id: "shadbala-breakup", name: "Shad Bala Breakup", path: "shadbala/break-up", group: "shadbala", default: false },
      { id: "naisargika-bala", name: "Naisargika Bala (Shadbala)", path: "shadbala/naisargika-bala", group: "shadbala", default: false },
      { id: "drig-bala", name: "Drig Bala (Shadbala)", path: "shadbala/drig-bala", group: "shadbala", default: false },
      { id: "vim-maha", name: "Vimsottari Maha Dasas", path: "vimsottari/maha-dasas", group: "dasa", default: false },
      { id: "vim-maha-antar", name: "Vimsottari Maha + Antar Dasas", path: "vimsottari/dasa-information", group: "dasa", default: false }
    ];

    const zodiacMeta = {
      Aries: { number: 1, element: "Fire", modality: "Movable", lord: "Mars" },
      Taurus: { number: 2, element: "Earth", modality: "Fixed", lord: "Venus" },
      Gemini: { number: 3, element: "Air", modality: "Dual", lord: "Mercury" },
      Cancer: { number: 4, element: "Water", modality: "Movable", lord: "Moon" },
      Leo: { number: 5, element: "Fire", modality: "Fixed", lord: "Sun" },
      Virgo: { number: 6, element: "Earth", modality: "Dual", lord: "Mercury" },
      Libra: { number: 7, element: "Air", modality: "Movable", lord: "Venus" },
      Scorpio: { number: 8, element: "Water", modality: "Fixed", lord: "Mars" },
      Sagittarius: { number: 9, element: "Fire", modality: "Dual", lord: "Jupiter" },
      Capricorn: { number: 10, element: "Earth", modality: "Movable", lord: "Saturn" },
      Aquarius: { number: 11, element: "Air", modality: "Fixed", lord: "Saturn" },
      Pisces: { number: 12, element: "Water", modality: "Dual", lord: "Jupiter" }
    };

    const dignity = {
      Sun: { exalted: "Aries", debilitated: "Libra" },
      Moon: { exalted: "Taurus", debilitated: "Scorpio" },
      Mars: { exalted: "Capricorn", debilitated: "Cancer" },
      Mercury: { exalted: "Virgo", debilitated: "Pisces" },
      Jupiter: { exalted: "Cancer", debilitated: "Capricorn" },
      Venus: { exalted: "Pisces", debilitated: "Virgo" },
      Saturn: { exalted: "Libra", debilitated: "Aries" }
    };

    const relationMap = {
      Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"], neutral: ["Mercury"] },
      Moon: { friends: ["Sun", "Mercury"], enemies: [], neutral: ["Mars", "Jupiter", "Venus", "Saturn"] },
      Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"], neutral: ["Venus", "Saturn"] },
      Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"], neutral: ["Mars", "Jupiter", "Saturn"] },
      Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"], neutral: ["Saturn"] },
      Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"], neutral: ["Mars", "Jupiter"] },
      Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"], neutral: ["Jupiter"] }
    };

    const elementOrder = ["Fire", "Earth", "Air", "Water"];
    const modalityOrder = ["Movable", "Fixed", "Dual"];

    const state = {
      d1: null,
      d9: null,
      d10: null,
      d2: null,
      d11: null,
      d24: null,
      d60: null,
      analysis: "",
      summary: {},
      endpointOutputs: {},
      location: {
        query: "",
        candidates: [],
        selected: null
      }
    };

    const appRoot = globalThis;

    appRoot.state = state;
    appRoot.__ASTRO_STATE__ = state;

    function syncAstroState() {
      appRoot.state = state;
      appRoot.__ASTRO_STATE__ = state;
    }

    function refreshCareerEnginePanel() {
      if (!appRoot.CareerEngine || typeof appRoot.CareerEngine.render !== "function") return;
      const targetId = document.getElementById("careerOutput") ? "careerOutput" : "analysisOutput";
      try {
        const result = appRoot.CareerEngine.evaluateFromState ? appRoot.CareerEngine.evaluateFromState() : appRoot.CareerEngine.evaluate(state.d1 || {}, { d9: state.d9 || null, d10: state.d10 || null, d2: state.d2 || null, d24: state.d24 || null, d60: state.d60 || null });
        appRoot.CareerEngine.render(result, targetId);
      } catch (error) {
        const target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = `<div class="card tiny muted">Career engine could not run: ${escapeHtml(error.message)}</div>`;
        }
      }
    }

    function refreshWealthEnginePanel() {
      if (!appRoot.WealthEngine || typeof appRoot.WealthEngine.render !== "function") return;
      const targetId = document.getElementById("wealthOutput") ? "wealthOutput" : "analysisOutput";
      try {
        const result = appRoot.WealthEngine.evaluateFromState
          ? appRoot.WealthEngine.evaluateFromState()
          : appRoot.WealthEngine.evaluate(state.d1 || {}, {
              d9: state.d9 || null,
              d10: state.d10 || null,
              d11: state.d11 || null,
              d2: state.d2 || null,
              d24: state.d24 || null,
              d60: state.d60 || null
            });
        appRoot.WealthEngine.render(result, targetId);
      } catch (error) {
        const target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = `<div class="card tiny muted">Wealth engine could not run: ${escapeHtml(error.message)}</div>`;
        }
      }
    }

    function refreshTimingEnginePanel() {
      if (!appRoot.TimingEngine || typeof appRoot.TimingEngine.render !== "function") return;
      const targetId = document.getElementById("timingOutput") ? "timingOutput" : "analysisOutput";
      try {
        const result = appRoot.TimingEngine.evaluateFromState
          ? appRoot.TimingEngine.evaluateFromState()
          : appRoot.TimingEngine.evaluate(state.d1 || {}, {
              d9: state.d9 || null,
              d10: state.d10 || null,
              d11: state.d11 || null,
              d2: state.d2 || null,
              d24: state.d24 || null,
              d60: state.d60 || null,
              endpointOutputs: state.endpointOutputs || {}
            });
        appRoot.TimingEngine.render(result, targetId);
      } catch (error) {
        const target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = `<div class="card tiny muted">Timing engine could not run: ${escapeHtml(error.message)}</div>`;
        }
      }
    }

    const REQUEST_FLOW = {
      maxAttempts: 3,
      baseDelayMs: 450,
      betweenEndpointsMs: 320
    };

    const nodes = {
      name: document.getElementById("name"),
      dob: document.getElementById("dob"),
      tob: document.getElementById("tob"),
      location: document.getElementById("location"),
      timezone: document.getElementById("timezone"),
      analysisStyle: document.getElementById("analysisStyle"),
      config: document.getElementById("config"),
      findLocationBtn: document.getElementById("findLocationBtn"),
      locationStatus: document.getElementById("locationStatus"),
      locationSuggestions: document.getElementById("locationSuggestions"),
      locationMap: document.getElementById("locationMap"),
      demoBtn: document.getElementById("demoBtn"),
      submitBtn: document.getElementById("submitBtn"),
      selectAllApisBtn: document.getElementById("selectAllApisBtn"),
      clearApisBtn: document.getElementById("clearApisBtn"),
      chartApisBtn: document.getElementById("chartApisBtn"),
      apiEndpointList: document.getElementById("apiEndpointList"),
      apiSelectionText: document.getElementById("apiSelectionText"),
      apiResponseList: document.getElementById("apiResponseList"),
      modePill: document.getElementById("modePill"),
      statusText: document.getElementById("statusText"),
      d1Container: document.getElementById("d1Container"),
      d9Container: document.getElementById("d9Container"),
      referenceCards: document.getElementById("referenceCards"),
      houseTable: document.getElementById("houseTable"),
      strengthGrid: document.getElementById("strengthGrid"),
      queueSummary: document.getElementById("queueSummary"),
      divisionalCharts: document.getElementById("divisionalCharts"),
      shadbalaPanel: document.getElementById("shadbalaPanel"),
      dasaPanel: document.getElementById("dasaPanel"),
      loadedCount: document.getElementById("loadedCount"),
      loadingCount: document.getElementById("loadingCount"),
      queuedCount: document.getElementById("queuedCount"),
      failedCount: document.getElementById("failedCount"),
      analysisOutput: document.getElementById("analysisOutput"),
      analysisBar: document.getElementById("analysisBar"),
      wealthOutput: document.getElementById("wealthOutput"),
      runWealthBtn: document.getElementById("runWealthBtn"),
      timingOutput: document.getElementById("timingOutput"),
      runTimingBtn: document.getElementById("runTimingBtn"),
      rawDataBox: document.getElementById("rawDataBox"),
      includeSensitiveToggle: document.getElementById("includeSensitiveToggle"),
      copyJsonFormat: document.getElementById("copyJsonFormat"),
      toastContainer: document.getElementById("toastContainer"),
      copyDataBtn: document.getElementById("copyDataBtn"),
      downloadDataBtn: document.getElementById("downloadDataBtn"),
      chatPromptBox: document.getElementById("chatPromptBox"),
      copyPromptBtn: document.getElementById("copyPromptBtn"),
      copyForChatBtn: document.getElementById("copyForChatBtn"),
      planetCount: document.getElementById("planetCount"),
      houseCount: document.getElementById("houseCount"),
      strengthCount: document.getElementById("strengthCount"),
      karakaName: document.getElementById("karakaName")
    };

    // Helper: shallow key match for secrets
    const SECRET_KEY_RE = /(key|token|secret|password|api|astrok|astrokey|gemini|opencage|private)_?/i;

    function maskSecrets(obj) {
      const seen = new WeakSet();
      function _mask(value, key) {
        if (value && typeof value === 'object') {
          if (seen.has(value)) return value;
          seen.add(value);
          if (Array.isArray(value)) return value.map(v => _mask(v));
          const out = {};
          Object.keys(value).forEach(k => {
            try {
              if (SECRET_KEY_RE.test(k)) {
                out[k] = '***MASKED***';
              } else {
                out[k] = _mask(value[k], k);
              }
            } catch (e) {
              out[k] = '***ERROR***';
            }
          });
          return out;
        }
        // mask raw-looking keys in strings only when key matches
        if (typeof value === 'string') {
          // a heuristic: long alphanumeric tokens
          if ((value.length > 20 && /[A-Za-z0-9_\-]{12,}/.test(value))) return '***MASKED***';
        }
        return value;
      }
      try {
        return _mask(obj);
      } catch (e) {
        return obj;
      }
    }

    function parseConfig() {
      try {
        return { data: JSON.parse(nodes.config.value || "{}"), error: null };
      } catch (error) {
        return { data: {}, error: error };
      }
    }

    function hasAnyAstroKey(config) {
      return getAstroKeys(config).length > 0;
    }

    function getAstroKeys(config) {
      return Object.keys(config || {})
        .filter(key => /^astroKey\d+$/i.test(key))
        .map(key => normalizeKey(config[key]))
        .filter(Boolean);
    }

    function signInfo(sign) {
      return zodiacMeta[sign] || { number: "-", element: "-", modality: "-", lord: "-" };
    }

    function normalizeKey(key, fallback = "") {
      const value = (key || fallback || "").toString().trim();
      return value
        .replace(/^['"]+/, "")
        .replace(/['"]+$/, "")
        .trim();
    }

    function isLoadedChart(chart) {
      return chart && typeof chart === "object" && Object.keys(chart).length > 0;
    }

    function safeNumber(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function setLocationStatus(text) {
      if (nodes.locationStatus) {
        nodes.locationStatus.textContent = text;
      }
    }

    function buildMapEmbedUrl(lat, lng) {
      const delta = 0.02;
      const west = (lng - delta).toFixed(6);
      const south = (lat - delta).toFixed(6);
      const east = (lng + delta).toFixed(6);
      const north = (lat + delta).toFixed(6);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lng.toFixed(6)}`;
    }

    function formatLocationCandidate(candidate) {
      const parts = [];
      if (candidate?.components?.city) parts.push(candidate.components.city);
      if (candidate?.components?.state && candidate.components.state !== candidate.components.city) parts.push(candidate.components.state);
      if (candidate?.components?.country) parts.push(candidate.components.country);
      return parts.filter(Boolean).join(", ") || candidate?.formatted || "Unknown location";
    }

    function renderLocationMap(candidate) {
      if (!nodes.locationMap) return;
      if (!candidate?.geometry) {
        nodes.locationMap.src = "about:blank";
        return;
      }
      nodes.locationMap.src = buildMapEmbedUrl(candidate.geometry.lat, candidate.geometry.lng);
    }

    function renderLocationCandidates(candidates) {
      if (!nodes.locationSuggestions) return;
      if (!candidates || !candidates.length) {
        nodes.locationSuggestions.innerHTML = '<div class="tiny muted">No matches yet. Search a place name to load candidates.</div>';
        return;
      }

      nodes.locationSuggestions.innerHTML = candidates.map((candidate, index) => {
        const active = state.location.selected && state.location.selected.formatted === candidate.formatted;
        const label = formatLocationCandidate(candidate);
        const lat = Number(candidate.geometry?.lat).toFixed(6);
        const lng = Number(candidate.geometry?.lng).toFixed(6);
        return `
          <button type="button" class="location-option ${active ? 'active' : ''}" data-location-index="${index}">
            <div class="location-option-head">
              <strong>${escapeHtml(label)}</strong>
              <span class="tag info">Score ${candidate.confidence ?? '-'}</span>
            </div>
            <div class="tiny muted">${escapeHtml(candidate.formatted || label)}</div>
            <div class="location-option-coords">Lat ${lat} | Lng ${lng}</div>
          </button>
        `;
      }).join("");

      nodes.locationSuggestions.querySelectorAll(".location-option").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.locationIndex);
          const candidate = candidates[index];
          if (!candidate) return;
          state.location.selected = candidate;
          nodes.location.value = candidate.formatted || nodes.location.value;
          renderLocationCandidates(candidates);
          renderLocationMap(candidate);
          setLocationStatus(`Using ${formatLocationCandidate(candidate)} for chart generation.`);
        });
      });
    }

    async function fetchLocationCandidates(location, opencageKey, limit = 5) {
      const query = (location || "").trim();
      if (!query) {
        throw new Error("Please enter a birth location first.");
      }
      if (!opencageKey) {
        throw new Error("OpenCage API key is missing. Add it in the config box to search locations.");
      }

      const endpoint = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${encodeURIComponent(opencageKey)}&limit=${limit}&no_annotations=0&language=en`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`OpenCage error: ${response.status}`);
      const data = await response.json();
      return Array.isArray(data?.results) ? data.results.slice(0, limit) : [];
    }

    async function resolveLocation(profile, opencageKey) {
      const selected = state.location.selected;
      if (selected && selected.formatted && selected.formatted.toLowerCase() === profile.location.toLowerCase()) {
        return selected;
      }

      const candidates = await fetchLocationCandidates(profile.location, opencageKey, 5);
      state.location.candidates = candidates;
      renderLocationCandidates(candidates);
      if (!candidates.length) {
        throw new Error("OpenCage did not return any location matches for the selected birthplace.");
      }

      const primary = candidates[0];
      renderLocationMap(primary);
      setLocationStatus(`Showing ${candidates.length} location match${candidates.length === 1 ? "" : "es"}. Choose the most precise birthplace.`);
      return primary;
    }

    function renderEndpointSelector() {
      nodes.apiEndpointList.innerHTML = API_CATALOG.map(item => `
        <label class="endpoint-item">
          <input type="checkbox" data-api-id="${item.id}" ${item.default || item.required ? "checked" : ""} ${item.required ? "disabled" : ""} />
          <div>
            <div class="title">${item.name}</div>
            <div class="path">/${item.path}</div>
          </div>
        </label>
      `).join("");
      updateApiSelectionText();
    }

    function getSelectedApis() {
      const selected = [];
      nodes.apiEndpointList.querySelectorAll("input[data-api-id]").forEach(input => {
        if (input.checked) {
          const endpoint = API_CATALOG.find(item => item.id === input.dataset.apiId);
          if (endpoint) selected.push(endpoint);
        }
      });
      return selected;
    }

    function updateApiSelectionText() {
      const count = getSelectedApis().length;
      nodes.apiSelectionText.textContent = `${count} endpoints selected`;
    }

    function setApiSelection(mode) {
      nodes.apiEndpointList.querySelectorAll("input[data-api-id]").forEach(input => {
        const item = API_CATALOG.find(api => api.id === input.dataset.apiId);
        if (!item || item.required) return;
        if (mode === "all") input.checked = true;
        if (mode === "none") input.checked = false;
        if (mode === "divisional") input.checked = item.group === "divisional";
      });
      updateApiSelectionText();
    }

    function renderApiResponses(responses) {
      const entries = Object.entries(responses || {});
      if (!entries.length) {
        nodes.apiResponseList.innerHTML = '<div class="card tiny muted">No API responses captured yet.</div>';
        return;
      }
      nodes.apiResponseList.innerHTML = entries.map(([id, result]) => {
        const endpoint = API_CATALOG.find(item => item.id === id);
        const title = endpoint ? endpoint.name : id;
        if (!result.ok) {
          return `
            <div class="response-card">
              <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                <strong>${title}</strong>
                <span class="tag bad">Failed</span>
              </div>
              <div class="tiny muted">${result.error || "Unknown error"}</div>
            </div>
          `;
        }
        return `
          <div class="response-card">
            <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
              <strong>${title}</strong>
              <span class="tag good">Success</span>
            </div>
            <div class="tiny muted">/${endpoint?.path || id}</div>
            <pre>${escapeHtml(JSON.stringify(result.data, null, 2))}</pre>
          </div>
        `;
      }).join("");
      updateRawDataBox();
    }

    function escapeHtml(text) {
      return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function formatDegree(data = {}) {
      const degrees = data.degrees ?? data.degree ?? 0;
      const minutes = data.minutes ?? 0;
      const seconds = data.seconds ?? 0;
      return `${degrees}° ${minutes}' ${Math.floor(seconds)}"`;
    }

    function renderD1(chart) {
      if (!isLoadedChart(chart)) {
        nodes.d1Container.innerHTML = '<span class="muted">No D1 data available.</span>';
        return;
      }
      const entries = Object.entries(chart);
      nodes.d1Container.innerHTML = entries.map(([planet, data]) => {
        const sign = data.zodiac_sign_name || data.sign || "Unknown";
        const info = signInfo(sign);
        return `
          <div style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:8px;">
              <strong>${planet}</strong>
              <span class="tag info">House ${data.house_number ?? "-"}</span>
            </div>
            <div class="tiny muted">Sign: <b>${sign}</b> | Lord: <b>${info.lord}</b> | Element: <b>${info.element}</b> | Modality: <b>${info.modality}</b></div>
            <div class="tiny muted">Nakshatra: <b>${data.nakshatra_name || "-"}</b> | Pada: <b>${data.nakshatra_pada ?? "-"}</b> | Degree: <b>${formatDegree(data)}</b> | Retrograde: <b>${String(data.isRetro) === "true" ? "Yes" : "No"}</b></div>
          </div>
        `;
      }).join("");
    }

    function renderD9(chart) {
      if (!isLoadedChart(chart)) {
        nodes.d9Container.innerHTML = '<span class="muted">No D9 data available.</span>';
        return;
      }
      const entries = Object.entries(chart);
      nodes.d9Container.innerHTML = entries.map(([key, data]) => `
        <div style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:8px;">
            <strong>${data.name || key}</strong>
            <span class="tag info">House ${data.house_number ?? "-"}</span>
          </div>
          <div class="tiny muted">Current Sign: <b>${data.current_sign || data.zodiac_sign_name || "-"}</b> | Retrograde: <b>${String(data.isRetro) === "true" ? "Yes" : "No"}</b></div>
        </div>
      `).join("");
    }

    function countHouseCoverage(d1) {
      const houses = new Set();
      Object.values(d1 || {}).forEach(item => {
        if (item && item.house_number) houses.add(Number(item.house_number));
      });
      return houses.size;
    }

    function getPlanetStrengthLabel(planet, sign) {
      const info = dignity[planet];
      if (!info) return { label: "Neutral", tone: "info" };
      if (sign === info.exalted) return { label: "Exalted", tone: "good" };
      if (sign === info.debilitated) return { label: "Debilitated", tone: "bad" };
      return { label: "Normal", tone: "warn" };
    }

    function buildReferenceCards(chart) {
      const samplePlanet = state.summary.atmakaraka || "Jupiter";
      const sampleSign = state.summary.atmakarakaSign || "Cancer";
      const sampleRelation = relationMap[samplePlanet] || { friends: [], enemies: [], neutral: [] };

      const cards = [
        {
          title: "Atmakaraka",
          body: `Detected soul significator: ${samplePlanet} in ${sampleSign}. This planet becomes central for karmic direction, character maturation, and long-term soul lessons.`,
          tags: [samplePlanet, sampleSign, state.summary.atmakarakaElement || "-"]
        },
        {
          title: "Friend / Enemy Sign",
          body: `The same planet should also be judged by sign lord friendship. A planet placed in a sign owned by a friend gives smoother results than when placed in an enemy sign.`,
          tags: [
            `Friends: ${sampleRelation.friends.join(", ") || "-"}`,
            `Enemies: ${sampleRelation.enemies.join(", ") || "-"}`,
            `Neutral: ${sampleRelation.neutral.join(", ") || "-"}`
          ]
        },
        {
          title: "Exaltation / Debilitation",
          body: `Use dignity to see where a planet works at maximum strength and where it becomes challenged. This platform highlights those placements for every visible chart entry.`,
          tags: ["Exaltation", "Debilitation", "Dignity check"]
        }
      ];

      nodes.referenceCards.innerHTML = cards.map(card => `
        <div class="card">
          <h3>${card.title}</h3>
          <div class="tiny muted" style="margin-bottom: 12px;">${card.body}</div>
          <div>${card.tags.map(tag => `<span class="tag info">${tag}</span>`).join("")}</div>
        </div>
      `).join("");
    }

    function getCurrentSigns(d1) {
      return Object.values(d1 || {})
        .map(item => item.zodiac_sign_name || item.sign)
        .filter(Boolean);
    }

    function getStatusBadge(status) {
      const badges = {
        loaded: '<span style="color:#4ade80; font-size:14px;">✅ Loaded</span>',
        loading: '<span style="display:inline-flex; align-items:center; gap:4px; color:#fbbf24;"><span style="display:inline-block; width:12px; height:12px; border:2px solid #fbbf24; border-radius:50%; border-top-color:transparent; animation:spin 0.8s linear infinite;"></span> Loading</span>',
        queued: '<span style="color:#9ca3af;">⏸ Queued</span>',
        failed: '<span style="color:#f87171;">❌ Failed</span>'
      };
      return badges[status] || badges.queued;
    }

    function renderDivisionalCharts(queueState) {
      const divisionalIds = ["d2", "d3", "d4", "d5", "d6", "d7", "d8", "d10", "d11", "d12", "d16", "d20", "d24", "d27", "d30", "d40", "d45", "d60"];
      const entries = divisionalIds.map(id => {
        const endpoint = API_CATALOG.find(e => e.id === id);
        const status = queueState[id] || "queued";
        const result = state.endpointOutputs[id];
        const title = endpoint?.name || id;
        
        let body = "";
        if (result?.data?.output && typeof result.data.output === "object") {
          const planets = Object.keys(result.data.output).slice(0, 3);
          body = planets.length ? `Planets: ${planets.join(", ")}...` : "Data loaded";
        } else {
          body = "Waiting for fetch...";
        }

        return `
          <div class="response-card" style="opacity: ${status === 'queued' ? 0.6 : 1};">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:8px;">
              <strong>${title}</strong>
              <div>${getStatusBadge(status)}</div>
            </div>
            <div class="tiny muted">${body}</div>
            ${result?.attempts ? `<div class="tiny" style="margin-top:6px; color:#9ca3af;">Attempts: ${result.attempts}/${REQUEST_FLOW.maxAttempts}</div>` : ""}
          </div>
        `;
      }).join("");

      nodes.divisionalCharts.innerHTML = entries || '<div class="card tiny muted">No divisional charts loaded yet.</div>';
    }

    function renderShadbala(queueState) {
      const shabdalaIds = ["shadbala-summary", "shadbala-breakup", "naisargika-bala", "drig-bala"];
      const entries = shabdalaIds.map(id => {
        const endpoint = API_CATALOG.find(e => e.id === id);
        const status = queueState[id] || "queued";
        const result = state.endpointOutputs[id];
        const title = endpoint?.name || id;

        let body = "";
        if (result?.data?.output) {
          if (typeof result.data.output === "object") {
            const keys = Object.keys(result.data.output).slice(0, 5);
            body = keys.length ? `Metrics: ${keys.join(", ")}...` : "Data loaded";
          } else {
            body = JSON.stringify(result.data.output).substring(0, 100) + "...";
          }
        } else {
          body = "Waiting for fetch...";
        }

        return `
          <div class="response-card" style="opacity: ${status === 'queued' ? 0.6 : 1};">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:8px;">
              <strong>${title}</strong>
              <div>${getStatusBadge(status)}</div>
            </div>
            <div class="tiny muted">${body}</div>
            ${result?.attempts ? `<div class="tiny" style="margin-top:6px; color:#9ca3af;">Attempts: ${result.attempts}/${REQUEST_FLOW.maxAttempts}</div>` : ""}
          </div>
        `;
      }).join("");

      nodes.shadbalaPanel.innerHTML = entries || '<div class="card tiny muted">No shadbala data loaded yet.</div>';
    }

    function renderDasa(queueState) {
      const dasaIds = ["vim-maha", "vim-maha-antar"];
      const entries = dasaIds.map(id => {
        const endpoint = API_CATALOG.find(e => e.id === id);
        const status = queueState[id] || "queued";
        const result = state.endpointOutputs[id];
        const title = endpoint?.name || id;

        let body = "";
        if (result?.data?.output) {
          if (Array.isArray(result.data.output)) {
            body = `${result.data.output.length} periods loaded`;
          } else if (typeof result.data.output === "object") {
            const keys = Object.keys(result.data.output).slice(0, 3);
            body = keys.length ? `Lords: ${keys.join(", ")}...` : "Data loaded";
          } else {
            body = "Data loaded";
          }
        } else {
          body = "Waiting for fetch...";
        }

        return `
          <div class="response-card" style="opacity: ${status === 'queued' ? 0.6 : 1};">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:8px;">
              <strong>${title}</strong>
              <div>${getStatusBadge(status)}</div>
            </div>
            <div class="tiny muted">${body}</div>
            ${result?.attempts ? `<div class="tiny" style="margin-top:6px; color:#9ca3af;">Attempts: ${result.attempts}/${REQUEST_FLOW.maxAttempts}</div>` : ""}
          </div>
        `;
      }).join("");

      nodes.dasaPanel.innerHTML = entries || '<div class="card tiny muted">No dasa timeline loaded yet.</div>';
    }

    function updateQueueDisplay(queueState) {
      const statuses = Object.values(queueState || {});
      const loadedCount = statuses.filter(s => s === "loaded").length;
      const loadingCount = statuses.filter(s => s === "loading").length;
      const queuedCount = statuses.filter(s => s === "queued").length;
      const failedCount = statuses.filter(s => s === "failed").length;

      nodes.loadedCount.textContent = loadedCount;
      nodes.loadingCount.textContent = loadingCount;
      nodes.queuedCount.textContent = queuedCount;
      nodes.failedCount.textContent = failedCount;

      renderDivisionalCharts(queueState);
      renderShadbala(queueState);
      renderDasa(queueState);
    }

    function computeAtmakaraka(d1) {
      const planets = PLANETS.filter(p => d1 && d1[p]);
      let best = null;
      planets.forEach(planet => {
        const item = d1[planet];
        const sign = item.zodiac_sign_name || item.sign || "";
        const score = safeNumber(item.degrees) + safeNumber(item.minutes) / 60 + safeNumber(item.seconds) / 3600;
        if (!best || score > best.score) {
          best = { planet, sign, score, item };
        }
      });
      if (!best) return { planet: "-", sign: "-", score: 0, item: null };
      return best;
    }

    // Compute basic Bala metrics (heuristic placeholders) for display
    function computeBalaSummary(d1) {
      const balas = {};
      const defaultNaisargika = {
        Sun: 60, Moon: 55, Mars: 75, Mercury: 55, Jupiter: 80, Venus: 70, Saturn: 65
      };

      Object.keys(d1 || {}).forEach(planet => {
        const item = d1[planet] || {};
        const deg = safeNumber(item.degrees, 0);
        const house = safeNumber(item.house_number, 0);
        const isRetro = String(item.isRetro) === "true";

        const Sthana = Math.min(100, Math.round(50 + (deg / 30) * 50));
        const Kaala = isRetro ? 40 : 70; // simple time-motion heuristic
        const Dig = house >= 1 && house <= 12 ? Math.max(10, Math.round(((13 - house) / 12) * 100)) : 50;
        const Cheshta = isRetro ? 70 : 55; // motion/activity
        // Drig: use dignity to approximate aspect/visibility strength
        const sign = item.zodiac_sign_name || item.sign || "-";
        const dignityLabel = getPlanetStrengthLabel(planet, sign).label;
        const Drig = dignityLabel === 'Exalted' ? 90 : dignityLabel === 'Debilitated' ? 25 : 55;
        const Naisargika = defaultNaisargika[planet] ?? 50;

        balas[planet] = {
          SthanaBala: Sthana,
          KaalaBala: Kaala,
          DigBala: Dig,
          CheshtaBala: Cheshta,
          DrigBala: Drig,
          NaisargikaBala: Naisargika
        };
      });

      // Also produce an overall summary object averaging across planets
      const planets = Object.keys(balas);
      const overall = {};
      if (planets.length) {
        ['SthanaBala','KaalaBala','DigBala','CheshtaBala','DrigBala','NaisargikaBala'].forEach(key => {
          const sum = planets.reduce((s,p) => s + (balas[p][key] || 0), 0);
          overall[key] = Math.round(sum / planets.length);
        });
      }

      return { perPlanet: balas, overall };
    }

    function buildHouseRows(d1) {
      const rows = [];
      const occupantsByHouse = {};
      Object.entries(d1 || {}).forEach(([planet, data]) => {
        const house = Number(data.house_number || 0);
        if (!occupantsByHouse[house]) occupantsByHouse[house] = [];
        occupantsByHouse[house].push(planet);
      });

      for (let house = 1; house <= 12; house++) {
        const sign = Object.keys(zodiacMeta).find(key => zodiacMeta[key].number === house) || "-";
        const info = signInfo(sign);
        const lord = info.lord;
        const occupantList = occupantsByHouse[house] && occupantsByHouse[house].length ? occupantsByHouse[house].join(", ") : "None";
        const aspects = occupantsByHouse[house] && occupantsByHouse[house].length ? `Strong focus on ${sign}; evaluate lord ${lord} for results.` : `No planet occupies this house directly; read from house lord and aspects.`;
        const meaning = houseMeaning(house, sign, lord, occupantList);
        rows.push(`
          <tr>
            <td><b>${house}</b></td>
            <td>${sign}<div class="tiny muted">${info.element} | ${info.modality}</div></td>
            <td>${lord}</td>
            <td>${occupantList}</td>
            <td>${aspects}</td>
            <td>${meaning}</td>
          </tr>
        `);
      }

      nodes.houseTable.innerHTML = rows.join("");
    }

    function houseMeaning(house, sign, lord, occupants) {
      const meaningMap = {
        1: "Identity, temperament, physical vitality, and the first impression in life.",
        2: "Family lineage, wealth accumulation, speech, food habits, and personal values.",
        3: "Effort, initiative, communication, courage, skills, and sibling dynamics.",
        4: "Home, emotional security, mother, property, and inner peace.",
        5: "Intelligence, mantra, creativity, romance, children, and purva punya.",
        6: "Health routines, competition, service, disputes, and problem-solving.",
        7: "Marriage, partnerships, contracts, public dealings, and relationship karma.",
        8: "Longevity, transformation, joint resources, hidden matters, and crisis response.",
        9: "Luck, dharma, teachers, beliefs, higher guidance, and long-distance travel.",
        10: "Career, status, responsibility, karma in public life, and achievement.",
        11: "Gains, networks, recognition, wishes, and large-scale results.",
        12: "Expenses, isolation, sleep, liberation, foreign places, and endings."
      };
      return `${meaningMap[house]} House lord ${lord} and occupants ${occupants} determine how this area becomes active.`;
    }

    function buildStrengthGrid(d1) {
      const entries = Object.entries(d1 || {});
      const cards = [];
      entries.forEach(([planet, data]) => {
        const sign = data.zodiac_sign_name || data.sign || "-";
        const signData = signInfo(sign);
        const strength = getPlanetStrengthLabel(planet, sign);
        cards.push({
          planet,
          sign,
          signData,
          strength,
          relation: relationMap[planet] || { friends: [], enemies: [], neutral: [] }
        });
      });

      nodes.strengthGrid.innerHTML = cards.map(card => {
        const bala = (state.summary?.balas?.perPlanet || {})[card.planet] || null;
        const balaHtml = bala ? `
            <div style="margin-top:10px;">
              <div class="tiny muted">Bala scores:</div>
              <div class="tiny" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
                <span class="tag info">Sthana:${bala.SthanaBala}</span>
                <span class="tag">Kaala:${bala.KaalaBala}</span>
                <span class="tag">Dig:${bala.DigBala}</span>
                <span class="tag">Cheshta:${bala.CheshtaBala}</span>
                <span class="tag">Drig:${bala.DrigBala}</span>
                <span class="tag">Naisargika:${bala.NaisargikaBala}</span>
              </div>
            </div>
          ` : '';

        return `
          <div class="card">
            <h4>${card.planet}</h4>
            <div class="tiny muted" style="margin-bottom: 10px;">Sign: <b>${card.sign}</b> | Lord: <b>${card.signData.lord}</b></div>
            <div class="tag ${card.strength.tone}">${card.strength.label}</div>
            <div class="tiny muted" style="margin-top: 10px;">Exalted in <b>${dignity[card.planet]?.exalted || "-"}</b></div>
            <div class="tiny muted">Debilitated in <b>${dignity[card.planet]?.debilitated || "-"}</b></div>
            <div class="tiny muted">Friends: ${card.relation.friends.join(", ") || "-"}</div>
            <div class="tiny muted">Enemies: ${card.relation.enemies.join(", ") || "-"}</div>
            ${balaHtml}
          </div>
        `;
      }).join("");
    }

    function updateSummary(d1, d9) {
      const atma = computeAtmakaraka(d1);
      state.summary.atmakaraka = atma.planet;
      state.summary.atmakarakaSign = atma.sign;
      state.summary.atmakarakaElement = signInfo(atma.sign).element;
      // compute Bala metrics
      state.summary.balas = computeBalaSummary(d1 || {});
      const houses = countHouseCoverage(d1);
      const planets = Object.keys(d1 || {}).length;
      const strengths = Object.entries(d1 || {}).filter(([planet, data]) => getPlanetStrengthLabel(planet, data.zodiac_sign_name || data.sign || "-").label !== "Normal").length;

      nodes.planetCount.textContent = planets;
      nodes.houseCount.textContent = houses;
      nodes.strengthCount.textContent = strengths;
      nodes.karakaName.textContent = atma.planet || "-";

      buildReferenceCards(d1);
      buildHouseRows(d1);
      buildStrengthGrid(d1);
      renderKundliChart(d1);
      nodes.analysisBar.style.setProperty("--w", `${Math.min(100, 25 + planets * 9)}%`);
      updateRawDataBox();
      // update visual charts when summary changes
      try { updateChartsFromState(); } catch (e) { /* ignore if charts not ready */ }
    }

    function getRawDataSnapshot() {
      const profile = {
        name: nodes.name?.value || "",
        dob: nodes.dob?.value || "",
        tob: nodes.tob?.value || "",
        location: nodes.location?.value || "",
        timezone: nodes.timezone?.value || "",
        analysisStyle: nodes.analysisStyle?.value || ""
      };
      return {
        profile,
        d1: state.d1,
        d9: state.d9,
        endpoints: state.endpointOutputs,
        summary: state.summary,
        analysis: state.analysis
      };
    }
    function updateRawDataBox() {
      const box = nodes.rawDataBox;
      if (!box) return;
      try {
        // show pretty / masked by default in UI
        const snapshot = getRawDataSnapshot();
        const includeSensitive = nodes.includeSensitiveToggle && nodes.includeSensitiveToggle.checked;
        const visible = includeSensitive ? snapshot : maskSecrets(snapshot);
        box.value = JSON.stringify(visible, null, 2);
      } catch (e) {
        box.value = "{" + "}\n" + "Error serializing data";
      }
      updatePromptBox();
    }

    function generateChatPrompt() {
      const present = [];
      if (state.d1) present.push('D1 (Rasi)');
      if (state.d9) present.push('D9 (Navamsa)');
      const divisionalIds = Object.keys(state.endpointOutputs || {}).filter(id => id.startsWith('d') && id !== 'd1' && id !== 'd9');
      if (divisionalIds.length) present.push(`Divisional: ${divisionalIds.join(', ')}`);

      const atma = state.summary?.atmakaraka || '-';
      const planets = Object.keys(state.d1 || {}).length || 0;
      const houses = countHouseCoverage(state.d1 || {});

      const style = nodes.analysisStyle?.value || 'professional';

      return 'You are an expert Vedic astrology analyst. Use only the data provided below to generate a clear, professional reading for a client.\n\n' +
        'Charts included: ' + (present.length ? present.join('; ') : 'None (no chart data)') + '.\n' +
        'Atmakaraka (if detected): ' + atma + '.\n' +
        'Planets parsed: ' + planets + '. Houses occupied: ' + houses + '.\n' +
        'Desired report style: ' + style + '.\n\n' +
        'Instructions:\n' +
        '- First, provide a 3-sentence executive summary suitable for a client.\n' +
        '- Next, list key strengths and vulnerabilities (3 bullets each) based only on the provided placements and dignity signals.\n' +
        '- Then give 6 concise, actionable recommendations the client can follow (health, career, relationships, timing, remedies).\n' +
        '- After that, include a short paragraph that explains how you used D1 vs D9 to reach conclusions.\n' +
        '- Finally, if information is missing or ambiguous (missing D1/D9), state what extra data you would need.\n\n' +
        'Now analyze the JSON data that follows. Do not invent additional chart placements.';
    }

    function updatePromptBox() {
      const box = nodes.chatPromptBox;
      if (!box) return;
      try {
        box.value = generateChatPrompt();
      } catch (e) {
        box.value = 'Error generating prompt.';
      }
    }

    async function copyPromptToClipboard() {
      const box = nodes.chatPromptBox;
      if (!box) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(box.value);
        } else {
          box.select();
          document.execCommand('copy');
        }
        setStatus('Copied', 'Prompt copied to clipboard');
      } catch (err) {
        setStatus('Error', 'Unable to copy prompt');
      }
    }

    async function copyPromptWithJson() {
      const promptBox = nodes.chatPromptBox;
      const rawBox = nodes.rawDataBox;
      if (!promptBox || !rawBox) return;
      try {
        // Collapse prompt newlines to reduce line count but keep text
        const compactPrompt = promptBox.value.replace(/\s*\n\s*/g, ' ').trim();
        const includeSensitive = nodes.includeSensitiveToggle && nodes.includeSensitiveToggle.checked;
        const format = nodes.copyJsonFormat ? nodes.copyJsonFormat.value : 'compact';
        const snapshot = getRawDataSnapshot();
        const toExport = includeSensitive ? snapshot : maskSecrets(snapshot);
        const jsonPart = format === 'pretty' ? JSON.stringify(toExport, null, 2) : JSON.stringify(toExport);
        const combined = compactPrompt + '\n\n' + '```json\n' + jsonPart + '\n```';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(combined);
        } else {
          const ta = document.createElement('textarea');
          ta.value = combined;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setStatus('Copied', 'Prompt + JSON copied to clipboard');
      } catch (err) {
        setStatus('Error', 'Unable to copy combined prompt');
      }
    }

    async function copyRawDataToClipboard() {
      const box = nodes.rawDataBox;
      if (!box) return;
      try {
        const includeSensitive = nodes.includeSensitiveToggle && nodes.includeSensitiveToggle.checked;
        const format = nodes.copyJsonFormat ? nodes.copyJsonFormat.value : 'compact';
        const snapshot = getRawDataSnapshot();
        const toExport = includeSensitive ? snapshot : maskSecrets(snapshot);
        const out = format === 'pretty' ? JSON.stringify(toExport, null, 2) : JSON.stringify(toExport);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(out);
        } else {
          const ta = document.createElement('textarea');
          ta.value = out;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setStatus('Copied', 'Raw JSON copied to clipboard');
      } catch (err) {
        setStatus('Error', 'Unable to copy to clipboard');
      }
    }

    function downloadRawData() {
      const snapshot = getRawDataSnapshot();
      const includeSensitive = nodes.includeSensitiveToggle && nodes.includeSensitiveToggle.checked;
      const format = nodes.copyJsonFormat ? nodes.copyJsonFormat.value : 'compact';
      const toExport = includeSensitive ? snapshot : maskSecrets(snapshot);
      const out = format === 'pretty' ? JSON.stringify(toExport, null, 2) : JSON.stringify(toExport);
      const blob = new Blob([out], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('Downloaded', 'Raw JSON downloaded');
    }

    function buildDemoCharts() {
      return {
        d1: {
          Sun: { zodiac_sign_name: "Cancer", nakshatra_name: "Pushya", nakshatra_pada: 2, house_number: 1, degrees: 27, minutes: 12, seconds: 13, isRetro: "false" },
          Moon: { zodiac_sign_name: "Virgo", nakshatra_name: "Hasta", nakshatra_pada: 4, house_number: 3, degrees: 18, minutes: 2, seconds: 21, isRetro: "false" },
          Mars: { zodiac_sign_name: "Aries", nakshatra_name: "Ashwini", nakshatra_pada: 1, house_number: 10, degrees: 29, minutes: 41, seconds: 0, isRetro: "false" },
          Mercury: { zodiac_sign_name: "Leo", nakshatra_name: "Magha", nakshatra_pada: 4, house_number: 2, degrees: 12, minutes: 50, seconds: 50, isRetro: "false" },
          Jupiter: { zodiac_sign_name: "Pisces", nakshatra_name: "Revati", nakshatra_pada: 3, house_number: 9, degrees: 24, minutes: 8, seconds: 15, isRetro: "false" },
          Venus: { zodiac_sign_name: "Taurus", nakshatra_name: "Rohini", nakshatra_pada: 2, house_number: 11, degrees: 14, minutes: 19, seconds: 10, isRetro: "false" },
          Saturn: { zodiac_sign_name: "Capricorn", nakshatra_name: "Shravana", nakshatra_pada: 1, house_number: 7, degrees: 20, minutes: 33, seconds: 12, isRetro: "true" }
        },
        d9: {
          Sun: { name: "Sun", current_sign: "Leo", house_number: 5, isRetro: "false" },
          Moon: { name: "Moon", current_sign: "Gemini", house_number: 11, isRetro: "false" },
          Mars: { name: "Mars", current_sign: "Aries", house_number: 9, isRetro: "false" },
          Mercury: { name: "Mercury", current_sign: "Virgo", house_number: 6, isRetro: "false" },
          Jupiter: { name: "Jupiter", current_sign: "Cancer", house_number: 4, isRetro: "false" },
          Venus: { name: "Venus", current_sign: "Pisces", house_number: 2, isRetro: "false" },
          Saturn: { name: "Saturn", current_sign: "Libra", house_number: 8, isRetro: "true" }
        }
      };
    }

    function generateFallbackReport(d1, d9, profile) {
      const atma = computeAtmakaraka(d1);
      const houseCount = countHouseCoverage(d1);
      const signs = getCurrentSigns(d1);
      const elementCounts = signs.reduce((acc, sign) => {
        const element = signInfo(sign).element;
        acc[element] = (acc[element] || 0) + 1;
        return acc;
      }, {});
      const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Balanced";
      const style = profile.analysisStyle || "professional";
      const lines = [];
      lines.push(`Client: ${profile.name}`);
      lines.push(`Birth Details: ${profile.dob} | ${profile.tob} | ${profile.location} | Timezone ${profile.timezone}`);
      lines.push(`Report Style: ${style}`);
      lines.push("");
      lines.push(`1. Atmakaraka: ${atma.planet} in ${atma.sign}. This becomes the primary karmic indicator and should be treated as the soul's leading lesson.`);
      lines.push(`2. Dominant element: ${dominantElement}. This indicates the native's strongest natural operating mode.`);
      lines.push(`3. House coverage: ${houseCount} houses are actively occupied in the current D1 sample.`);
      lines.push(`4. D1 dignity check: planets are being mapped against exaltation and debilitation to identify strong and weak channels.`);
      lines.push(`5. D9 check: Navamsa support confirms how the promise of the D1 chart matures with time, especially in marriage, dharma, and inner strength.`);
      lines.push("");

      PLANETS.forEach((planet, index) => {
        if (!d1[planet]) return;
        const item = d1[planet];
        const sign = item.zodiac_sign_name || "-";
        const info = signInfo(sign);
        const rel = relationMap[planet] || { friends: [], enemies: [], neutral: [] };
        const strength = getPlanetStrengthLabel(planet, sign);
        lines.push(`${index + 6}. ${planet}: placed in ${sign} (${info.element}, ${info.modality}) in house ${item.house_number || "-"}. Sign lord is ${info.lord}. This planet is ${strength.label.toLowerCase()} by dignity logic in the present placement.`);
        lines.push(`   - Relation filter: friends ${rel.friends.join(", ") || "-"}; enemies ${rel.enemies.join(", ") || "-"}; neutral ${rel.neutral.join(", ") || "-"}.`);
        lines.push(`   - Exaltation: ${dignity[planet]?.exalted || "-"}; debilitation: ${dignity[planet]?.debilitated || "-"}.`);
        lines.push(`   - Interpretation: assess the planet's house function, house lordship, aspects, and dignity together instead of reading it in isolation.`);
      });

      lines.push("");
      lines.push(`House lens:`);
      for (let house = 1; house <= 12; house++) {
        const sign = Object.keys(zodiacMeta).find(key => zodiacMeta[key].number === house) || "-";
        const info = signInfo(sign);
        lines.push(`- House ${house}: ${sign} (${info.element}, ${info.modality}), lord ${info.lord}. Judge this area through the lord, occupants, and aspect pressure.`);
      }
      lines.push("");
      lines.push(`Professional reading:`);
      lines.push(`- Nature and thinking are indicated by the balance between fire, earth, air, and water placements, along with the Moon and Mercury condition.`);
      lines.push(`- Love and marriage depend primarily on the 5th, 7th, Venus, Navamsa support, and the relationship between D1 promise and D9 maturity.`);
      lines.push(`- Career strength is read from the 10th house, its lord, Saturn, Sun, and any linkage to the 2nd, 6th, and 11th houses.`);
      lines.push(`- Health must be read from the 1st, 6th, 8th, and 12th houses, together with Moon, Sun, Mars, and Saturn stress indicators.`);
      lines.push(`- Atmakaraka ${atma.planet} should be interpreted in its sign, house, and Navamsa placement for the deepest karmic narrative.`);
      lines.push("");
      lines.push(`Note: This fallback report is generated locally. To produce a live chart-based narrative, add working API keys in the config box and run again.`);
      return lines.join("\n");
    }

    function setStatus(mode, text) {
      try {
        nodes.modePill.textContent = mode;
        nodes.statusText.textContent = text;
      } catch (e) {}
      // show transient toast
      try { showToast(mode, text); } catch (e) {}
    }

    function showToast(title, message, ms = 3200) {
      const container = nodes.toastContainer || document.getElementById('toastContainer');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast-card';
      el.setAttribute('role', 'status');
      el.innerHTML = `<strong style="display:block; font-size:13px; margin-bottom:6px;">${escapeHtml(String(title))}</strong><div style="font-size:13px; color:var(--muted);">${escapeHtml(String(message))}</div>`;
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
      }, ms);
    }

    // Save astro data to sessionStorage for divisional charts page
    function saveAstroDataToSession(state) {
      try {
        const profile = {
          name: document.getElementById("name").value || "Client",
          dob: document.getElementById("dob").value || "",
          tob: document.getElementById("tob").value || "",
          location: document.getElementById("location").value || "",
          timezone: document.getElementById("timezone").value || ""
        };
        
        const dataToSave = {
          d1: state.d1 || {},
          d9: state.d9 || {},
          endpointOutputs: state.endpointOutputs || {},
          summary: state.summary || {},
          analysis: state.analysis || "",
          profile: profile,
          timestamp: new Date().toISOString()
        };
        
        // Save to sessionStorage
        sessionStorage.setItem('astroData', JSON.stringify(dataToSave));
        
        // Also log to console for debugging
        console.log('✓ Astro data saved to sessionStorage:', {
          d1Planets: Object.keys(dataToSave.d1).length,
          d9Planets: Object.keys(dataToSave.d9).length,
          endpointsLoaded: Object.keys(dataToSave.endpointOutputs).length,
          profile: profile
        });
        
        return true;
      } catch (err) {
        console.error('Failed to save astro data to sessionStorage:', err);
        return false;
      }
    }

      // Attach copy/download handlers for raw data box
      try {
        if (nodes.copyDataBtn) nodes.copyDataBtn.addEventListener('click', copyRawDataToClipboard);
        if (nodes.downloadDataBtn) nodes.downloadDataBtn.addEventListener('click', downloadRawData);
        // initial populate
        updateRawDataBox();
        if (nodes.copyPromptBtn) nodes.copyPromptBtn.addEventListener('click', copyPromptToClipboard);
        if (nodes.copyForChatBtn) nodes.copyForChatBtn.addEventListener('click', copyPromptWithJson);
        updatePromptBox();
      } catch (e) {
        console.warn('Raw data controls not available at init:', e?.message || e);
      }

    /* ========== KUNDLI VISUALIZATION ENGINE ========== */

    const KUNDLI_COLORS = {
      Sun: "#f7c948",
      Moon: "#a5d8ff",
      Mars: "#ff6b6b",
      Mercury: "#69db7c",
      Jupiter: "#ffd43b",
      Venus: "#faa2c1",
      Saturn: "#748ffc",
      Rahu: "#da77f2",
      Ketu: "#adb5bd"
    };

    const KUNDLI_ASPECTS = {
      Sun: [7],
      Moon: [7],
      Mercury: [7],
      Venus: [7],
      Mars: [4, 7, 8],
      Jupiter: [5, 7, 9],
      Saturn: [3, 7, 10],
      Rahu: [5, 7, 9],
      Ketu: [5, 7, 9]
    };

    function renderKundliChart(d1Chart) {
      const kundliChart = [];
      Object.entries(d1Chart || {}).forEach(([planet, data]) => {
        const house = Number(data.house_number || 0);
        if (house >= 1 && house <= 12) {
          kundliChart.push({ name: planet, house });
        }
      });

      renderKundliHouses(kundliChart);
      renderKundliButtons(kundliChart);
    }

    function renderKundliHouses(chart) {
      for (let i = 1; i <= 12; i++) {
        const el = document.getElementById("house-" + i);
        if (el) el.innerHTML = "";
      }

      const ns = "http://www.w3.org/2000/svg";
      chart.forEach(p => {
        const el = document.getElementById("house-" + p.house);
        if (!el) return;

        const text = document.createElementNS(ns, "text");
        text.textContent = p.name[0];
        text.setAttribute("fill", KUNDLI_COLORS[p.name] || "#000");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "15");
        el.appendChild(text);
      });
    }

    function renderKundliButtons(chart) {
      const box = document.getElementById("kundliPlanetButtons");
      if (!box) return;
      box.innerHTML = "";

      chart.forEach(p => {
        const btn = document.createElement("button");
        btn.textContent = p.name;
        btn.style.background = KUNDLI_COLORS[p.name] || "#666";
        btn.className = "btn btn-secondary";
        btn.addEventListener("click", () => kundliHighlightSingle(p));
        box.appendChild(btn);
      });
    }

    function kundliHighlightSingle(p) {
      kundliClearHighlights();
      kundliDrawAspectSet([p]);
    }

    function kundliShowAllAspects(chart) {
      kundliClearHighlights();
      kundliDrawAspectSet(chart);
    }

    function kundliDrawAspectSet(list) {
      const ns = "http://www.w3.org/2000/svg";
      const layer = document.getElementById("aspectLayer");
      if (!layer) return;
      layer.innerHTML = "";

      list.forEach(p => {
        const from = p.house;
        const sourceEl = document.getElementById("house-" + from);
        if (sourceEl) sourceEl.classList.add("highlight-source");

        (KUNDLI_ASPECTS[p.name] || []).forEach(a => {
          const to = ((from + a - 2) % 12) + 1;
          const targetEl = document.getElementById("house-" + to);
          if (targetEl) targetEl.classList.add("highlight-aspect");

          const line = document.createElementNS(ns, "line");
          const f = kundliGetXY(from);
          const t = kundliGetXY(to);

          line.setAttribute("x1", f.x);
          line.setAttribute("y1", f.y);
          line.setAttribute("x2", t.x);
          line.setAttribute("y2", t.y);
          line.setAttribute("stroke", KUNDLI_COLORS[p.name]);
          line.setAttribute("stroke-width", "1.8");
          line.setAttribute("opacity", "0.5");

          layer.appendChild(line);
        });
      });
    }

    function kundliClearHighlights() {
      for (let i = 1; i <= 12; i++) {
        const el = document.getElementById("house-" + i);
        if (el) {
          el.classList.remove("highlight-source", "highlight-aspect");
        }
      }
      const layer = document.getElementById("aspectLayer");
      if (layer) layer.innerHTML = "";
    }

    function kundliGetXY(h) {
      const map = {
        1: [300, 95], 2: [440, 120], 3: [505, 210], 4: [535, 300],
        5: [505, 390], 6: [440, 480], 7: [300, 505], 8: [160, 480],
        9: [95, 390], 10: [65, 300], 11: [95, 210], 12: [160, 120]
      };
      return { x: map[h][0], y: map[h][1] };
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchChart(url, payload, keys = []) {
      const headers = { "Content-Type": "application/json" };
      const tryFetch = async (key) => {
        if (!key) return null;
        const res = await fetch(url, {
          method: "POST",
          headers: { ...headers, "x-api-key": key },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      };

      let lastError = null;
      for (const key of keys) {
        try {
          const result = await tryFetch(key);
          if (result) return result;
          lastError = new Error("API key missing or unavailable");
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError || new Error("No astrology API keys were available");
    }

    async function fetchAstroEndpoint(path, payload, keys) {
      return fetchChart(`${API_BASE_URL}/${path}`, payload, keys);
    }

    function extractChartOutput(result) {
      if (!result || typeof result !== "object") return {};
      if (result.output && typeof result.output === "object") return result.output;
      if (result.data && typeof result.data === "object") {
        if (result.data.output && typeof result.data.output === "object") return result.data.output;
        return result.data;
      }
      return result;
    }

    async function fetchAstroEndpointWithRetry(path, payload, keys, options = {}) {
      const maxAttempts = options.maxAttempts || REQUEST_FLOW.maxAttempts;
      const baseDelayMs = options.baseDelayMs || REQUEST_FLOW.baseDelayMs;
      let lastError = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const data = await fetchAstroEndpoint(path, payload, keys);
          return { ok: true, data, attempts: attempt };
        } catch (error) {
          lastError = error;
          if (attempt < maxAttempts) {
            const waitMs = baseDelayMs * attempt;
            await sleep(waitMs);
          }
        }
      }

      return {
        ok: false,
        error: lastError ? lastError.message : "Unknown API request error",
        attempts: maxAttempts
      };
    }

    /**
     * Fetch Vimsottari Dasa information (vimsottari/dasa-information) as a reusable helper.
     * Accepts either a full payload object or discrete birth fields via `profilePayload`.
     * `eventData` may be provided separately; if omitted, the birth datetime is used.
     * `config` is used to extract stored API keys (astroKey1...)
     * Returns: { ok: true, data: {...}, attempts } or { ok: false, error, attempts }
     */
    async function fetchVimsottariDasaInfo(profilePayload = {}, eventData = null, config = {}) {
      const keys = getAstroKeys(config);

      const p = profilePayload || {};
      const year = p.year ?? p.y ?? null;
      const month = p.month ?? p.m ?? null;
      const date = p.date ?? p.d ?? null;
      const hours = p.hours ?? p.h ?? 0;
      const minutes = p.minutes ?? p.min ?? 0;
      const seconds = p.seconds ?? 0;
      const latitude = p.latitude ?? p.lat ?? 0;
      const longitude = p.longitude ?? p.lng ?? p.lon ?? 0;
      const timezone = safeNumber(p.timezone ?? p.tz ?? 5.5, 5.5);
      const settings = p.settings || { observation_point: "topocentric", ayanamsha: "lahiri" };

      const event_payload = eventData || { year, month, date, hours, minutes, seconds };

      const payload = {
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        latitude,
        longitude,
        timezone,
        config: settings,
        event_data: event_payload
      };

      const result = await fetchAstroEndpointWithRetry("vimsottari/dasa-information", payload, keys);
      if (!result.ok) return result;
      return { ok: true, data: extractChartOutput(result.data), attempts: result.attempts };
    }

    async function fetchSelectedAstroApis(payload, eventData, config, selectedEndpoints) {
      const keys = getAstroKeys(config);
      const responseMap = {};
      
      // Initialize queue state: all endpoints start as queued
      const queueState = {};
      selectedEndpoints.forEach(endpoint => {
        queueState[endpoint.id] = "queued";
      });
      updateQueueDisplay(queueState);

      for (let index = 0; index < selectedEndpoints.length; index++) {
        const endpoint = selectedEndpoints[index];
        const total = selectedEndpoints.length;
        
        // Mark as loading
        queueState[endpoint.id] = "loading";
        updateQueueDisplay(queueState);
        
        setStatus(
          "Sequential API mode",
          `Request ${index + 1}/${total}: ${endpoint.name} ...`
        );

        // Some endpoints (like vimsottari/dasa-information) require an `event_data` object
        const needsEventData = endpoint.path === "vimsottari/dasa-information" || endpoint.id === "vim-maha-antar";
        const payloadToSend = needsEventData ? { ...payload, event_data: eventData } : payload;

        const result = await fetchAstroEndpointWithRetry(endpoint.path, payloadToSend, keys);
        if (result.ok) {
          responseMap[endpoint.id] = {
            ok: true,
            data: result.data,
            attempts: result.attempts
          };
          queueState[endpoint.id] = "loaded";
        } else {
          responseMap[endpoint.id] = {
            ok: false,
            error: result.error,
            attempts: result.attempts
          };
          queueState[endpoint.id] = "failed";
        }

        updateQueueDisplay(queueState);
        renderApiResponses(responseMap);
        if (index < selectedEndpoints.length - 1) {
          await sleep(REQUEST_FLOW.betweenEndpointsMs);
        }
      }

      return responseMap;
    }

    function requireCoreChartData(endpointOutputs) {
      const core = ["d1", "d9"];
      const failed = core.filter(id => !endpointOutputs[id]?.ok || !endpointOutputs[id]?.data?.output);
      if (failed.length) {
        throw new Error(`Core astrology endpoints failed: ${failed.join(", ")}. Please verify keys or endpoint availability.`);
      }
    }

    async function generateLiveAnalysis(profile) {
      const parsedConfig = parseConfig();
      const config = parsedConfig.data;
      const locationCandidate = await resolveLocation(profile, normalizeKey(config.opencageKey));
      const latLng = locationCandidate?.geometry || { lat: 19.076, lng: 72.8777 };
      const [year, month, date] = profile.dob.split("-").map(Number);
      const [hours, minutes] = profile.tob.split(":").map(Number);
        const basePayload = {
          year,
          month,
          date,
          hours,
          minutes,
          seconds: 0,
          latitude: latLng.lat,
          longitude: latLng.lng,
          timezone: safeNumber(profile.timezone, 5.5),
          settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri"
          }
        };

        // Build a default event_data object for endpoints that require a separate event date/time
        const eventData = {
          year,
          month,
          date,
          hours,
          minutes,
          seconds: 0
        };

      const selected = getSelectedApis();
      const endpointOutputs = await fetchSelectedAstroApis(basePayload, eventData, config, selected);
      requireCoreChartData(endpointOutputs);
      const d1Raw = endpointOutputs.d1?.ok ? endpointOutputs.d1.data : null;
      const d9Raw = endpointOutputs.d9?.ok ? endpointOutputs.d9.data : null;
      return {
        d1: extractChartOutput(d1Raw),
        d9: extractChartOutput(d9Raw),
        endpointOutputs
      };
    }

    async function generateGeminiNarrative(profile, d1, d9, endpointOutputs = {}) {
      const config = parseConfig().data;
      const key = normalizeKey(config.geminiKey);
      const modelName = normalizeKey(config.modelName, "gemini-2.0-flash");
      if (!key) {
        return generateFallbackReport(d1, d9, profile);
      }

      const apiDataForAnalysis = Object.entries(endpointOutputs)
        .filter(([, result]) => result?.ok)
        .reduce((acc, [id, result]) => {
          acc[id] = result.data;
          return acc;
        }, {});

      const prompt = `
You are a senior Vedic astrologer. Write a highly professional astrology report in Hindi written using English letters only.
Style: ${profile.analysisStyle}.
Name: ${profile.name}
Date of Birth: ${profile.dob}
Time of Birth: ${profile.tob}
Location: ${profile.location}
Timezone: ${profile.timezone}

Use the following chart data to explain:
- D1 / Rasi chart
- D9 / Navamsa chart
- All additional astrology endpoint outputs for deeper planetary combinations and timing layers
- house-wise meaning
- planet-by-planet meaning
- exaltation, debilitation, friend sign, enemy sign
- element analysis, movable/fixed/dual signs
- nature, thinking, love life, married life, career, health
- atmakaraka and soul direction

D1 Data:
${JSON.stringify(d1, null, 2)}

D9 Data:
${JSON.stringify(d9, null, 2)}

Additional Astrology API Data (selected endpoints):
${JSON.stringify(apiDataForAnalysis, null, 2)}

Rules:
1. Be precise and professional.
2. Write in English letters but use Hindi wording.
3. Give a deep, structured, consultant-style reading.
4. Cover each house and every visible planet.
5. If some information is missing, explain what can and cannot be inferred.
6. Do not mention that this is an AI prompt.
7. Explain patient planetary combinations clearly: conjunctions, house activation, dignity, and combined impact on love, marriage, career, health, and mindset.
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || generateFallbackReport(d1, d9, profile);
    }

    function setLoading(loading) {
      nodes.submitBtn.disabled = loading;
      nodes.demoBtn.disabled = loading;
      nodes.submitBtn.textContent = loading ? "Analyzing..." : "Generate Analysis";
      nodes.analysisBar.style.setProperty("--w", loading ? "62%" : nodes.analysisBar.style.getPropertyValue("--w") || "0%");
    }

    async function handleGenerate({ demo = false } = {}) {
      const profile = {
        name: nodes.name.value.trim() || "Client",
        dob: nodes.dob.value,
        tob: nodes.tob.value,
        location: nodes.location.value.trim() || "Mumbai, India",
        timezone: nodes.timezone.value,
        analysisStyle: nodes.analysisStyle.value
      };

      if (!profile.dob || !profile.tob) {
        setStatus("Input required", "Please enter both date and time of birth.");
        return;
      }

      setLoading(true);
      nodes.analysisOutput.textContent = demo ? "Generating demo report..." : "Generating live report...";
      setStatus(demo ? "Demo mode" : "Live mode", demo ? "Using the local sample chart engine." : "Attempting live chart and Gemini analysis.");

      try {
        const parsedConfig = parseConfig();
        if (parsedConfig.error) {
          throw new Error(`Invalid API config JSON: ${parsedConfig.error.message}`);
        }

        let charts;
        if (demo) {
          charts = buildDemoCharts();
          const selected = getSelectedApis();
          const endpointOutputs = {};
          selected.forEach(endpoint => {
            endpointOutputs[endpoint.id] = {
              ok: true,
              data: {
                endpoint: endpoint.path,
                mode: "demo",
                note: "This is a local placeholder response. Add valid API keys to fetch live output."
              }
            };
          });
          charts.endpointOutputs = endpointOutputs;
        } else {
          const config = parsedConfig.data;
          if (!hasAnyAstroKey(config)) {
            charts = buildDemoCharts();
            const selected = getSelectedApis();
            const endpointOutputs = {};
            selected.forEach(endpoint => {
              endpointOutputs[endpoint.id] = {
                ok: true,
                data: {
                  endpoint: endpoint.path,
                  mode: "demo-fallback",
                  note: "No API keys were provided, so this endpoint output is simulated."
                }
              };
            });
            charts.endpointOutputs = endpointOutputs;
            setStatus("Demo fallback", "No astrology API key found. Add astroKey1 or astroKey2 for live chart results.");
          } else {
            charts = await generateLiveAnalysis(profile);
          }
        }

        state.d1 = charts.d1 || {};
        state.d9 = charts.d9 || {};
        state.d10 = charts.d10 || charts.endpointOutputs?.d10?.data || charts.endpointOutputs?.d10 || null;
        state.d2 = charts.d2 || charts.endpointOutputs?.d2?.data || charts.endpointOutputs?.d2 || null;
        state.d11 = charts.d11 || charts.endpointOutputs?.d11?.data || charts.endpointOutputs?.d11 || null;
        state.d24 = charts.d24 || charts.endpointOutputs?.d24?.data || charts.endpointOutputs?.d24 || null;
        state.d60 = charts.d60 || charts.endpointOutputs?.d60?.data || charts.endpointOutputs?.d60 || null;
        state.endpointOutputs = charts.endpointOutputs || {};
        syncAstroState();

        renderD1(state.d1);
        renderD9(state.d9);
        renderApiResponses(state.endpointOutputs);
        
        // Update queue display: mark all endpoints as loaded for final display
        const finalQueueState = {};
        Object.keys(state.endpointOutputs).forEach(id => {
          finalQueueState[id] = state.endpointOutputs[id].ok ? "loaded" : "failed";
        });
        updateQueueDisplay(finalQueueState);
        
        updateSummary(state.d1, state.d9);
        
        // Save data to sessionStorage for divisional charts page
        saveAstroDataToSession(state);

        const report = await generateGeminiNarrative(profile, state.d1, state.d9, state.endpointOutputs);
        state.analysis = report;
        nodes.analysisOutput.textContent = report;
        refreshCareerEnginePanel();
        refreshWealthEnginePanel();
        refreshTimingEnginePanel();

        const live = !demo && normalizeKey(parseConfig().data.geminiKey);
        const okCount = Object.values(state.endpointOutputs).filter(item => item.ok).length;
        const failCount = Object.values(state.endpointOutputs).length - okCount;
        setStatus(
          live ? "Live report complete" : "Demo report complete",
          `Charts, house grid, dignity matrix, and narrative are ready. API calls: ${okCount} success, ${failCount} failed.`
        );
      } catch (error) {
        const hasLiveChartData = isLoadedChart(state.d1) && isLoadedChart(state.d9);
        const fallback = hasLiveChartData
          ? generateFallbackReport(state.d1, state.d9, profile)
          : "Live astrology response incomplete. D1 and D9 are mandatory before analysis. Please retry after a moment or reduce selected endpoints.";
        state.analysis = fallback;
        nodes.analysisOutput.textContent = `Error during live generation: ${error.message}\n\n${fallback}`;
        refreshCareerEnginePanel();
        refreshWealthEnginePanel();
        refreshTimingEnginePanel();
        setStatus("Recovered with fallback", error.message);
      } finally {
        setLoading(false);
        nodes.analysisBar.style.setProperty("--w", "100%");
      }
    }

    function loadDemoValues() {
      nodes.name.value = "Aarav";
      nodes.dob.value = "1992-08-19";
      nodes.tob.value = "14:25";
      nodes.location.value = "Mumbai, India";
      nodes.timezone.value = "5.5";
      nodes.analysisStyle.value = "professional";
      state.location.selected = null;
      state.location.candidates = [];
      renderLocationCandidates([]);
      renderLocationMap(null);
      setLocationStatus("Demo location loaded. Search matches if you want to compare alternatives.");
      setStatus("Demo data loaded", "You can now generate a report immediately.");
    }

    nodes.demoBtn.addEventListener("click", () => {
      loadDemoValues();
      handleGenerate({ demo: true });
    });

    nodes.submitBtn.addEventListener("click", () => handleGenerate({ demo: false }));
    nodes.runWealthBtn?.addEventListener("click", refreshWealthEnginePanel);
    nodes.runTimingBtn?.addEventListener("click", refreshTimingEnginePanel);

    // Export analysis output to PDF using html2canvas + jsPDF
    async function exportReportToPDF() {
      try {
        const el = document.getElementById('analysisOutput');
        if (!el) return setStatus('Error', 'No analysis output to export');
        // ensure visible (some output areas may be hidden in small screens)
        const originalBg = el.style.background;
        el.style.background = window.getComputedStyle(el).backgroundColor || '#fff';
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        el.style.background = originalBg;
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf || { jsPDF: window.jsPDF };
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pageWidth - 40;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        let cursorY = 40;
        pdf.setFontSize(12);
        const client = nodes.name?.value || 'Client';
        pdf.text(`AstroScope Report - ${client}`, 40, 28);
        pdf.addImage(imgData, 'PNG', 20, cursorY, imgWidth, imgHeight);
        pdf.save(`astro-report-${client.replace(/\s+/g,'_')}.pdf`);
        setStatus('Exported', 'PDF report downloaded');
      } catch (err) {
        console.error('Export PDF error', err);
        setStatus('Error', 'Failed to export PDF');
      }
    }

    // Save and load simple profile to localStorage
    function saveProfileToStorage() {
      try {
        const profile = {
          name: nodes.name?.value || '',
          dob: nodes.dob?.value || '',
          tob: nodes.tob?.value || '',
          location: nodes.location?.value || '',
          timezone: nodes.timezone?.value || '',
          analysisStyle: nodes.analysisStyle?.value || '',
          config: nodes.config?.value || ''
        };
        localStorage.setItem('astro_profile_v1', JSON.stringify(profile));
        setStatus('Saved', 'Profile saved to local storage');
      } catch (e) {
        console.error('Save profile failed', e);
        setStatus('Error', 'Unable to save profile');
      }
    }

    function loadProfileFromStorage() {
      try {
        const raw = localStorage.getItem('astro_profile_v1');
        if (!raw) return setStatus('Not found', 'No saved profile found in local storage');
        const p = JSON.parse(raw);
        nodes.name.value = p.name || nodes.name.value;
        nodes.dob.value = p.dob || nodes.dob.value;
        nodes.tob.value = p.tob || nodes.tob.value;
        nodes.location.value = p.location || nodes.location.value;
        nodes.timezone.value = p.timezone || nodes.timezone.value;
        nodes.analysisStyle.value = p.analysisStyle || nodes.analysisStyle.value;
        nodes.config.value = p.config || nodes.config.value;
        setStatus('Loaded', 'Profile loaded from local storage');
        // refresh location UI
        state.location.selected = null;
        state.location.candidates = [];
        renderLocationCandidates([]);
        renderLocationMap(null);
      } catch (e) {
        console.error('Load profile failed', e);
        setStatus('Error', 'Unable to load profile');
      }
    }

    document.getElementById('exportPdfBtn')?.addEventListener('click', exportReportToPDF);
    document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfileToStorage);
    document.getElementById('loadProfileBtn')?.addEventListener('click', loadProfileFromStorage);

    // Keyboard shortcuts: Shift+E export, Shift+S save, Shift+L load
    window.addEventListener('keydown', (e) => {
      if (!e.shiftKey) return;
      if (e.key === 'E' || e.key === 'e') { e.preventDefault(); exportReportToPDF(); }
      if (e.key === 'S' || e.key === 's') { e.preventDefault(); saveProfileToStorage(); }
      if (e.key === 'L' || e.key === 'l') { e.preventDefault(); loadProfileFromStorage(); }
    });

    let locationSearchTimer = null;
    nodes.location.addEventListener("input", () => {
      state.location.selected = null;
      const query = nodes.location.value.trim();
      clearTimeout(locationSearchTimer);
      if (query.length < 3) {
        state.location.candidates = [];
        renderLocationCandidates([]);
        renderLocationMap(null);
        setLocationStatus("Type at least 3 characters to search for location matches.");
        return;
      }

      setLocationStatus("Searching location matches...");
      locationSearchTimer = setTimeout(async () => {
        try {
          const config = parseConfig().data;
          const candidates = await fetchLocationCandidates(query, normalizeKey(config.opencageKey), 5);
          state.location.query = query;
          state.location.candidates = candidates;
          renderLocationCandidates(candidates);
          if (candidates.length) {
            renderLocationMap(candidates[0]);
            setLocationStatus(`Found ${candidates.length} match${candidates.length === 1 ? "" : "es"}. Pick the most accurate birthplace.`);
          } else {
            renderLocationMap(null);
            setLocationStatus("No matches found for this location.");
          }
        } catch (error) {
          state.location.candidates = [];
          renderLocationCandidates([]);
          renderLocationMap(null);
          setLocationStatus(error.message);
        }
      }, 450);
    });

    nodes.location.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        nodes.findLocationBtn?.click();
      }
    });

    nodes.findLocationBtn.addEventListener("click", async () => {
      const query = nodes.location.value.trim();
      if (!query) {
        setLocationStatus("Enter a place name before searching.");
        return;
      }

      try {
        const config = parseConfig().data;
        setLocationStatus("Fetching location matches from OpenCage...");
        const candidates = await fetchLocationCandidates(query, normalizeKey(config.opencageKey), 5);
        state.location.query = query;
        state.location.candidates = candidates;
        renderLocationCandidates(candidates);
        if (candidates.length) {
          renderLocationMap(candidates[0]);
          setLocationStatus(`Found ${candidates.length} match${candidates.length === 1 ? "" : "es"}. Choose one to lock the birthplace.`);
        } else {
          renderLocationMap(null);
          setLocationStatus("OpenCage returned no results for this place.");
        }
      } catch (error) {
        state.location.candidates = [];
        renderLocationCandidates([]);
        renderLocationMap(null);
        setLocationStatus(error.message);
      }
    });

    nodes.apiEndpointList.addEventListener("change", updateApiSelectionText);
    nodes.selectAllApisBtn.addEventListener("click", () => setApiSelection("all"));
    nodes.clearApisBtn.addEventListener("click", () => setApiSelection("none"));
    nodes.chartApisBtn.addEventListener("click", () => setApiSelection("divisional"));

    if (document.getElementById("kundliShowAllBtn")) {
      document.getElementById("kundliShowAllBtn").addEventListener("click", () => {
        const chart = Object.entries(state.d1 || {}).map(([planet, data]) => ({
          name: planet,
          house: Number(data.house_number || 0)
        })).filter(p => p.house >= 1 && p.house <= 12);
        kundliShowAllAspects(chart);
      });
    }

    if (document.getElementById("kundliClearBtn")) {
      document.getElementById("kundliClearBtn").addEventListener("click", kundliClearHighlights);
    }

    renderEndpointSelector();
    nodes.name.value = nodes.name.value || "Client";
    nodes.location.value = nodes.location.value || "Mumbai, India";
    nodes.timezone.value = nodes.timezone.value || "5.5";
    renderLocationCandidates([]);
    renderLocationMap(null);
    setStatus("Ready", "Enter birth details and generate analysis. API config is preserved.");
    setLocationStatus("Search a birthplace to compare OpenCage matches on the map.");
    nodes.analysisOutput.textContent = "Click Generate Analysis to create a full astrology report. Demo mode is already loaded for quick testing.";

    /* ====== Lightweight Charting & Theme Toggle (Chart.js) ====== */
    let wealthChartObj = null;
    let timingChartObj = null;

    function initCharts() {
      try {
        const wCtx = document.getElementById('wealthChart')?.getContext('2d');
        const tCtx = document.getElementById('timingChart')?.getContext('2d');
        if (wCtx && !wealthChartObj) {
          wealthChartObj = new Chart(wCtx, {
            type: 'bar',
            data: {
              labels: [],
              datasets: [{ label: 'Average Bala', data: [], backgroundColor: '#7dd3fc' }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
        if (tCtx && !timingChartObj) {
          timingChartObj = new Chart(tCtx, {
            type: 'doughnut',
            data: { labels: ['Fire','Earth','Air','Water'], datasets: [{ data: [0,0,0,0], backgroundColor: ['#fb7185','#f59e0b','#60a5fa','#34d399'] }] },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
      } catch (e) {
        console.warn('Chart init failed', e?.message || e);
      }
    }

    function updateChartsFromState() {
      try {
        // Wealth chart from balas.overall
        const overall = (state.summary && state.summary.balas && state.summary.balas.overall) ? state.summary.balas.overall : null;
        if (wealthChartObj && overall) {
          const labels = Object.keys(overall);
          const values = labels.map(k => overall[k] || 0);
          wealthChartObj.data.labels = labels;
          wealthChartObj.data.datasets[0].data = values;
          wealthChartObj.update();
        }

        // Timing chart: element distribution
        const signs = getCurrentSigns(state.d1 || {});
        const counts = { Fire:0, Earth:0, Air:0, Water:0 };
        signs.forEach(s => { const el = signInfo(s).element || 'Balanced'; if (counts[el] !== undefined) counts[el]++; });
        if (timingChartObj) {
          timingChartObj.data.datasets[0].data = [counts.Fire, counts.Earth, counts.Air, counts.Water];
          timingChartObj.update();
        }
      } catch (e) {
        console.warn('Chart update failed', e?.message || e);
      }
    }

    // initialize charts on load and wire theme toggle
    try {
      initCharts();
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const body = document.body;
          const isLight = body.classList.toggle('light-theme');
          themeToggle.textContent = isLight ? '☀️' : '🌙';
        });
      }
    } catch (e) { console.warn('Init small UI enhancements failed', e?.message || e); }
