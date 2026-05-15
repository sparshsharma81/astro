// Professional predictive timing engine
// Supports career, wealth, marriage, health, and authority timing using dasha, transit, divisional charts, age maturity, and strength modifiers.
(function (root) {
  'use strict';

  const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const MALEFICS = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];
  const SIGN_LORDS = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
    Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
  };
  const SIGN_ALIASES = {
    Mesha: 'Aries', Vrishabha: 'Taurus', Mithuna: 'Gemini', Karka: 'Cancer', Simha: 'Leo', Kanya: 'Virgo',
    Tula: 'Libra', Vrischika: 'Scorpio', Dhanu: 'Sagittarius', Makara: 'Capricorn', Kumbha: 'Aquarius', Meena: 'Pisces'
  };
  const MATURE_AGES = {
    Sun: 22,
    Moon: 24,
    Mars: 28,
    Mercury: 32,
    Jupiter: 16,
    Venus: 25,
    Saturn: 36,
    Rahu: 42,
    Ketu: 48
  };

  function getAppState() {
    return root.state || root.__ASTRO_STATE__ || null;
  }

  function asText(value) {
    return value == null ? '' : String(value).trim();
  }

  function asNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function toTitleCase(text) {
    return asText(text)
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(part => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part)
      .join(' ');
  }

  function escapeHtml(text) {
    return asText(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeSign(sign) {
    const value = asText(sign);
    if (!value) return null;
    const title = toTitleCase(value);
    return SIGN_ALIASES[title] || title;
  }

  function normalizePlanetName(name) {
    const value = asText(name);
    if (!value) return '';
    const title = toTitleCase(value);
    if (/north node|rahu/i.test(title)) return 'Rahu';
    if (/south node|ketu/i.test(title)) return 'Ketu';
    return title;
  }

  function isPlanetName(name) {
    return PLANET_NAMES.includes(normalizePlanetName(name));
  }

  function isTruthy(value) {
    if (value === true) return true;
    if (value === false || value == null) return false;
    if (typeof value === 'number') return value !== 0;
    const normalized = asText(value).toLowerCase();
    return ['true', 'yes', 'y', '1', 'exalted', 'strong', 'present', 'combust', 'retrograde'].includes(normalized);
  }

  function unwrapChartSource(source) {
    if (!source || typeof source !== 'object') return {};
    if (source.data && typeof source.data === 'object' && !Array.isArray(source.data)) return source.data;
    if (source.result && typeof source.result === 'object' && !Array.isArray(source.result)) return source.result;
    return source;
  }

  function normalizeAspectList(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map(item => typeof item === 'string' ? item : (item?.name || item?.planet || item?.target || item?.house || '')).filter(Boolean);
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => value[key]?.name || value[key]?.planet || key).filter(Boolean);
    }
    return [asText(value)].filter(Boolean);
  }

  function normalizePlanetRecord(name, raw) {
    const planetName = normalizePlanetName(name || raw?.name || raw?.planet || raw?.key || raw?.id);
    const payload = raw && typeof raw === 'object' ? raw : {};
    return {
      name: planetName,
      sign: normalizeSign(payload.zodiac_sign_name || payload.sign || payload.rasi || payload.rashi || payload.sign_name || payload.signName || payload.zodiacSign),
      house: asNumber(payload.house_number || payload.house || payload.bhava || payload.bhava_number || payload.houseNo || payload.house_no || payload.position, null),
      degree: asNumber(payload.degree || payload.longitude || payload.longitude_deg || payload.full_degree || payload.position_degree, null),
      retrograde: isTruthy(payload.retrograde || payload.is_retrograde || payload.retro || payload.isRetrograde),
      combust: isTruthy(payload.combustion || payload.is_combust || payload.combust || payload.isCombust),
      exalted: isTruthy(payload.is_exalted || payload.exalted || payload.dignity === 'exalted'),
      debilitated: isTruthy(payload.is_debilitated || payload.debilitated || payload.dignity === 'debilitated'),
      ownSign: isTruthy(payload.is_in_own_sign || payload.own_sign || payload.isOwnSign),
      mooltrikona: isTruthy(payload.mooltrikona || payload.mool_trikona || payload.is_mooltrikona),
      vargottama: isTruthy(payload.vargottama || payload.is_vargottama),
      nakshatra: asText(payload.nakshatra_name || payload.nakshatra || payload.star || payload.asterism) || null,
      aspects: normalizeAspectList(payload.aspects || payload.aspecting || payload.drishti || payload.drstis || payload.aspected_by),
      conjunctions: normalizeAspectList(payload.conjunctions || payload.conjunction || payload.companions || payload.with),
      raw: payload
    };
  }

  function extractPlanets(source) {
    const chart = unwrapChartSource(source);
    if (Array.isArray(chart.planets)) return chart.planets.map((planet, index) => normalizePlanetRecord(planet?.name || planet?.planet || index, planet));
    if (Array.isArray(chart.planet_positions)) return chart.planet_positions.map((planet, index) => normalizePlanetRecord(planet?.name || planet?.planet || index, planet));
    if (Array.isArray(chart.positions)) return chart.positions.map((planet, index) => normalizePlanetRecord(planet?.name || planet?.planet || index, planet));

    const records = [];
    Object.entries(chart).forEach(([key, value]) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return;
      const normalizedName = normalizePlanetName(key);
      if (isPlanetName(normalizedName) || normalizedName === 'Rahu' || normalizedName === 'Ketu') {
        records.push(normalizePlanetRecord(normalizedName, { name: normalizedName, ...value }));
      }
    });
    return records;
  }

  function extractHouseSigns(source, planets) {
    const chart = unwrapChartSource(source);
    const houseSigns = {};
    const rawHouses = chart.houses || chart.house_signs || chart.houseSigns || chart.bhavas || null;

    if (rawHouses && typeof rawHouses === 'object' && !Array.isArray(rawHouses)) {
      Object.entries(rawHouses).forEach(([key, value]) => {
        const house = asNumber(key, null);
        if (!house) return;
        if (typeof value === 'string') {
          houseSigns[house] = normalizeSign(value);
          return;
        }
        if (value && typeof value === 'object') {
          houseSigns[house] = normalizeSign(value.sign || value.zodiac_sign || value.rasi || value.rashi || value.name);
        }
      });
    }

    if (!houseSigns[1]) {
      const lagna = normalizeSign(chart.lagna_sign || chart.ascendant_sign || chart.ascendant || chart.lagna || chart.rising_sign);
      if (lagna) houseSigns[1] = lagna;
    }

    if (!Object.keys(houseSigns).length && Array.isArray(chart.house_signs)) {
      chart.house_signs.forEach((value, index) => {
        houseSigns[index + 1] = normalizeSign(value);
      });
    }

    (Array.isArray(planets) ? planets : []).forEach(planet => {
      if (!planet.house || !planet.sign) return;
      if (!houseSigns[planet.house]) houseSigns[planet.house] = planet.sign;
    });

    return houseSigns;
  }

  function buildHouseMap(source, planets) {
    const houseSigns = extractHouseSigns(source, planets);
    const houses = {};
    for (let house = 1; house <= 12; house += 1) {
      houses[house] = {
        house,
        sign: houseSigns[house] || null,
        lord: houseSigns[house] ? SIGN_LORDS[houseSigns[house]] || null : null,
        occupants: []
      };
    }

    planets.forEach(planet => {
      if (!planet.house || !houses[planet.house]) return;
      houses[planet.house].occupants.push(planet);
    });

    return { houses, houseSigns };
  }

  function normalizeChart(source, label) {
    const raw = unwrapChartSource(source);
    const planets = extractPlanets(raw);
    const { houses, houseSigns } = buildHouseMap(raw, planets);
    return {
      type: label || raw.type || null,
      raw,
      planets,
      houses,
      houseSigns,
      lords: Object.fromEntries(Array.from({ length: 12 }, (_, index) => {
        const house = index + 1;
        const sign = houseSigns[house] || null;
        return [house, sign ? SIGN_LORDS[sign] || null : null];
      }))
    };
  }

  function getChart(input) {
    if (!input) return null;
    return input.planets && input.houses ? input : normalizeChart(input);
  }

  function getPlanet(chart, name) {
    const normalized = normalizePlanetName(name);
    return (chart?.planets || []).find(planet => normalizePlanetName(planet.name) === normalized) || null;
  }

  function getHouseSign(chart, house) {
    if (!chart) return null;
    if (chart.houses && chart.houses[house] && chart.houses[house].sign) return chart.houses[house].sign;
    return chart.houseSigns?.[house] || null;
  }

  function getHouseOccupants(chart, house) {
    if (!chart || !chart.houses || !chart.houses[house]) return [];
    return chart.houses[house].occupants || [];
  }

  function getHouseLordName(chart, house) {
    const sign = getHouseSign(chart, house);
    return sign ? SIGN_LORDS[sign] || null : null;
  }

  function getHouseLordPlanet(chart, house) {
    const lordName = getHouseLordName(chart, house);
    return lordName ? getPlanet(chart, lordName) : null;
  }

  function planetStrengthScore(planet) {
    if (!planet) return 0;
    let score = 20;
    if (planet.exalted) score += 26;
    if (planet.ownSign) score += 18;
    if (planet.mooltrikona) score += 14;
    if (planet.vargottama) score += 10;
    if (planet.house && [1, 4, 7, 10].includes(planet.house)) score += 6;
    if (planet.house && [1, 5, 9].includes(planet.house)) score += 6;
    if (planet.retrograde) score += 2;
    if (planet.combust) score -= 8;
    if (planet.debilitated) score -= 10;
    if (planet.house && [2, 5, 9, 10, 11].includes(planet.house) && BENEFICS.includes(planet.name)) score += 6;
    return Math.max(0, Math.min(100, score));
  }

  function houseStrengthScore(chart, house) {
    const normalized = getChart(chart);
    if (!normalized) return 0;
    let score = 10;
    const sign = getHouseSign(normalized, house);
    const occupants = getHouseOccupants(normalized, house);
    const lord = getHouseLordPlanet(normalized, house);

    if (sign) score += 8;
    if (occupants.length) score += Math.min(15, occupants.length * 4);

    occupants.forEach(planet => {
      score += Math.min(10, Math.round(planetStrengthScore(planet) / 12));
      if (BENEFICS.includes(planet.name)) score += 3;
      if (MALEFICS.includes(planet.name) && [2, 4, 5, 8, 9, 12].includes(house)) score -= 2;
    });

    if (lord) {
      score += Math.min(18, Math.round(planetStrengthScore(lord) / 4));
      if (lord.house && [house, 2, 5, 9, 10, 11].includes(lord.house)) score += 5;
      if (planetStrengthScore(lord) >= 45) score += 4;
    }

    if ([2, 5, 9, 10, 11].includes(house)) score += 6;
    if ([6, 8, 12].includes(house)) score -= 2;
    if (house === 11 && occupants.some(planet => BENEFICS.includes(planet.name))) score += 6;
    if (house === 2 && occupants.some(planet => planet.name === 'Mercury' || planet.name === 'Jupiter')) score += 5;
    if (house === 4 && occupants.some(planet => planet.name === 'Moon' || planet.name === 'Venus')) score += 4;
    if (house === 10 && occupants.some(planet => planet.name === 'Sun' || planet.name === 'Saturn')) score += 4;

    return Math.max(0, Math.min(100, score));
  }

  function isHouseStrong(chart, house) {
    return houseStrengthScore(chart, house) >= 55;
  }

  function hasConnection(entity1, entity2, chart) {
    const a = entity1?.name ? getPlanet(chart, entity1.name) || entity1 : entity1;
    const b = entity2?.name ? getPlanet(chart, entity2.name) || entity2 : entity2;
    if (!a || !b) return false;
    if (a.house && b.house && a.house === b.house) return true;
    if (a.conjunctions?.some(name => normalizePlanetName(name) === b.name)) return true;
    if (b.conjunctions?.some(name => normalizePlanetName(name) === a.name)) return true;
    if (a.aspects?.some(name => normalizePlanetName(name) === b.name)) return true;
    if (b.aspects?.some(name => normalizePlanetName(name) === a.name)) return true;
    const diff = a.house && b.house ? Math.abs(a.house - b.house) : null;
    if (diff != null && [4, 7, 8].includes(diff)) return true;
    return false;
  }

  function chartPlanetSupport(chart) {
    const normalized = getChart(chart);
    if (!normalized) return 0;
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .map(name => getPlanet(normalized, name))
      .filter(Boolean);
    if (!planets.length) return 0;
    const sum = planets.reduce((total, planet) => total + planetStrengthScore(planet), 0);
    return Math.max(0, Math.min(100, Math.round(sum / planets.length)));
  }

  function parseAgeFromProfile() {
    const state = getAppState();
    const dobText = asText(root.document?.getElementById('dob')?.value || state?.profile?.dob || '');
    if (!dobText) return null;
    const parsed = new Date(dobText);
    if (Number.isNaN(parsed.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - parsed.getFullYear();
    const monthDelta = now.getMonth() - parsed.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < parsed.getDate())) age -= 1;
    return age >= 0 ? age : null;
  }

  function normalizePlanetTokens(text) {
    const value = asText(text).toLowerCase();
    const tokens = [];
    PLANET_NAMES.forEach(name => {
      if (value.includes(name.toLowerCase())) tokens.push(name);
    });
    return tokens;
  }

  function extractDashaContext(endpointOutputs) {
    const maha = endpointOutputs?.['vim-maha']?.data?.output || endpointOutputs?.['vim-maha']?.data || null;
    const antar = endpointOutputs?.['vim-maha-antar']?.data?.output || endpointOutputs?.['vim-maha-antar']?.data || null;
    const raw = JSON.stringify({ maha, antar }).toLowerCase();
    const tokens = normalizePlanetTokens(raw);
    const periodText = [maha, antar].map(item => asText(typeof item === 'string' ? item : JSON.stringify(item))).filter(Boolean).join(' | ');
    return {
      maha,
      antar,
      rawText: periodText,
      tokens: Array.from(new Set(tokens)),
      available: Boolean(maha || antar)
    };
  }

  function extractTransitContext(endpointOutputs) {
    const transit = endpointOutputs?.transit?.data?.output || endpointOutputs?.transit?.data || endpointOutputs?.['planet-transits']?.data?.output || endpointOutputs?.['planet-transits']?.data || null;
    const rawText = transit ? JSON.stringify(transit).toLowerCase() : '';
    const available = Boolean(transit);
    const trigger = {
      career: 0,
      wealth: 0,
      marriage: 0,
      health: 0,
      power: 0
    };

    if (rawText) {
      if (rawText.includes('jupiter') && rawText.includes('10')) trigger.career += 25;
      if (rawText.includes('saturn') && rawText.includes('10')) trigger.career += 20;
      if (rawText.includes('rahu') && rawText.includes('10')) trigger.career += 15;
      if (rawText.includes('jupiter') && (rawText.includes('2') || rawText.includes('11'))) trigger.wealth += 30;
      if (rawText.includes('rahu') && rawText.includes('11')) trigger.wealth += 20;
      if (rawText.includes('venus') && rawText.includes('7')) trigger.marriage += 25;
      if (rawText.includes('jupiter') && rawText.includes('7')) trigger.marriage += 20;
      if (rawText.includes('mars') && (rawText.includes('6') || rawText.includes('8') || rawText.includes('12'))) trigger.health += 20;
      if (rawText.includes('saturn') && (rawText.includes('6') || rawText.includes('8') || rawText.includes('12'))) trigger.health += 20;
      if (rawText.includes('sun') && rawText.includes('10')) trigger.power += 20;
      if (rawText.includes('jupiter') && rawText.includes('10')) trigger.power += 15;
    }

    return { available, raw: transit, rawText, trigger };
  }

  function maturityFactor(planets, age) {
    if (!Number.isFinite(age)) return 1;
    const relevant = planets.filter(Boolean);
    if (!relevant.length) return 1;
    const factors = relevant.map(planet => {
      const maturityAge = MATURE_AGES[planet.name] || 30;
      return age >= maturityAge ? 1.25 : 0.85;
    });
    return factors.reduce((sum, item) => sum + item, 0) / factors.length;
  }

  function dashaActivationForType(dasha, chart, eventType) {
    const tokens = (dasha?.tokens || []).map(normalizePlanetName);
    if (!tokens.length) return dasha?.available ? 0.55 : 0.35;

    const houseLords = {
      career: [10, 6, 11, 2],
      wealth: [2, 11, 5, 9],
      marriage: [7, 2, 11, 5],
      health: [6, 8, 12],
      power: [1, 10, 9, 11]
    }[eventType] || [];

    const relevantPlanets = {
      career: ['Sun', 'Saturn', 'Mercury', 'Jupiter', 'Mars', 'Rahu'],
      wealth: ['Jupiter', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Rahu'],
      marriage: ['Venus', 'Jupiter', 'Moon', 'Saturn'],
      health: ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'],
      power: ['Sun', 'Jupiter', 'Saturn', 'Mars', 'Rahu']
    }[eventType] || [];

    let score = 20;
    tokens.forEach(token => {
      if (relevantPlanets.includes(token)) score += 14;
      if (eventType === 'career' && ['10', '6', '11', '2'].includes(token)) score += 4;
      if (eventType === 'wealth' && ['2', '11', '5', '9'].includes(token)) score += 4;
      if (eventType === 'marriage' && ['7', '2', '5', '11'].includes(token)) score += 4;
      if (eventType === 'health' && ['6', '8', '12'].includes(token)) score += 5;
      if (eventType === 'power' && ['1', '10', '9', '11'].includes(token)) score += 4;
    });

    houseLords.forEach(house => {
      const lord = chart ? getHouseLordPlanet(chart, house) : null;
      if (lord && tokens.includes(lord.name)) score += 12;
    });

    if (asText(dasha?.rawText).toLowerCase().includes(eventType)) score += 10;
    return Math.max(0, Math.min(100, score));
  }

  function divisionalConfirmationForType(eventType, charts) {
    const d10 = charts.d10 ? getChart(charts.d10) : null;
    const d9 = charts.d9 ? getChart(charts.d9) : null;
    const d2 = charts.d2 ? getChart(charts.d2) : null;
    const d6 = charts.d6 ? getChart(charts.d6) : null;
    const d60 = charts.d60 ? getChart(charts.d60) : null;
    const d24 = charts.d24 ? getChart(charts.d24) : null;

    if (eventType === 'career') {
      const score = Math.max(
        d10 ? (isHouseStrong(d10, 10) ? 70 : 35) + (isHouseStrong(d10, 11) ? 15 : 0) : 0,
        d9 ? chartPlanetSupport(d9) : 0,
        d24 ? Math.round((houseStrengthScore(d24, 5) + houseStrengthScore(d24, 9)) / 2) : 0
      );
      return Math.min(100, score);
    }

    if (eventType === 'wealth') {
      const score = Math.max(
        d2 ? (isHouseStrong(d2, 2) ? 55 : 25) + (isHouseStrong(d2, 11) ? 20 : 0) : 0,
        d10 ? Math.round((houseStrengthScore(d10, 10) + houseStrengthScore(d10, 11)) / 2) : 0,
        d60 ? Math.round((houseStrengthScore(d60, 2) + houseStrengthScore(d60, 11)) / 2) : 0
      );
      return Math.min(100, score);
    }

    if (eventType === 'marriage') {
      const score = Math.max(
        d9 ? chartPlanetSupport(d9) : 0,
        charts.d1 ? Math.round((houseStrengthScore(charts.d1, 7) + houseStrengthScore(charts.d1, 5)) / 2) : 0,
        d24 ? chartPlanetSupport(d24) : 0
      );
      return Math.min(100, score);
    }

    if (eventType === 'health') {
      const score = Math.max(
        d6 ? Math.round((houseStrengthScore(d6, 6) + houseStrengthScore(d6, 8) + houseStrengthScore(d6, 12)) / 3) : 0,
        d60 ? Math.round((houseStrengthScore(d60, 6) + houseStrengthScore(d60, 12)) / 2) : 0,
        charts.d1 ? Math.round((houseStrengthScore(charts.d1, 6) + houseStrengthScore(charts.d1, 8) + houseStrengthScore(charts.d1, 12)) / 3) : 0
      );
      return Math.min(100, score);
    }

    const score = Math.max(
      charts.d1 ? Math.round((houseStrengthScore(charts.d1, 1) + houseStrengthScore(charts.d1, 10) + houseStrengthScore(charts.d1, 9)) / 3) : 0,
      d9 ? chartPlanetSupport(d9) : 0,
      d10 ? chartPlanetSupport(d10) : 0
    );
    return Math.min(100, score);
  }

  function transitTriggerForType(eventType, transit) {
    const score = transit?.trigger?.[eventType] || 0;
    if (score > 0) return Math.min(100, score);
    return transit?.available ? 20 : 0;
  }

  function eventStrengthForType(eventType, charts) {
    const d1 = charts.d1 ? getChart(charts.d1) : null;
    const d10 = charts.d10 ? getChart(charts.d10) : null;
    const d9 = charts.d9 ? getChart(charts.d9) : null;
    const d2 = charts.d2 ? getChart(charts.d2) : null;
    const d6 = charts.d6 ? getChart(charts.d6) : null;
    const d60 = charts.d60 ? getChart(charts.d60) : null;

    if (eventType === 'career') {
      return Math.min(100, Math.round(
        (d1 ? (houseStrengthScore(d1, 10) * 0.30) + (houseStrengthScore(d1, 6) * 0.15) + (houseStrengthScore(d1, 11) * 0.15) : 0) +
        (d10 ? (houseStrengthScore(d10, 10) * 0.25) + (houseStrengthScore(d10, 11) * 0.15) : 0) +
        (d9 ? chartPlanetSupport(d9) * 0.10 : 0)
      ));
    }

    if (eventType === 'wealth') {
      return Math.min(100, Math.round(
        (d1 ? (houseStrengthScore(d1, 2) * 0.25) + (houseStrengthScore(d1, 11) * 0.25) + (houseStrengthScore(d1, 5) * 0.10) : 0) +
        (d2 ? (houseStrengthScore(d2, 2) * 0.20) + (houseStrengthScore(d2, 11) * 0.20) : 0) +
        (d10 ? (houseStrengthScore(d10, 10) * 0.10) : 0)
      ));
    }

    if (eventType === 'marriage') {
      return Math.min(100, Math.round(
        (d1 ? (houseStrengthScore(d1, 7) * 0.35) + (houseStrengthScore(d1, 5) * 0.10) : 0) +
        (d9 ? chartPlanetSupport(d9) * 0.30 : 0) +
        (d2 ? houseStrengthScore(d2, 11) * 0.05 : 0)
      ));
    }

    if (eventType === 'health') {
      return Math.min(100, Math.round(
        (d1 ? (houseStrengthScore(d1, 6) * 0.25) + (houseStrengthScore(d1, 8) * 0.20) + (houseStrengthScore(d1, 12) * 0.20) : 0) +
        (d6 ? (houseStrengthScore(d6, 6) * 0.20) + (houseStrengthScore(d6, 8) * 0.10) + (houseStrengthScore(d6, 12) * 0.10) : 0) +
        (d60 ? chartPlanetSupport(d60) * 0.05 : 0)
      ));
    }

    return Math.min(100, Math.round(
      (d1 ? (houseStrengthScore(d1, 1) * 0.15) + (houseStrengthScore(d1, 10) * 0.20) + (houseStrengthScore(d1, 9) * 0.15) : 0) +
      (d9 ? chartPlanetSupport(d9) * 0.20 : 0) +
      (d10 ? chartPlanetSupport(d10) * 0.20 : 0) +
      (d60 ? chartPlanetSupport(d60) * 0.10 : 0)
    ));
  }

  function maturityFactorForType(eventType, age, charts) {
    const planets = {
      career: ['Sun', 'Saturn', 'Mercury', 'Jupiter', 'Mars'],
      wealth: ['Jupiter', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Rahu'],
      marriage: ['Venus', 'Jupiter', 'Moon', 'Saturn'],
      health: ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'],
      power: ['Sun', 'Jupiter', 'Saturn', 'Mars']
    }[eventType] || [];

    if (!Number.isFinite(age)) return 1;
    const factors = planets.map(name => {
      const maturity = MATURE_AGES[name] || 30;
      return age >= maturity ? 1.25 : 0.85;
    });
    return factors.length ? factors.reduce((sum, item) => sum + item, 0) / factors.length : 1;
  }

  function ageWindowForType(eventType, age) {
    if (!Number.isFinite(age)) return 'Age unknown';
    const ranges = {
      career: [Math.max(16, age - 1), age + 4],
      wealth: [Math.max(18, age), age + 5],
      marriage: [Math.max(18, age - 2), age + 4],
      health: [Math.max(18, age - 1), age + 3],
      power: [Math.max(25, age), age + 8]
    }[eventType] || [age, age + 3];
    return `${ranges[0]}-${ranges[1]}`;
  }

  function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function calculateEventProbability(eventType, charts, dasha, transit, age) {
    const base = eventStrengthForType(eventType, charts);
    const dashaFactor = 0.80 + (dashaActivationForType(dasha, charts.d1 ? getChart(charts.d1) : null, eventType) / 100) * 0.45;
    const transitFactor = 0.80 + (transitTriggerForType(eventType, transit) / 100) * 0.45;
    const divisionalFactor = 0.75 + (divisionalConfirmationForType(eventType, charts) / 100) * 0.50;
    const maturityFactor = maturityFactorForType(eventType, age, charts);
    const timingStrength = 0.85 + (base / 100) * 0.35;
    const raw = base * dashaFactor * transitFactor * divisionalFactor * maturityFactor * timingStrength;
    return clampScore(raw);
  }

  function classifyProbability(eventType, score) {
    const labels = {
      career: ['Low growth', 'Stable job', 'Promotion window', 'Breakthrough period', 'Elite rise period'],
      wealth: ['Slow buildup', 'Steady accumulation', 'Wealth growth', 'Acceleration phase', 'Billionaire window'],
      marriage: ['Delayed / weak', 'Possible union', 'Marriage window', 'Strong marriage window', 'High probability marriage window'],
      health: ['Stable', 'Minor caution', 'Watch period', 'Crisis window', 'High-risk window'],
      power: ['Low rise', 'Steady rise', 'Authority period', 'Peak authority', 'Command / legacy phase']
    };
    const thresholds = [20, 40, 60, 80];
    const list = labels[eventType] || labels.career;
    if (score < thresholds[0]) return list[0];
    if (score < thresholds[1]) return list[1];
    if (score < thresholds[2]) return list[2];
    if (score < thresholds[3]) return list[3];
    return list[4];
  }

  function detectRiskFlags(charts, dasha, transit) {
    const flags = [];
    const text = asText(dasha?.rawText).toLowerCase();
    if (/saturn.*rahu|rahu.*saturn/.test(text)) flags.push('Saturn-Rahu period');
    if (/ketu.*mars|mars.*ketu/.test(text)) flags.push('Ketu-Mars disruption');
    if (/8|12/.test(text) && /lord|dasha/.test(text)) flags.push('8th/12th lord activation');
    if (transit?.available && transit.rawText.includes('saturn') && transit.rawText.includes('rahu')) flags.push('Heavy Saturn-Rahu transit');
    if (charts.d1 && (houseStrengthScore(charts.d1, 6) < 40 || houseStrengthScore(charts.d1, 8) < 40) && (dasha?.tokens || []).some(token => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(token))) {
      flags.push('Low natal support during malefic dasha');
    }
    return Array.from(new Set(flags));
  }

  function buildTimingNotes(result) {
    const notes = [];
    if (result.career.probability >= 70) notes.push('Career timing is strongly activated and can support rise, promotion, or major role change.');
    if (result.wealth.probability >= 70) notes.push('Wealth timing is strong enough for monetization, gains, or asset growth.');
    if (result.marriage.probability >= 70) notes.push('Marriage indicators are active and deserve close timing review.');
    if (result.health.probability >= 60) notes.push('Health timing needs caution because affliction or malefic activation is elevated.');
    if (result.rajyoga.probability >= 70) notes.push('Rajyoga activation is present and can support authority, rank, or reputation.');
    if (!notes.length) notes.push('No major timing peak is strongly activated right now.');
    return notes;
  }

  function summarizeEvent(eventType, charts, dasha, transit, age) {
    const probability = clampScore(Math.round(
      config.base *
      (0.80 + (dashaActivation / 100) * 0.45) *
      (0.80 + (transitTrigger / 100) * 0.45) *
      (0.75 + (divisionalScore / 100) * 0.50) *
      maturity *
      (0.85 + (config.base / 100) * 0.35)
    ));
    const baseStrength = eventStrengthForType(eventType, charts);
    const dashaScore = dashaActivationForType(dasha, charts.d1 ? getChart(charts.d1) : null, eventType);
    const transitScore = transitTriggerForType(eventType, transit);
    const divisionalScore = divisionalConfirmationForType(eventType, charts);
    const maturityScore = clampScore(maturityFactorForType(eventType, age, charts) * 100);
    const strengthModifier = clampScore(0.85 * 100 + (baseStrength * 0.25));

    return {
      event: eventType,
      probability,
      classification: classifyProbability(eventType, probability),
      window: ageWindowForType(eventType, age),
      base_strength: baseStrength,
      dasha_activation: dashaScore,
      transit_trigger: transitScore,
      divisional_confirmation: divisionalScore,
      age_maturity: maturityScore,
      strength_modifier: strengthModifier
    };
  }

  function scoreRiseFall(result) {
    const gainDrivers = [result.career.probability, result.wealth.probability, result.rajyoga.probability].reduce((sum, value) => sum + value, 0) / 3;
    const strainDrivers = [result.health.probability, result.risk_flags.length * 12].reduce((sum, value) => sum + value, 0);
    const delta = Math.max(0, gainDrivers - strainDrivers * 0.5);
    return {
      probability: clampScore(delta),
      classification: delta >= 80 ? 'Major rise' : delta >= 60 ? 'Moderate rise' : delta >= 40 ? 'Stable / mixed' : 'Pressure / consolidation',
      window: result.career.window,
      rise_score: clampScore(gainDrivers),
      fall_score: clampScore(strainDrivers)
    };
  }

  function analyzeTiming(chartsInput) {
    const state = getAppState();
    const charts = {
      d1: chartsInput?.d1 ? normalizeChart(chartsInput.d1, 'D1') : null,
      d9: chartsInput?.d9 ? normalizeChart(chartsInput.d9, 'D9') : null,
      d10: chartsInput?.d10 ? normalizeChart(chartsInput.d10, 'D10') : null,
      d11: chartsInput?.d11 ? normalizeChart(chartsInput.d11, 'D11') : null,
      d2: chartsInput?.d2 ? normalizeChart(chartsInput.d2, 'D2') : null,
      d6: chartsInput?.d6 ? normalizeChart(chartsInput.d6, 'D6') : null,
      d12: chartsInput?.d12 ? normalizeChart(chartsInput.d12, 'D12') : null,
      d16: chartsInput?.d16 ? normalizeChart(chartsInput.d16, 'D16') : null,
      d24: chartsInput?.d24 ? normalizeChart(chartsInput.d24, 'D24') : null,
      d60: chartsInput?.d60 ? normalizeChart(chartsInput.d60, 'D60') : null
    };

    if (!charts.d1) {
      return { version: '1.0.0', error: 'D1 chart is required for timing analysis.' };
    }

    const endpointOutputs = chartsInput?.endpointOutputs || state?.endpointOutputs || {};
    const dasha = extractDashaContext(endpointOutputs);
    const transit = extractTransitContext(endpointOutputs);
    const age = Number.isFinite(chartsInput?.age) ? chartsInput.age : parseAgeFromProfile();

    const career = summarizeEvent('career', charts, dasha, transit, age);
    const wealth = summarizeEvent('wealth', charts, dasha, transit, age);
    const marriage = summarizeEvent('marriage', charts, dasha, transit, age);
    const health = summarizeEvent('health', charts, dasha, transit, age);
    const rajyoga = summarizeEvent('power', charts, dasha, transit, age);
    const riseFall = scoreRiseFall({ career, wealth, marriage, health, rajyoga });

    const currentAge = Number.isFinite(age) ? age : null;
    const age_windows = {
      career: career.window,
      wealth: wealth.window,
      marriage: marriage.window,
      health: health.window,
      power: rajyoga.window,
      age_23_25: currentAge != null ? `${Math.max(23, currentAge - 2)}-${Math.max(25, currentAge + 2)}` : '23-25',
      age_26_29: currentAge != null ? `${Math.max(26, currentAge)}-${Math.max(29, currentAge + 4)}` : '26-29',
      age_28_31: currentAge != null ? `${Math.max(28, currentAge - 1)}-${Math.max(31, currentAge + 2)}` : '28-31',
      age_35_42: currentAge != null ? `${Math.max(35, currentAge)}-${Math.max(42, currentAge + 7)}` : '35-42',
      age_42_plus: currentAge != null ? `${Math.max(42, currentAge)}+` : '42+'
    };

    const risk_flags = detectRiskFlags(charts, dasha, transit);
    const summary = {
      career: career.classification,
      wealth: wealth.classification,
      marriage: marriage.classification,
      health: health.classification,
      rajyoga: rajyoga.classification,
      rise_fall: riseFall.classification
    };

    return {
      version: '1.0.0',
      age: currentAge,
      current_dasha: dasha.available ? dasha.rawText || 'Dasha data loaded' : 'No dasha data loaded',
      dasha_activation: {
        available: dasha.available,
        tokens: dasha.tokens,
        raw_text: dasha.rawText
      },
      transit_trigger: {
        available: transit.available,
        trigger: transit.trigger,
        note: transit.available ? 'Transit endpoint detected' : 'No transit endpoint detected; transit trigger remains conservative.'
      },
      career,
      wealth,
      marriage,
      health,
      rajyoga,
      rise_fall: riseFall,
      summary,
      age_windows,
      risk_flags,
      formula: 'Event Probability = Base Yoga Strength × Dasha Activation × Transit Trigger × Divisional Confirmation × Age Maturity × Strength Modifier',
      notes: buildTimingNotes({ career, wealth, marriage, health, rajyoga, rise_fall: riseFall, risk_flags })
    };
  }

  function renderTimingReport(result, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!result) {
      target.innerHTML = '<div class="card tiny muted">Timing engine has no result to render.</div>';
      return;
    }

    if (result.error) {
      target.innerHTML = `<div class="card tiny muted">${escapeHtml(result.error)}</div>`;
      return;
    }

    const eventRows = [result.career, result.wealth, result.marriage, result.health, result.rajyoga].map(item => `
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
        <div>
          <div style="font-weight:700;">${escapeHtml(item.event.toUpperCase())}</div>
          <div class="tiny muted">${escapeHtml(item.classification)} | Window ${escapeHtml(item.window)}</div>
        </div>
        <div class="tiny muted">${Math.round(item.probability)}%</div>
      </div>
    `).join('');

    target.innerHTML = `
      <div style="display:grid; gap:14px;">
        <div class="card tiny">
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;">
            <div>
              <div class="tiny muted">Peak Probability</div>
              <div style="font-size:28px; font-weight:800; letter-spacing:-0.03em;">${Math.max(0, Math.min(100, Math.round((result.career.probability + result.wealth.probability + result.marriage.probability + result.health.probability + result.rajyoga.probability) / 5)))}%</div>
            </div>
            <div class="tiny muted" style="text-align:right;">
              Age ${result.age != null ? result.age : 'n/a'} | Dasha ${result.dasha_activation?.tokens?.join(' / ') || 'unavailable'}
            </div>
          </div>
          <div class="tiny muted">${escapeHtml(result.formula || 'Timing formula active.')}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Event Windows</div>
          <div style="display:grid; gap:8px;">${eventRows}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Age Windows</div>
          <div class="tiny">${Object.entries(result.age_windows || {}).map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(value)}`).join(' | ')}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Rise / Fall Cycle</div>
          <div class="tiny">${escapeHtml(result.rise_fall.classification)} (${Math.round(result.rise_fall.probability)}%)</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Risk Flags</div>
          <div class="tiny">${(result.risk_flags || []).length ? result.risk_flags.map(flag => `<div style="margin-bottom:6px;">${escapeHtml(flag)}</div>`).join('') : 'No major timing red flags detected.'}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Summary</div>
          <div class="tiny">Career: ${escapeHtml(result.summary?.career || '-') } | Wealth: ${escapeHtml(result.summary?.wealth || '-') } | Marriage: ${escapeHtml(result.summary?.marriage || '-') } | Health: ${escapeHtml(result.summary?.health || '-') } | Rajyoga: ${escapeHtml(result.summary?.rajyoga || '-')}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Notes</div>
          <div class="tiny">${(result.notes || []).map(note => `<div style="margin-bottom:6px;">${escapeHtml(note)}</div>`).join('')}</div>
        </div>
      </div>
    `;
  }

  function evaluateFromState() {
    const state = getAppState();
    return analyzeTiming({
      d1: state?.d1 || null,
      d9: state?.d9 || null,
      d10: state?.d10 || null,
      d11: state?.d11 || null,
      d2: state?.d2 || null,
      d6: state?.d6 || null,
      d12: state?.d12 || null,
      d16: state?.d16 || null,
      d24: state?.d24 || null,
      d60: state?.d60 || null,
      endpointOutputs: state?.endpointOutputs || {}
    });
  }

  function runAndRender(targetId) {
    const result = evaluateFromState();
    renderTimingReport(result, targetId || 'timingOutput');
    return result;
  }

  root.TimingEngine = {
    evaluate: analyzeTiming,
    evaluateFromState,
    render: renderTimingReport,
    runAndRender,
    normalizeChart,
    houseStrengthScore,
    planetStrengthScore,
    hasConnection,
    isHouseStrong,
    chartPlanetSupport,
    maturityFactor,
    parseAgeFromProfile
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
// Professional predictive timing engine
// Supports career, wealth, marriage, health, and rajyoga timing using dasha, transit, divisional, age, and strength layers.
(function (root) {
  'use strict';

  const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const MATURITY_AGES = {
    Sun: 22,
    Moon: 24,
    Mars: 28,
    Mercury: 32,
    Jupiter: 16,
    Venus: 25,
    Saturn: 36,
    Rahu: 42,
    Ketu: 48
  };

  function getAppState() {
    return root.state || root.__ASTRO_STATE__ || null;
  }

  function asText(value) {
    return value == null ? '' : String(value).trim();
  }

  function asNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function escapeHtml(text) {
    return asText(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getHelperEngine() {
    return root.WealthEngine || root.CareerEngine || null;
  }

  function normalizeChart(source, label) {
    const helper = getHelperEngine();
    if (helper && typeof helper.normalizeChart === 'function') {
      return helper.normalizeChart(source, label);
    }
    const raw = source && typeof source === 'object' && source.data && typeof source.data === 'object' ? source.data : source || {};
    const planets = PLANETS.map(name => {
      const item = raw[name] || raw[name.toLowerCase()];
      if (!item || typeof item !== 'object') return null;
      return {
        name,
        house: asNumber(item.house_number || item.house || item.bhava || item.position, null),
        sign: asText(item.zodiac_sign_name || item.sign || item.rasi || item.rashi || item.sign_name) || null,
        exalted: Boolean(item.exalted || item.is_exalted),
        debilitated: Boolean(item.debilitated || item.is_debilitated),
        ownSign: Boolean(item.own_sign || item.is_in_own_sign),
        retrograde: Boolean(item.retrograde || item.is_retrograde),
        combust: Boolean(item.combust || item.combustion || item.is_combust),
        vargottama: Boolean(item.vargottama || item.is_vargottama),
        aspects: [],
        conjunctions: []
      };
    }).filter(Boolean);
    const houses = {};
    for (let house = 1; house <= 12; house += 1) {
      const occupantList = planets.filter(planet => planet.house === house);
      houses[house] = { house, sign: null, lord: null, occupants: occupantList };
    }
    return { type: label || null, raw, planets, houses, houseSigns: {}, lords: {} };
  }

  function scorePlanet(chart, name) {
    const helper = getHelperEngine();
    if (helper && typeof helper.planetStrengthScore === 'function') {
      const planet = chart?.planets?.find(item => item.name === name) || null;
      return helper.planetStrengthScore(planet) || 0;
    }
    const planet = chart?.planets?.find(item => item.name === name) || null;
    if (!planet) return 0;
    let score = 20;
    if (planet.exalted) score += 25;
    if (planet.ownSign) score += 18;
    if (planet.vargottama) score += 8;
    if (planet.retrograde) score += 2;
    if (planet.combust) score -= 8;
    if (planet.debilitated) score -= 10;
    if (planet.house && [1, 4, 7, 10].includes(planet.house)) score += 6;
    if (planet.house && [2, 5, 9, 11].includes(planet.house)) score += 4;
    return clamp(score, 0, 100);
  }

  function scoreHouse(chart, house) {
    const helper = getHelperEngine();
    if (helper && typeof helper.houseStrengthScore === 'function') {
      return helper.houseStrengthScore(chart, house) || 0;
    }
    const occupants = chart?.houses?.[house]?.occupants || [];
    let score = 15;
    if (occupants.length) score += occupants.length * 5;
    occupants.forEach(planet => {
      score += Math.round(scorePlanet(chart, planet.name) / 20);
    });
    if ([2, 5, 9, 10, 11].includes(house)) score += 8;
    return clamp(score, 0, 100);
  }

  function strongHouseSet(chart, houses) {
    return houses.reduce((sum, house) => sum + scoreHouse(chart, house), 0) / houses.length / 100;
  }

  function strongPlanetSet(chart, planets) {
    return planets.reduce((sum, name) => sum + scorePlanet(chart, name), 0) / planets.length / 100;
  }

  function relationBonus(chart, first, second) {
    const helper = getHelperEngine();
    const a = chart?.planets?.find(item => item.name === first) || null;
    const b = chart?.planets?.find(item => item.name === second) || null;
    if (helper && typeof helper.hasConnection === 'function') {
      return helper.hasConnection(a, b, chart) ? 0.15 : 0;
    }
    if (!a || !b) return 0;
    if (a.house && a.house === b.house) return 0.12;
    if (a.aspects?.includes?.(b.name) || b.aspects?.includes?.(a.name)) return 0.1;
    return 0;
  }

  function getCurrentAge() {
    const state = getAppState();
    const rawDob = state?.dob || root.document?.getElementById('dob')?.value || '';
    if (!rawDob) return null;
    const dob = new Date(rawDob);
    if (Number.isNaN(dob.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDelta = now.getMonth() - dob.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) age -= 1;
    return age;
  }

  function collectOutput(state, id) {
    const entry = state?.endpointOutputs?.[id];
    if (!entry) return null;
    return entry.data?.output ?? entry.data ?? null;
  }

  function flattenText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(flattenText).join(' ');
    if (typeof value === 'object') {
      return Object.entries(value).map(([key, item]) => `${key} ${flattenText(item)}`).join(' ');
    }
    return String(value);
  }

  function parseDashaContext(state) {
    const raw = collectOutput(state, 'vim-maha-antar') || collectOutput(state, 'vim-maha');
    const text = flattenText(raw).toLowerCase();
    const activePlanets = PLANETS.filter(name => text.includes(name.toLowerCase()));
    const tokens = activePlanets.length ? activePlanets : [];
    return { raw, text, activePlanets, tokens, hasDasha: Boolean(raw) };
  }

  function parseTransitContext(state) {
    const raw = collectOutput(state, 'transit') || collectOutput(state, 'planet-transits') || collectOutput(state, 'gochar') || null;
    const text = flattenText(raw).toLowerCase();
    const activePlanets = PLANETS.filter(name => text.includes(name.toLowerCase()));
    return { raw, text, activePlanets, hasTransit: Boolean(raw) };
  }

  function getDivisionalChart(state, key) {
    const direct = state?.[key];
    if (direct) return direct;
    const output = collectOutput(state, key);
    return output ? normalizeChart(output, key.toUpperCase()) : null;
  }

  function loadCharts(state) {
    return {
      d1: state?.d1 ? normalizeChart(state.d1, 'D1') : null,
      d9: state?.d9 ? normalizeChart(state.d9, 'D9') : getDivisionalChart(state, 'd9'),
      d10: state?.d10 ? normalizeChart(state.d10, 'D10') : getDivisionalChart(state, 'd10'),
      d11: state?.d11 ? normalizeChart(state.d11, 'D11') : getDivisionalChart(state, 'd11'),
      d2: state?.d2 ? normalizeChart(state.d2, 'D2') : getDivisionalChart(state, 'd2'),
      d6: state?.d6 ? normalizeChart(state.d6, 'D6') : getDivisionalChart(state, 'd6'),
      d12: state?.d12 ? normalizeChart(state.d12, 'D12') : getDivisionalChart(state, 'd12'),
      d16: state?.d16 ? normalizeChart(state.d16, 'D16') : getDivisionalChart(state, 'd16'),
      d60: state?.d60 ? normalizeChart(state.d60, 'D60') : getDivisionalChart(state, 'd60')
    };
  }

  function maturityFactor(planet, age) {
    if (!planet || age == null) return 0.9;
    const maturityAge = MATURITY_AGES[planet] || 30;
    if (age >= maturityAge) return 1.25;
    if (age >= maturityAge - 2) return 1.05;
    return 0.85;
  }

  function maturityFactorForSet(planets, age) {
    if (!planets.length) return 0.95;
    const value = planets.reduce((sum, planet) => sum + maturityFactor(planet, age), 0) / planets.length;
    return clamp(value, 0.75, 1.25);
  }

  function scoreDashaActivation(dasha, planets, houseLords) {
    if (!dasha.hasDasha) return 0.6;
    const text = dasha.text;
    let score = 0.55;
    planets.forEach(name => {
      if (text.includes(name.toLowerCase())) score += 0.12;
    });
    houseLords.forEach(name => {
      if (name && text.includes(name.toLowerCase())) score += 0.1;
    });
    if (text.includes('maha') || text.includes('antar')) score += 0.05;
    return clamp(score, 0.4, 1.25);
  }

  function scoreTransitTrigger(transit, planets, houseTexts) {
    if (!transit.hasTransit) return 0.6;
    let score = 0.55;
    planets.forEach(name => {
      if (transit.text.includes(name.toLowerCase())) score += 0.1;
    });
    houseTexts.forEach(textValue => {
      if (textValue && transit.text.includes(String(textValue))) score += 0.08;
    });
    if (transit.text.includes('jupiter') || transit.text.includes('saturn') || transit.text.includes('rahu')) score += 0.1;
    return clamp(score, 0.4, 1.2);
  }

  function scoreDivisionalConfirmation(eventType, charts) {
    switch (eventType) {
      case 'career':
        return clamp(((charts.d10 ? scoreHouse(charts.d10, 10) + scoreHouse(charts.d10, 11) : 0) / 200) + (charts.d9 ? scoreHouse(charts.d9, 10) / 400 : 0.1), 0.4, 1.15);
      case 'wealth':
        return clamp(((charts.d2 ? scoreHouse(charts.d2, 2) + scoreHouse(charts.d2, 11) : 0) / 200) + (charts.d11 ? scoreHouse(charts.d11, 11) / 300 : 0.1), 0.4, 1.2);
      case 'marriage':
        return clamp(((charts.d9 ? scoreHouse(charts.d9, 7) : 0) / 100) + (charts.d12 ? scoreHouse(charts.d12, 7) / 400 : 0.15), 0.4, 1.15);
      case 'health':
        return clamp(((charts.d6 ? scoreHouse(charts.d6, 6) + scoreHouse(charts.d6, 8) : 0) / 200) + (charts.d60 ? scoreHouse(charts.d60, 6) / 400 : 0.1), 0.4, 1.1);
      case 'rajyoga':
        return clamp(((charts.d10 ? scoreHouse(charts.d10, 10) : 0) + (charts.d9 ? scoreHouse(charts.d9, 9) : 0)) / 250, 0.4, 1.2);
      default:
        return 0.75;
    }
  }

  function scoreCareerBase(charts) {
    const chart = charts.d1;
    if (!chart) return 0.25;
    const houses = strongHouseSet(chart, [2, 6, 10, 11]);
    const planets = strongPlanetSet(chart, ['Sun', 'Mercury', 'Jupiter', 'Saturn']);
    const links = relationBonus(chart, 'Sun', 'Saturn') + relationBonus(chart, 'Mercury', 'Saturn') + relationBonus(chart, 'Jupiter', 'Mercury');
    const d10 = charts.d10 ? (scoreHouse(charts.d10, 10) + scoreHouse(charts.d10, 11)) / 200 : 0.15;
    return clamp((houses * 0.45) + (planets * 0.3) + links + d10, 0.2, 1.05);
  }

  function scoreWealthBase(charts) {
    const chart = charts.d1;
    if (!chart) return 0.25;
    const houses = strongHouseSet(chart, [2, 5, 9, 11]);
    const planets = strongPlanetSet(chart, ['Jupiter', 'Venus', 'Mercury', 'Moon']);
    const links = relationBonus(chart, 'Jupiter', 'Venus') + relationBonus(chart, 'Mercury', 'Moon') + relationBonus(chart, 'Rahu', 'Mercury');
    const d2 = charts.d2 ? (scoreHouse(charts.d2, 2) + scoreHouse(charts.d2, 11)) / 200 : 0.15;
    return clamp((houses * 0.45) + (planets * 0.25) + links + d2, 0.2, 1.05);
  }

  function scoreMarriageBase(charts) {
    const chart = charts.d1;
    if (!chart) return 0.25;
    const houses = strongHouseSet(chart, [5, 7, 9]);
    const planets = strongPlanetSet(chart, ['Venus', 'Jupiter', 'Moon']);
    const links = relationBonus(chart, 'Venus', 'Jupiter') + relationBonus(chart, 'Moon', 'Venus');
    const d9 = charts.d9 ? scoreHouse(charts.d9, 7) / 100 : 0.15;
    return clamp((houses * 0.45) + (planets * 0.3) + links + d9, 0.2, 1.05);
  }

  function scoreHealthBase(charts) {
    const chart = charts.d1;
    if (!chart) return 0.35;
    const challenge = strongHouseSet(chart, [6, 8, 12]);
    const malefics = strongPlanetSet(chart, ['Saturn', 'Mars', 'Rahu', 'Ketu']);
    const d6 = charts.d6 ? (scoreHouse(charts.d6, 6) + scoreHouse(charts.d6, 8)) / 200 : 0.2;
    return clamp((challenge * 0.4) + (malefics * 0.35) + d6, 0.25, 1.05);
  }

  function scoreRajyogaBase(charts) {
    const chart = charts.d1;
    if (!chart) return 0.25;
    const houses = strongHouseSet(chart, [1, 4, 5, 9, 10]);
    const planets = strongPlanetSet(chart, ['Sun', 'Jupiter', 'Saturn', 'Mercury']);
    const links = relationBonus(chart, 'Sun', 'Jupiter') + relationBonus(chart, 'Jupiter', 'Saturn') + relationBonus(chart, 'Mercury', 'Jupiter');
    const d10 = charts.d10 ? scoreHouse(charts.d10, 10) / 100 : 0.15;
    return clamp((houses * 0.4) + (planets * 0.25) + links + d10, 0.2, 1.05);
  }

  function labelFromScore(score, scale) {
    if (scale === 'health') {
      if (score >= 78) return 'high risk';
      if (score >= 60) return 'warning';
      if (score >= 42) return 'caution';
      return 'stable';
    }
    if (score >= 82) return 'elite rise period';
    if (score >= 68) return 'breakthrough period';
    if (score >= 52) return 'promotion window';
    if (score >= 35) return 'stable phase';
    return 'low growth';
  }

  function wealthLabel(score) {
    if (score >= 82) return 'billionaire window';
    if (score >= 68) return 'wealth acceleration';
    if (score >= 52) return 'accumulation phase';
    if (score >= 35) return 'salary growth';
    return 'low liquidity';
  }

  function marriageLabel(score) {
    if (score >= 80) return 'very likely';
    if (score >= 63) return 'likely';
    if (score >= 45) return 'supportive';
    return 'delayed';
  }

  function healthLabel(score) {
    if (score >= 78) return 'major illness / surgery caution';
    if (score >= 60) return 'health crisis window';
    if (score >= 42) return 'watchful recovery phase';
    return 'stable recovery';
  }

  function riskFlags(charts, dasha, transit) {
    const flags = [];
    const text = `${dasha.text} ${transit.text}`;
    if (text.includes('saturn') && text.includes('rahu')) flags.push('Saturn-Rahu period');
    if (text.includes('8th')) flags.push('8th lord or 8th-house activation');
    if (transit.text.includes('12') || transit.text.includes('lagna')) flags.push('12th lord / lagna transit caution');
    if (scoreHealthBase(charts) >= 0.8) flags.push('High challenge houses active');
    if (scoreHouse(charts.d1, 6) < 40 && scoreHouse(charts.d1, 8) > 60) flags.push('Hidden health stress');
    return flags;
  }

  function eventWindow(age, score, maturity, label) {
    if (age == null) {
      return { age_band: `${maturity - 2}-${maturity + 2}`, outlook: label };
    }
    const start = Math.max(0, Math.min(age, maturity - 2));
    const end = Math.max(maturity + 2, age + (score >= 70 ? 4 : 2));
    return { age_band: `${start}-${end}`, outlook: label };
  }

  function scoreEvent(eventType, charts, dasha, transit, age) {
    const config = {
      career: {
        base: scoreCareerBase(charts),
        planets: ['Sun', 'Mercury', 'Jupiter', 'Saturn'],
        houses: [2, 6, 10, 11],
        maturity: [MATURITY_AGES.Sun, MATURITY_AGES.Mercury, MATURITY_AGES.Jupiter, MATURITY_AGES.Saturn],
        labeler: labelFromScore
      },
      wealth: {
        base: scoreWealthBase(charts),
        planets: ['Jupiter', 'Venus', 'Mercury', 'Rahu'],
        houses: [2, 5, 9, 11],
        maturity: [MATURITY_AGES.Jupiter, MATURITY_AGES.Venus, MATURITY_AGES.Mercury, MATURITY_AGES.Rahu],
        labeler: wealthLabel
      },
      marriage: {
        base: scoreMarriageBase(charts),
        planets: ['Venus', 'Jupiter', 'Moon'],
        houses: [5, 7, 9],
        maturity: [MATURITY_AGES.Venus, MATURITY_AGES.Jupiter, MATURITY_AGES.Moon],
        labeler: marriageLabel
      },
      health: {
        base: scoreHealthBase(charts),
        planets: ['Saturn', 'Mars', 'Rahu', 'Ketu'],
        houses: [6, 8, 12],
        maturity: [MATURITY_AGES.Saturn, MATURITY_AGES.Mars, MATURITY_AGES.Rahu, MATURITY_AGES.Ketu],
        labeler: healthLabel
      },
      rajyoga: {
        base: scoreRajyogaBase(charts),
        planets: ['Sun', 'Jupiter', 'Saturn', 'Mercury'],
        houses: [1, 4, 5, 9, 10],
        maturity: [MATURITY_AGES.Sun, MATURITY_AGES.Jupiter, MATURITY_AGES.Saturn, MATURITY_AGES.Mercury],
        labeler: labelFromScore
      }
    }[eventType];

    const dashaActivation = scoreDashaActivation(dasha, config.planets, config.houses.map(String));
    const transitTrigger = scoreTransitTrigger(transit, config.planets, config.houses.map(String));
    const divisional = scoreDivisionalConfirmation(eventType, charts);
    const maturity = maturityFactorForSet(config.planets, age);
    const modifier = clamp((strongHouseSet(charts.d1, config.houses) * 0.5) + (strongPlanetSet(charts.d1, config.planets) * 0.35) + 0.3, 0.6, 1.3);

    const probability = Math.max(0, Math.min(100, Math.round(
      config.base * 100 *
      (0.80 + (dashaActivation / 100) * 0.45) *
      (0.80 + (transitTrigger / 100) * 0.45) *
      (0.75 + (divisional / 100) * 0.50) *
      maturity *
      (0.85 + (config.base / 100) * 0.35)
    )));
    const avgMaturity = Math.round(config.maturity.reduce((sum, item) => sum + item, 0) / config.maturity.length);
    const currentAgeBand = eventWindow(age, probability, avgMaturity, config.labeler(probability, eventType));

    return {
      event: eventType,
      probability,
      base_strength: Math.round(config.base * 100),
      dasha_activation: Math.round(dashaActivation * 100),
      transit_trigger: Math.round(transitTrigger * 100),
      divisional_confirmation: Math.round(divisional * 100),
      age_maturity: Math.round(maturity * 100),
      strength_modifier: Math.round(modifier * 100),
      outcome: config.labeler(probability, eventType),
      maturity_age: avgMaturity,
      current_age: age,
      age_band: currentAgeBand.age_band,
      peak_window: currentAgeBand.outlook,
      risk_flags: eventType === 'health' ? riskFlags(charts, dasha, transit) : [],
      contributing_planets: config.planets,
      contributing_houses: config.houses,
      notes: buildEventNotes(eventType, probability, dasha, transit, charts)
    };
  }

  function buildEventNotes(eventType, probability, dasha, transit, charts) {
    const notes = [];
    if (!dasha.hasDasha) notes.push('Dasha timing is not available, so this score leans on chart strength and divisional confirmation.');
    if (!transit.hasTransit) notes.push('Transit input is unavailable; transit support is estimated conservatively.');
    if (eventType === 'career' && scoreHouse(charts.d1, 10) >= 60) notes.push('10th house promise is strong enough to sustain a rise window once timing activates.');
    if (eventType === 'wealth' && scoreHouse(charts.d2 || charts.d1, 11) >= 60) notes.push('11th house gains can monetize quickly when dasha and transit align.');
    if (eventType === 'marriage' && scoreHouse(charts.d9 || charts.d1, 7) >= 55) notes.push('Marriage timing is supported by destiny maturity.');
    if (eventType === 'health' && probability >= 60) notes.push('Health timing should be read as a caution window, not a diagnosis.');
    if (eventType === 'rajyoga' && scoreHouse(charts.d1, 10) >= 60) notes.push('Rajyoga activation is linked to public rise and status delivery.');
    return notes;
  }

  function buildMasterWindows(predictions, age) {
    const career = predictions.career;
    const wealth = predictions.wealth;
    const marriage = predictions.marriage;
    const health = predictions.health;
    const rajyoga = predictions.rajyoga;
    const currentAge = age == null ? null : Number(age);
    if (currentAge == null) {
      return [
        { age_band: '23-25', label: career.outcome, detail: 'career breakthrough window' },
        { age_band: '26-29', label: wealth.outcome, detail: 'wealth acceleration window' },
        { age_band: '28-31', label: marriage.outcome, detail: 'marriage probability window' },
        { age_band: '35-42', label: rajyoga.outcome, detail: 'authority rise window' },
        { age_band: '42+', label: health.outcome, detail: 'mature caution / transformation window' }
      ];
    }

    return [
      { age_band: `${currentAge}-${currentAge + 2}`, label: career.outcome, detail: 'near-term career trajectory' },
      { age_band: `${currentAge + 1}-${currentAge + 4}`, label: wealth.outcome, detail: 'near-term wealth trajectory' },
      { age_band: `${currentAge}-${currentAge + 5}`, label: marriage.outcome, detail: 'relationship timing' },
      { age_band: `${currentAge}-${currentAge + 3}`, label: health.outcome, detail: 'health watch window' },
      { age_band: `${currentAge + 2}-${currentAge + 6}`, label: rajyoga.outcome, detail: 'status / authority window' }
    ];
  }

  function evaluatePredictiveTiming(chartsInput = {}, meta = {}) {
    const state = getAppState();
    const charts = loadCharts({
      ...state,
      ...chartsInput,
      endpointOutputs: meta.endpointOutputs || state?.endpointOutputs || {}
    });
    if (!charts.d1) {
      return { version: '1.0.0', error: 'D1 chart is required for predictive timing analysis.' };
    }

    const dasha = meta.dasha || parseDashaContext(state);
    const transit = meta.transit || parseTransitContext(state);
    const age = meta.age ?? getCurrentAge();

    const predictions = {
      career: scoreEvent('career', charts, dasha, transit, age),
      wealth: scoreEvent('wealth', charts, dasha, transit, age),
      marriage: scoreEvent('marriage', charts, dasha, transit, age),
      health: scoreEvent('health', charts, dasha, transit, age),
      rajyoga: scoreEvent('rajyoga', charts, dasha, transit, age)
    };
    const career = predictions.career;
    const wealth = predictions.wealth;
    const marriage = predictions.marriage;
    const health = predictions.health;
    const rajyoga = predictions.rajyoga;

    const combinedRiseScore = clamp(Math.round(
      (predictions.career.probability * 0.30) +
      (predictions.wealth.probability * 0.25) +
      (predictions.rajyoga.probability * 0.25) -
      (predictions.health.probability * 0.20)
    ), 0, 100);

    const riseFall = combinedRiseScore >= 75
      ? 'major rise'
      : combinedRiseScore >= 60
        ? 'steady rise'
        : combinedRiseScore >= 45
          ? 'volatile plateau'
          : 'caution / fall risk';

    return {
      version: '1.0.0',
      current_age: age,
      dasha: {
        has_dasha: dasha.hasDasha,
        active_planets: dasha.activePlanets,
        source: dasha.hasDasha ? 'dasha_api' : 'unavailable'
      },
      transit: {
        has_transit: transit.hasTransit,
        active_planets: transit.activePlanets,
        source: transit.hasTransit ? 'transit_api' : 'proxy'
      },
      career,
      wealth,
      marriage,
      health,
      rajyoga,
      rise_fall_cycle: {
        score: combinedRiseScore,
        label: riseFall
      },
      predictions,
      age_windows: buildMasterWindows(predictions, age),
      master_formula: 'Event Probability = Base Yoga Strength x Dasha Activation x Transit Trigger x Divisional Confirmation x Age Maturity x Strength Modifier',
      risk_flags: Array.from(new Set([
        ...(predictions.health.risk_flags || []),
        ...(dasha.text.includes('saturn') && dasha.text.includes('rahu') ? ['Saturn-Rahu period'] : []),
        ...(transit.text.includes('12') ? ['12th house transit caution'] : [])
      ])),
      summary: summarizeTiming(predictions, combinedRiseScore)
    };
  }

  function summarizeTiming(predictions, combinedRiseScore) {
    const career = predictions.career.outcome;
    const wealth = predictions.wealth.outcome;
    const marriage = predictions.marriage.outcome;
    const health = predictions.health.outcome;
    const rajyoga = predictions.rajyoga.outcome;
    return [
      `Career: ${career}`,
      `Wealth: ${wealth}`,
      `Marriage: ${marriage}`,
      `Health: ${health}`,
      `Rajyoga: ${rajyoga}`,
      `Rise/Fall: ${combinedRiseScore >= 75 ? 'strong upward delivery' : combinedRiseScore >= 60 ? 'steady upward delivery' : combinedRiseScore >= 45 ? 'mixed / volatile' : 'caution required'}`
    ];
  }

  function renderTimingReport(result, targetId) {
    const target = root.document?.getElementById(targetId);
    if (!target) return;

    if (!result) {
      target.innerHTML = '<div class="card tiny muted">Timing engine has no result to render.</div>';
      return;
    }

    if (result.error) {
      target.innerHTML = `<div class="card tiny muted">${escapeHtml(result.error)}</div>`;
      return;
    }

    const rows = Object.entries(result.predictions || {});
    const ageWindows = Array.isArray(result.age_windows) ? result.age_windows : [];

    target.innerHTML = `
      <div style="display:grid; gap:14px;">
        <div class="card tiny">
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;">
            <div>
              <div class="tiny muted">Timing Score</div>
              <div style="font-size:28px; font-weight:800; letter-spacing:-0.03em;">${Math.max(0, Math.min(100, Math.round(result.rise_fall_cycle?.score || 0)))}</div>
            </div>
            <div class="tiny muted" style="text-align:right;">
              Current age: ${result.current_age == null ? 'n/a' : result.current_age}<br />
              Rise / Fall: ${escapeHtml(result.rise_fall_cycle?.label || 'n/a')}
            </div>
          </div>
          <div class="tiny muted">${escapeHtml(result.master_formula || 'Timing formula active.')}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Event Predictions</div>
          <div style="display:grid; gap:8px;">
            ${rows.map(([key, item]) => `
              <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                  <div>
                    <div style="font-weight:700; text-transform:capitalize;">${escapeHtml(key)}</div>
                    <div class="tiny muted">${escapeHtml(item.outcome)} | age ${escapeHtml(item.age_band || 'n/a')}</div>
                  </div>
                  <div class="tiny muted">${Math.round(item.probability || 0)}%</div>
                </div>
                <div class="tiny muted" style="margin-top:4px;">Base ${item.base_strength}% | Dasha ${item.dasha_activation}% | Transit ${item.transit_trigger}% | Divisional ${item.divisional_confirmation}% | Age ${item.age_maturity}%</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Age Windows</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${ageWindows.map(window => `<span class="tag info">${escapeHtml(window.age_band)}: ${escapeHtml(window.label)}</span>`).join('')}
          </div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Risk Flags</div>
          <div class="tiny">${(result.risk_flags && result.risk_flags.length) ? result.risk_flags.map(flag => `<div style="margin-bottom:6px;">${escapeHtml(flag)}</div>`).join('') : 'No major timing risk flags detected.'}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Summary</div>
          <div class="tiny">${(result.summary || []).map(line => `<div style="margin-bottom:6px;">${escapeHtml(line)}</div>`).join('')}</div>
        </div>
      </div>
    `;
  }

  function evaluateFromState() {
    const state = getAppState();
    return evaluatePredictiveTiming(
      {
        d1: state?.d1 || null,
        d9: state?.d9 || null,
        d10: state?.d10 || null,
        d11: state?.d11 || null,
        d2: state?.d2 || null,
        d6: state?.d6 || null,
        d12: state?.d12 || null,
        d16: state?.d16 || null,
        d60: state?.d60 || null
      },
      {
        endpointOutputs: state?.endpointOutputs || {}
      }
    );
  }

  function runAndRender(targetId) {
    const result = evaluateFromState();
    renderTimingReport(result, targetId || 'timingOutput');
    return result;
  }

  root.TimingEngine = {
    evaluate: evaluatePredictiveTiming,
    evaluateFromState,
    render: renderTimingReport,
    runAndRender,
    getCurrentAge,
    parseDashaContext,
    parseTransitContext,
    maturityFactor,
    scoreEvent
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
