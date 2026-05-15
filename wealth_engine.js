// Professional wealth and dhan yoga detection engine
// Supports normalized D1, D2, D9, D10, D11 and optional D24, D60 validation.
(function (root) {
  'use strict';

  const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const MALEFICS = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];
  const KENDRAS = [1, 4, 7, 10];
  const TRIKONAS = [1, 5, 9];
  const WEALTH_HOUSES = {
    2: 'Stored wealth / savings / family assets',
    5: 'Speculation / intelligence / investments',
    8: 'Inheritance / hidden wealth',
    9: 'Fortune / blessings / luck',
    10: 'Career-generated income',
    11: 'Profits / gains / cashflow'
  };

  const SIGN_LORDS = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
    Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
  };

  const SIGN_ALIASES = {
    Mesha: 'Aries', Vrishabha: 'Taurus', Mithuna: 'Gemini', Karka: 'Cancer', Simha: 'Leo', Kanya: 'Virgo',
    Tula: 'Libra', Vrischika: 'Scorpio', Dhanu: 'Sagittarius', Makara: 'Capricorn', Kumbha: 'Aquarius', Meena: 'Pisces'
  };

  const SIGN_GROUPS = {
    FIRE: ['Aries', 'Leo', 'Sagittarius'],
    EARTH: ['Taurus', 'Virgo', 'Capricorn'],
    AIR: ['Gemini', 'Libra', 'Aquarius'],
    WATER: ['Cancer', 'Scorpio', 'Pisces']
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

  function isTruthy(value) {
    if (value === true) return true;
    if (value === false || value == null) return false;
    if (typeof value === 'number') return value !== 0;
    const normalized = asText(value).toLowerCase();
    return ['true', 'yes', 'y', '1', 'exalted', 'strong', 'present', 'combust', 'retrograde'].includes(normalized);
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
    const sign = normalizeSign(
      payload.zodiac_sign_name || payload.sign || payload.rasi || payload.rashi || payload.sign_name || payload.signName || payload.zodiacSign
    );
    const house = asNumber(
      payload.house_number || payload.house || payload.bhava || payload.bhava_number || payload.houseNo || payload.house_no || payload.position,
      null
    );
    const degree = asNumber(
      payload.degree || payload.longitude || payload.longitude_deg || payload.full_degree || payload.position_degree,
      null
    );
    const retrograde = isTruthy(payload.retrograde || payload.is_retrograde || payload.retro || payload.isRetrograde);
    const combust = isTruthy(payload.combustion || payload.is_combust || payload.combust || payload.isCombust);
    const exalted = isTruthy(payload.is_exalted || payload.exalted || payload.dignity === 'exalted');
    const debilitated = isTruthy(payload.is_debilitated || payload.debilitated || payload.dignity === 'debilitated');
    const ownSign = isTruthy(payload.is_in_own_sign || payload.own_sign || payload.isOwnSign);
    const mooltrikona = isTruthy(payload.mooltrikona || payload.mool_trikona || payload.is_mooltrikona);
    const vargottama = isTruthy(payload.vargottama || payload.is_vargottama);
    const nakshatra = asText(payload.nakshatra_name || payload.nakshatra || payload.star || payload.asterism) || null;
    const aspects = normalizeAspectList(payload.aspects || payload.aspecting || payload.drishti || payload.drstis || payload.aspected_by);
    const conjunctions = normalizeAspectList(payload.conjunctions || payload.conjunction || payload.companions || payload.with);
    return {
      name: planetName,
      sign,
      house,
      degree,
      nakshatra,
      retrograde,
      combust,
      exalted,
      debilitated,
      ownSign,
      mooltrikona,
      vargottama,
      aspects,
      conjunctions,
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

  function getPlanet(chart, name) {
    if (!chart || !chart.planets) return null;
    const normalized = normalizePlanetName(name);
    return chart.planets.find(planet => normalizePlanetName(planet.name) === normalized) || null;
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
    if (planet.house && KENDRAS.includes(planet.house)) score += 6;
    if (planet.house && TRIKONAS.includes(planet.house)) score += 6;
    if (planet.retrograde) score += 2;
    if (planet.combust) score -= 8;
    if (planet.debilitated) score -= 10;
    if (planet.house && [2, 5, 9, 10, 11].includes(planet.house) && BENEFICS.includes(planet.name)) score += 6;
    return Math.max(0, Math.min(100, score));
  }

  function isPlanetStrong(planet) {
    return planetStrengthScore(planet) >= 45;
  }

  function houseStrengthScore(chart, house) {
    if (!chart) return 0;
    let score = 10;
    const sign = getHouseSign(chart, house);
    const occupants = getHouseOccupants(chart, house);
    const lord = getHouseLordPlanet(chart, house);

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
      if (isPlanetStrong(lord)) score += 4;
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

  function sameHouseOrConjunction(a, b) {
    return Boolean(a && b && a.house && b.house && a.house === b.house);
  }

  function aspectRelation(a, b) {
    if (!a || !b) return false;
    const aHouse = a.house;
    const bHouse = b.house;
    if (aHouse && bHouse) {
      const forward = ((bHouse - aHouse + 12) % 12) + 1;
      const backward = ((aHouse - bHouse + 12) % 12) + 1;
      if ([4, 7, 8].includes(forward) || [4, 7, 8].includes(backward)) return true;
    }
    if (a.aspects?.some(name => normalizePlanetName(name) === b.name)) return true;
    if (b.aspects?.some(name => normalizePlanetName(name) === a.name)) return true;
    if (a.conjunctions?.some(name => normalizePlanetName(name) === b.name)) return true;
    if (b.conjunctions?.some(name => normalizePlanetName(name) === a.name)) return true;
    return false;
  }

  function hasConnection(entity1, entity2, chart) {
    if (!entity1 || !entity2) return false;
    if (sameHouseOrConjunction(entity1, entity2)) return true;
    if (aspectRelation(entity1, entity2)) return true;
    if (chart) {
      const a = entity1.name ? getPlanet(chart, entity1.name) : entity1;
      const b = entity2.name ? getPlanet(chart, entity2.name) : entity2;
      if (sameHouseOrConjunction(a, b) || aspectRelation(a, b)) return true;
    }
    return false;
  }

  function isDhanaSupport(chart) {
    const l2 = getHouseLordPlanet(chart, 2);
    const l11 = getHouseLordPlanet(chart, 11);
    const l5 = getHouseLordPlanet(chart, 5);
    const l9 = getHouseLordPlanet(chart, 9);
    if (!l2 || !l11) return false;
    return hasConnection(l2, l11, chart) || hasConnection(l2, l5, chart) || hasConnection(l2, l9, chart);
  }

  function hasHousePairStrength(chart, first, second) {
    return isHouseStrong(chart, first) && isHouseStrong(chart, second);
  }

  function getHouseLordStrength(chart, house) {
    return planetStrengthScore(getHouseLordPlanet(chart, house));
  }

  function hasBeneficSupport(chart, house) {
    const occupants = getHouseOccupants(chart, house);
    const lord = getHouseLordPlanet(chart, house);
    if (occupants.some(planet => BENEFICS.includes(planet.name))) return true;
    return Boolean(lord && BENEFICS.includes(lord.name));
  }

  function chartPlanetSupport(chart) {
    if (!chart) return 0;
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map(name => getPlanet(chart, name)).filter(Boolean);
    if (!planets.length) return 0;
    const sum = planets.reduce((total, planet) => total + planetStrengthScore(planet), 0);
    return Math.max(0, Math.min(100, Math.round(sum / planets.length)));
  }

  function evaluateD1WealthPromise(chart) {
    if (!chart) return 0;
    let score = 0;
    [2, 5, 9, 10, 11].forEach(house => {
      if (isHouseStrong(chart, house)) score += 10;
      else if (hasBeneficSupport(chart, house)) score += 5;
    });
    if (isDhanaSupport(chart)) score += 10;
    if (isHouseStrong(chart, 8)) score += 4;
    if (isHouseStrong(chart, 4)) score += 4;
    ['Jupiter', 'Venus', 'Mercury', 'Moon'].forEach(name => {
      if (isPlanetStrong(getPlanet(chart, name))) score += 4;
    });
    if (hasConnection(getPlanet(chart, 'Moon'), getPlanet(chart, 'Mercury'), chart)) score += 4;
    if (hasConnection(getPlanet(chart, 'Jupiter'), getPlanet(chart, 'Venus'), chart)) score += 4;
    if (hasConnection(getPlanet(chart, 'Mercury'), getPlanet(chart, 'Rahu'), chart)) score += 5;
    if (getHouseLordStrength(chart, 2) > 50) score += 4;
    if (getHouseLordStrength(chart, 11) > 50) score += 4;
    return Math.max(0, Math.min(100, score));
  }

  function evaluateD2WealthStrength(d2Chart) {
    if (!d2Chart) return 0;
    let score = 0;
    if (isHouseStrong(d2Chart, 2)) score += 30;
    if (isHouseStrong(d2Chart, 11)) score += 30;
    if (isHouseStrong(d2Chart, 5)) score += 10;
    if (isHouseStrong(d2Chart, 9)) score += 10;
    if (isPlanetStrong(getHouseLordPlanet(d2Chart, 2))) score += 15;
    if (isPlanetStrong(getHouseLordPlanet(d2Chart, 11))) score += 15;
    if (isPlanetStrong(getPlanet(d2Chart, 'Jupiter'))) score += 10;
    if (isPlanetStrong(getPlanet(d2Chart, 'Venus'))) score += 10;
    if (isPlanetStrong(getPlanet(d2Chart, 'Mercury'))) score += 8;
    if (hasConnection(getPlanet(d2Chart, 'Jupiter'), getPlanet(d2Chart, 'Moon'), d2Chart)) score += 8;
    if (hasConnection(getPlanet(d2Chart, 'Venus'), getPlanet(d2Chart, 'Mercury'), d2Chart)) score += 8;
    if (hasConnection(getPlanet(d2Chart, 'Saturn'), getPlanet(d2Chart, 'Mercury'), d2Chart)) score += 5;
    return Math.max(0, Math.min(100, score));
  }

  function evaluateD10IncomeStrength(d10Chart) {
    if (!d10Chart) return 0;
    let score = 0;
    if (isHouseStrong(d10Chart, 10)) score += 25;
    if (isHouseStrong(d10Chart, 11)) score += 20;
    if (isHouseStrong(d10Chart, 2)) score += 10;
    if (isPlanetStrong(getHouseLordPlanet(d10Chart, 10))) score += 15;
    if (isPlanetStrong(getHouseLordPlanet(d10Chart, 11))) score += 10;
    if (isPlanetStrong(getPlanet(d10Chart, 'Sun'))) score += 10;
    if (isPlanetStrong(getPlanet(d10Chart, 'Mercury'))) score += 10;
    if (isPlanetStrong(getPlanet(d10Chart, 'Jupiter'))) score += 10;
    if (isPlanetStrong(getPlanet(d10Chart, 'Saturn'))) score += 8;
    if (hasConnection(getPlanet(d10Chart, 'Mercury'), getPlanet(d10Chart, 'Rahu'), d10Chart)) score += 8;
    if (hasConnection(getPlanet(d10Chart, 'Sun'), getPlanet(d10Chart, 'Saturn'), d10Chart)) score += 6;
    return Math.max(0, Math.min(100, score));
  }

  function evaluateD11GainsStrength(d11Chart) {
    if (!d11Chart) return 0;
    let score = 0;
    if (isHouseStrong(d11Chart, 11)) score += 35;
    if (isHouseStrong(d11Chart, 2)) score += 15;
    if (isHouseStrong(d11Chart, 5)) score += 10;
    if (isHouseStrong(d11Chart, 9)) score += 10;
    if (isPlanetStrong(getHouseLordPlanet(d11Chart, 11))) score += 15;
    if (isPlanetStrong(getPlanet(d11Chart, 'Jupiter'))) score += 10;
    if (isPlanetStrong(getPlanet(d11Chart, 'Venus'))) score += 10;
    if (isPlanetStrong(getPlanet(d11Chart, 'Mercury'))) score += 8;
    if (hasConnection(getPlanet(d11Chart, 'Jupiter'), getPlanet(d11Chart, 'Venus'), d11Chart)) score += 8;
    if (hasConnection(getPlanet(d11Chart, 'Mercury'), getPlanet(d11Chart, 'Moon'), d11Chart)) score += 5;
    return Math.max(0, Math.min(100, score));
  }

  function evaluateTimingSupport() {
    const state = getAppState();
    const dasa = state?.endpointOutputs?.['vim-maha-antar']?.data || state?.endpointOutputs?.['vim-maha']?.data || null;
    if (!dasa) return 0;
    const text = JSON.stringify(dasa).toLowerCase();
    let score = 0;
    if (text.includes('jupiter') || text.includes('venus') || text.includes('mercury')) score += 30;
    if (text.includes('11') || text.includes('wealth') || text.includes('gain') || text.includes('money')) score += 25;
    if (text.includes('current') || text.includes('running') || text.includes('active')) score += 15;
    return Math.max(0, Math.min(100, score));
  }

  function evaluateTransitSupport() {
    const state = getAppState();
    const transit = state?.endpointOutputs?.transit || state?.endpointOutputs?.['planet-transits'] || null;
    if (!transit) return 0;
    const text = JSON.stringify(transit).toLowerCase();
    let score = 0;
    if (text.includes('jupiter') || text.includes('saturn')) score += 20;
    if (text.includes('11') || text.includes('2') || text.includes('wealth') || text.includes('gain')) score += 20;
    if (text.includes('10') || text.includes('career') || text.includes('income')) score += 10;
    return Math.max(0, Math.min(100, score));
  }

  function ruleEvidence(planets) {
    return planets.filter(Boolean).map(planet => {
      const details = [];
      if (planet.house) details.push(`H${planet.house}`);
      if (planet.sign) details.push(planet.sign);
      if (planet.exalted) details.push('Exalted');
      if (planet.ownSign) details.push('Own Sign');
      if (planet.vargottama) details.push('Vargottama');
      if (planet.retrograde) details.push('Retro');
      if (planet.combust) details.push('Combust');
      return `${planet.name}${details.length ? ` (${details.join(', ')})` : ''}`;
    });
  }

  function houseSummary(chart, house) {
    if (!chart) return `H${house}: unavailable`;
    const sign = getHouseSign(chart, house) || 'Unknown';
    const occupants = getHouseOccupants(chart, house);
    const lord = getHouseLordName(chart, house) || 'Unknown';
    const strength = houseStrengthScore(chart, house);
    return `H${house} ${sign} | Lord ${lord} | Occupants ${occupants.length} | Strength ${strength}`;
  }

  function buildContext(charts) {
    const d1 = charts.d1 || null;
    const d9 = charts.d9 || null;
    const d10 = charts.d10 || null;
    const d11 = charts.d11 || null;
    const d2 = charts.d2 || null;
    const d24 = charts.d24 || null;
    const d60 = charts.d60 || null;

    const planets = {
      Sun: d1 ? getPlanet(d1, 'Sun') : null,
      Moon: d1 ? getPlanet(d1, 'Moon') : null,
      Mars: d1 ? getPlanet(d1, 'Mars') : null,
      Mercury: d1 ? getPlanet(d1, 'Mercury') : null,
      Jupiter: d1 ? getPlanet(d1, 'Jupiter') : null,
      Venus: d1 ? getPlanet(d1, 'Venus') : null,
      Saturn: d1 ? getPlanet(d1, 'Saturn') : null,
      Rahu: d1 ? getPlanet(d1, 'Rahu') : null,
      Ketu: d1 ? getPlanet(d1, 'Ketu') : null
    };

    const lords = {};
    for (let house = 1; house <= 12; house += 1) {
      lords[house] = d1 ? getHouseLordPlanet(d1, house) : null;
    }

    return {
      charts,
      d1,
      d9,
      d10,
      d11,
      d2,
      d24,
      d60,
      planets,
      lords,
      support: {
        d1: chartPlanetSupport(d1),
        d9: chartPlanetSupport(d9),
        d10: chartPlanetSupport(d10),
        d11: chartPlanetSupport(d11),
        d2: chartPlanetSupport(d2),
        d24: chartPlanetSupport(d24),
        d60: chartPlanetSupport(d60)
      }
    };
  }

  function createRuleSet(context) {
    const { d1, d9, d10, d11, d2, d24, d60, planets, lords } = context;

    const rule = (id, category, label, score, when, evidence) => ({ id, category, label, score, when, evidence });
    const rules = [];

    rules.push(
      rule('foundation_2', 'Foundational', 'Strong 2nd House Wealth Base', 9, () => isHouseStrong(d1, 2), () => [houseSummary(d1, 2)]),
      rule('foundation_11', 'Foundational', 'Strong 11th House Gain Base', 9, () => isHouseStrong(d1, 11), () => [houseSummary(d1, 11)]),
      rule('foundation_5', 'Foundational', 'Strong 5th House Speculation Base', 7, () => isHouseStrong(d1, 5), () => [houseSummary(d1, 5)]),
      rule('foundation_9', 'Foundational', 'Strong 9th House Fortune Base', 7, () => isHouseStrong(d1, 9), () => [houseSummary(d1, 9)]),
      rule('foundation_10', 'Foundational', 'Strong 10th House Career Income Base', 8, () => isHouseStrong(d1, 10), () => [houseSummary(d1, 10)]),
      rule('foundation_dhana', 'Foundational', '2nd-11th Dhana Support', 10, () => isDhanaSupport(d1), () => [houseSummary(d1, 2), houseSummary(d1, 11)]),
      rule('foundation_jupiter', 'Foundational', 'Strong Jupiter Wealth Blessing', 8, () => isPlanetStrong(planets.Jupiter), () => ruleEvidence([planets.Jupiter])),
      rule('foundation_venus', 'Foundational', 'Strong Venus Prosperity Support', 8, () => isPlanetStrong(planets.Venus), () => ruleEvidence([planets.Venus])),
      rule('foundation_mercury', 'Foundational', 'Strong Mercury Money Flow Support', 7, () => isPlanetStrong(planets.Mercury), () => ruleEvidence([planets.Mercury])),
      rule('foundation_moon', 'Foundational', 'Strong Moon Liquidity Support', 7, () => isPlanetStrong(planets.Moon), () => ruleEvidence([planets.Moon]))
    );

    rules.push(
      rule('savings_2_11_pair', 'Savings', '2nd and 11th Savings Axis', 10, () => hasHousePairStrength(d1, 2, 11), () => [houseSummary(d1, 2), houseSummary(d1, 11)]),
      rule('savings_moon_mercury', 'Savings', 'Moon-Mercury Cash Flow Yoga', 8, () => hasConnection(planets.Moon, planets.Mercury, d1), () => ruleEvidence([planets.Moon, planets.Mercury])),
      rule('savings_saturn_2_11', 'Savings', 'Saturn Long-Term Accumulation Yoga', 9, () => Boolean(getPlanet(d1, 'Saturn') && [2, 11].includes(getPlanet(d1, 'Saturn').house)), () => ruleEvidence([planets.Saturn])),
      rule('savings_venus_2_11', 'Savings', 'Venus Luxury Asset Yoga', 8, () => Boolean(getPlanet(d1, 'Venus') && [2, 11].includes(getPlanet(d1, 'Venus').house)), () => ruleEvidence([planets.Venus])),
      rule('savings_mercury_2', 'Savings', 'Mercury in 2nd House', 7, () => Boolean(planets.Mercury && planets.Mercury.house === 2), () => ruleEvidence([planets.Mercury])),
      rule('savings_jupiter_11', 'Savings', 'Jupiter in 11th House', 7, () => Boolean(planets.Jupiter && planets.Jupiter.house === 11), () => ruleEvidence([planets.Jupiter]))
    );

    rules.push(
      rule('business_2_7_11', 'Business', '2nd-7th-11th Business Support', 10, () => isHouseStrong(d1, 2) && isHouseStrong(d1, 7) && isHouseStrong(d1, 11), () => [houseSummary(d1, 2), houseSummary(d1, 7), houseSummary(d1, 11)]),
      rule('business_mercury_venus', 'Business', 'Mercury-Venus Commerce Yoga', 9, () => hasConnection(planets.Mercury, planets.Venus, d1), () => ruleEvidence([planets.Mercury, planets.Venus])),
      rule('business_mercury_mars', 'Business', 'Mercury-Mars Trade / Execution Yoga', 8, () => hasConnection(planets.Mercury, planets.Mars, d1), () => ruleEvidence([planets.Mercury, planets.Mars])),
      rule('business_rahu_mercury', 'Business', 'Rahu-Mercury Startup Wealth Yoga', 9, () => hasConnection(planets.Rahu, planets.Mercury, d1), () => ruleEvidence([planets.Rahu, planets.Mercury])),
      rule('business_10l_7', 'Business', '10th Lord in 7th', 8, () => Boolean(lords[10] && lords[10].house === 7), () => ruleEvidence([lords[10]])),
      rule('business_7l_10', 'Business', '7th Lord in 10th', 8, () => Boolean(lords[7] && lords[7].house === 10), () => ruleEvidence([lords[7]])),
      rule('business_lagna_7', 'Business', 'Lagna Lord in 7th', 7, () => Boolean(lords[1] && lords[1].house === 7), () => ruleEvidence([lords[1]])),
      rule('business_2_11_lords', 'Business', '2nd and 11th Lord Association', 9, () => hasConnection(lords[2], lords[11], d1), () => ruleEvidence([lords[2], lords[11]])),
      rule('business_family', 'Business', 'Family Business Yoga', 7, () => hasConnection(lords[2], lords[7], d1) || hasConnection(lords[2], lords[10], d1), () => ruleEvidence([lords[2], lords[7], lords[10]]))
    );

    rules.push(
      rule('investment_5_11', 'Investments', '5th and 11th Investment Growth Yoga', 10, () => hasConnection(lords[5], lords[11], d1), () => ruleEvidence([lords[5], lords[11]])),
      rule('investment_speculative', 'Investments', 'Speculative Wealth Yoga', 8, () => isHouseStrong(d1, 5) && hasConnection(lords[5], lords[11], d1), () => [houseSummary(d1, 5), houseSummary(d1, 11)]),
      rule('investment_stock_market', 'Investments', 'Stock Market Wealth Yoga', 9, () => hasConnection(planets.Rahu, planets.Jupiter, d1) && isHouseStrong(d1, 5), () => ruleEvidence([planets.Rahu, planets.Jupiter])),
      rule('investment_trading', 'Investments', 'Trading Genius Yoga', 9, () => hasConnection(planets.Mercury, planets.Rahu, d1), () => ruleEvidence([planets.Mercury, planets.Rahu])),
      rule('investment_crypto', 'Investments', 'Crypto / Modern Wealth Yoga', 8, () => Boolean(planets.Rahu && planets.Rahu.house === 11 && hasConnection(planets.Rahu, planets.Mercury, d1)), () => ruleEvidence([planets.Rahu, planets.Mercury])),
      rule('investment_chandra_mangal', 'Investments', 'Chandra-Mangal Capital Build Yoga', 9, () => hasConnection(planets.Moon, planets.Mars, d1), () => ruleEvidence([planets.Moon, planets.Mars])),
      rule('investment_jupiter_venus', 'Investments', 'Jupiter-Venus Wealth Expansion Yoga', 8, () => hasConnection(planets.Jupiter, planets.Venus, d1), () => ruleEvidence([planets.Jupiter, planets.Venus])),
      rule('investment_rahu_5_11', 'Investments', 'Rahu in 5th or 11th Speculation Yoga', 8, () => Boolean(planets.Rahu && [5, 11].includes(planets.Rahu.house)), () => ruleEvidence([planets.Rahu])),
      rule('investment_mercury_2', 'Investments', 'Mercury Trade / Liquidity Yoga', 7, () => Boolean(planets.Mercury && [2, 7, 10, 11].includes(planets.Mercury.house)), () => ruleEvidence([planets.Mercury]))
    );

    rules.push(
      rule('inheritance_8_strong', 'Inheritance', 'Strong 8th House Hidden Wealth', 9, () => isHouseStrong(d1, 8), () => [houseSummary(d1, 8)]),
      rule('inheritance_2_8', 'Inheritance', '2nd-8th Wealth Transfer Yoga', 8, () => hasConnection(lords[2], lords[8], d1), () => ruleEvidence([lords[2], lords[8]])),
      rule('inheritance_8_11', 'Inheritance', '8th-11th Windfall Gains Yoga', 8, () => hasConnection(lords[8], lords[11], d1), () => ruleEvidence([lords[8], lords[11]])),
      rule('inheritance_jupiter_8', 'Inheritance', 'Jupiter in 8th Hidden Fortune Yoga', 8, () => Boolean(planets.Jupiter && planets.Jupiter.house === 8), () => ruleEvidence([planets.Jupiter])),
      rule('inheritance_rahu_8', 'Inheritance', 'Rahu in 8th Sudden Windfall Yoga', 8, () => Boolean(planets.Rahu && planets.Rahu.house === 8), () => ruleEvidence([planets.Rahu])),
      rule('inheritance_7_8', 'Inheritance', 'Spousal Wealth Yoga', 7, () => hasConnection(lords[7], lords[8], d1), () => ruleEvidence([lords[7], lords[8]])),
      rule('inheritance_hidden', 'Inheritance', 'Hidden Fortune Support', 7, () => hasConnection(planets.Saturn, planets.Jupiter, d1) && isHouseStrong(d1, 8), () => ruleEvidence([planets.Saturn, planets.Jupiter]))
    );

    rules.push(
      rule('property_4_strong', 'Property', 'Strong 4th House Property Base', 8, () => isHouseStrong(d1, 4), () => [houseSummary(d1, 4)]),
      rule('property_4_11', 'Property', '4th and 11th Property Growth Yoga', 9, () => hasConnection(lords[4], lords[11], d1), () => ruleEvidence([lords[4], lords[11]])),
      rule('property_venus_mars', 'Property', 'Luxury Real Estate Yoga', 8, () => hasConnection(planets.Venus, planets.Mars, d1) && isHouseStrong(d1, 4), () => ruleEvidence([planets.Venus, planets.Mars])),
      rule('property_saturn_4', 'Property', 'Landlord / Asset Accumulation Yoga', 8, () => Boolean(planets.Saturn && planets.Saturn.house === 4), () => ruleEvidence([planets.Saturn])),
      rule('property_moon_saturn', 'Property', 'Stable Land / Real Asset Yoga', 7, () => hasConnection(planets.Moon, planets.Saturn, d1), () => ruleEvidence([planets.Moon, planets.Saturn])),
      rule('property_mars_4l', 'Property', 'Construction / Development Yoga', 8, () => hasConnection(planets.Mars, lords[4], d1), () => ruleEvidence([planets.Mars, lords[4]]))
    );

    rules.push(
      rule('foreign_12_strong', 'Foreign', 'Strong 12th House Foreign Flow', 8, () => isHouseStrong(d1, 12), () => [houseSummary(d1, 12)]),
      rule('foreign_12_11', 'Foreign', '12th and 11th Foreign Wealth Yoga', 8, () => hasConnection(lords[12], lords[11], d1), () => ruleEvidence([lords[12], lords[11]])),
      rule('foreign_9_12', 'Foreign', '9th and 12th International Yoga', 8, () => hasConnection(lords[9], lords[12], d1), () => ruleEvidence([lords[9], lords[12]])),
      rule('foreign_7_12', 'Foreign', '7th and 12th Import / Export Yoga', 8, () => hasConnection(lords[7], lords[12], d1), () => ruleEvidence([lords[7], lords[12]])),
      rule('foreign_rahu_10_11_12', 'Foreign', 'Rahu in 10th, 11th, or 12th', 8, () => Boolean(planets.Rahu && [10, 11, 12].includes(planets.Rahu.house)), () => ruleEvidence([planets.Rahu])),
      rule('foreign_diplomatic', 'Foreign', 'Diplomatic / Global Commerce Yoga', 7, () => hasConnection(planets.Sun, planets.Venus, d1), () => ruleEvidence([planets.Sun, planets.Venus]))
    );

    rules.push(
      rule('authority_sun_strong', 'Authority', 'Strong Sun Authority Wealth Yoga', 8, () => isPlanetStrong(planets.Sun), () => ruleEvidence([planets.Sun])),
      rule('authority_sun_11l', 'Authority', 'Sun with 11th Lord', 9, () => hasConnection(planets.Sun, lords[11], d1), () => ruleEvidence([planets.Sun, lords[11]])),
      rule('authority_sun_saturn', 'Authority', 'Sun-Saturn Authority Yoga', 8, () => hasConnection(planets.Sun, planets.Saturn, d1), () => ruleEvidence([planets.Sun, planets.Saturn])),
      rule('authority_sun_jupiter', 'Authority', 'Sun-Jupiter Leadership Wealth Yoga', 8, () => hasConnection(planets.Sun, planets.Jupiter, d1), () => ruleEvidence([planets.Sun, planets.Jupiter])),
      rule('authority_10l_sun_jupiter', 'Authority', '10th Lord with Sun or Jupiter', 9, () => hasConnection(lords[10], planets.Sun, d1) || hasConnection(lords[10], planets.Jupiter, d1), () => ruleEvidence([lords[10], planets.Sun, planets.Jupiter])),
      rule('authority_saturn_10', 'Authority', 'Saturn in 10th or Own Sign', 8, () => Boolean(planets.Saturn && planets.Saturn.house === 10 && planets.Saturn.ownSign), () => ruleEvidence([planets.Saturn])),
      rule('authority_public_sector', 'Authority', 'Public Sector Executive Yoga', 8, () => Boolean(planets.Sun && [10, 11].includes(planets.Sun.house) && isPlanetStrong(planets.Sun)), () => ruleEvidence([planets.Sun]))
    );

    rules.push(
      rule('creative_venus_mercury', 'Creative', 'Venus-Mercury Media / Brand Yoga', 8, () => hasConnection(planets.Venus, planets.Mercury, d1), () => ruleEvidence([planets.Venus, planets.Mercury])),
      rule('creative_moon_venus', 'Creative', 'Moon-Venus Artistic Sensibility', 8, () => hasConnection(planets.Moon, planets.Venus, d1), () => ruleEvidence([planets.Moon, planets.Venus])),
      rule('creative_rahu_venus', 'Creative', 'Rahu-Venus Mass Media Yoga', 8, () => hasConnection(planets.Rahu, planets.Venus, d1), () => ruleEvidence([planets.Rahu, planets.Venus])),
      rule('creative_5_10', 'Creative', '5th-10th Creative Profession Axis', 8, () => isHouseStrong(d1, 5) && isHouseStrong(d1, 10), () => [houseSummary(d1, 5), houseSummary(d1, 10)]),
      rule('creative_moon_10', 'Creative', 'Moon in 10th Public Visibility Yoga', 7, () => Boolean(planets.Moon && planets.Moon.house === 10), () => ruleEvidence([planets.Moon])),
      rule('creative_venus_11', 'Creative', 'Venus in 11th Audience / Revenue Yoga', 7, () => Boolean(planets.Venus && planets.Venus.house === 11), () => ruleEvidence([planets.Venus]))
    );

    rules.push(
      rule('education_jupiter_mercury', 'Education', 'Jupiter-Mercury Knowledge Wealth Yoga', 8, () => hasConnection(planets.Jupiter, planets.Mercury, d1), () => ruleEvidence([planets.Jupiter, planets.Mercury])),
      rule('education_jupiter_sun', 'Education', 'Jupiter-Sun Consulting / Advisory Yoga', 7, () => hasConnection(planets.Jupiter, planets.Sun, d1), () => ruleEvidence([planets.Jupiter, planets.Sun])),
      rule('education_jupiter_l11', 'Education', 'Jupiter with 11th Lord', 8, () => hasConnection(planets.Jupiter, lords[11], d1), () => ruleEvidence([planets.Jupiter, lords[11]])),
      rule('education_mercury_2', 'Education', 'Mercury in 2nd House Financial Literacy Yoga', 7, () => Boolean(planets.Mercury && planets.Mercury.house === 2), () => ruleEvidence([planets.Mercury])),
      rule('education_jupiter_5_9', 'Education', 'Jupiter Supported 5th / 9th Knowledge Base', 8, () => isHouseStrong(d1, 5) && isHouseStrong(d1, 9), () => [houseSummary(d1, 5), houseSummary(d1, 9)])
    );

    rules.push(
      rule('corporate_mnc', 'Corporate', 'MNC Executive Yoga', 8, () => Boolean(planets.Rahu && [10, 11, 12].includes(planets.Rahu.house) && hasConnection(planets.Rahu, lords[10], d1)), () => ruleEvidence([planets.Rahu, lords[10]])),
      rule('corporate_operations', 'Corporate', 'Operations Leadership Yoga', 8, () => hasConnection(planets.Saturn, planets.Mars, d1) && isHouseStrong(d1, 10), () => ruleEvidence([planets.Saturn, planets.Mars])),
      rule('corporate_banking', 'Corporate', 'Banking Sector Yoga', 8, () => hasConnection(planets.Jupiter, planets.Venus, d1) && isHouseStrong(d1, 11), () => ruleEvidence([planets.Jupiter, planets.Venus])),
      rule('corporate_finance', 'Corporate', 'Finance Corporate Yoga', 8, () => hasConnection(planets.Jupiter, planets.Mercury, d1) && isHouseStrong(d1, 2), () => ruleEvidence([planets.Jupiter, planets.Mercury])),
      rule('corporate_hr', 'Corporate', 'HR / Management Yoga', 7, () => hasConnection(planets.Venus, planets.Mercury, d1) && isHouseStrong(d1, 7), () => ruleEvidence([planets.Venus, planets.Mercury])),
      rule('corporate_trade', 'Corporate', 'Structured Trade / Commerce Yoga', 7, () => hasConnection(planets.Saturn, planets.Mercury, d1), () => ruleEvidence([planets.Saturn, planets.Mercury]))
    );

    rules.push(
      rule('special_agriculture', 'Specialized', 'Agriculture / Land Business Yoga', 7, () => hasConnection(planets.Moon, planets.Saturn, d1) && isHouseStrong(d1, 4), () => ruleEvidence([planets.Moon, planets.Saturn])),
      rule('special_hospitality', 'Specialized', 'Hospitality Career Yoga', 7, () => hasConnection(planets.Venus, planets.Moon, d1) && isHouseStrong(d1, 7), () => ruleEvidence([planets.Venus, planets.Moon])),
      rule('special_logistics', 'Specialized', 'Logistics Career Yoga', 7, () => hasConnection(planets.Saturn, planets.Mercury, d1), () => ruleEvidence([planets.Saturn, planets.Mercury])),
      rule('special_manufacturing', 'Specialized', 'Manufacturing Career Yoga', 7, () => hasConnection(planets.Mars, planets.Saturn, d1), () => ruleEvidence([planets.Mars, planets.Saturn])),
      rule('special_mining_oil', 'Specialized', 'Mining / Oil Industry Yoga', 7, () => hasConnection(planets.Saturn, planets.Rahu, d1) && isHouseStrong(d1, 8), () => ruleEvidence([planets.Saturn, planets.Rahu])),
      rule('special_defense', 'Specialized', 'Defense Contractor Yoga', 8, () => hasConnection(planets.Mars, planets.Rahu, d1) && hasConnection(planets.Saturn, lords[10], d1), () => ruleEvidence([planets.Mars, planets.Rahu, planets.Saturn, lords[10]])),
      rule('special_research', 'Research', 'Research Scientist Yoga', 8, () => hasConnection(planets.Ketu, planets.Jupiter, d1) && (isHouseStrong(d1, 8) || isHouseStrong(d1, 9) || isHouseStrong(d1, 12)), () => ruleEvidence([planets.Ketu, planets.Jupiter])),
      rule('special_fintech', 'Specialized', 'Fintech / Digital Finance Yoga', 8, () => hasConnection(planets.Rahu, planets.Mercury, d1) && hasConnection(planets.Venus, planets.Jupiter, d1), () => ruleEvidence([planets.Rahu, planets.Mercury, planets.Venus, planets.Jupiter]))
    );

    rules.push(
      rule('rare_vipreet', 'Rare', 'Vipreet Raj Yoga for Wealth', 9, () => [6, 8, 12].some(house => isHouseStrong(d1, house) && hasConnection(getHouseLordPlanet(d1, house), planets.Saturn || planets.Mars, d1)), () => [houseSummary(d1, 6), houseSummary(d1, 8), houseSummary(d1, 12)]),
      rule('rare_saraswati', 'Rare', 'Saraswati Wealth Intelligence Yoga', 8, () => hasConnection(planets.Mercury, planets.Jupiter, d1) && hasConnection(planets.Jupiter, planets.Venus, d1), () => ruleEvidence([planets.Mercury, planets.Jupiter, planets.Venus])),
      rule('rare_chandra_mangal', 'Rare', 'Chandra-Mangal Wealth Creation Yoga', 9, () => hasConnection(planets.Moon, planets.Mars, d1), () => ruleEvidence([planets.Moon, planets.Mars])),
      rule('rare_kubera', 'Rare', 'Kubera Style Accumulation Yoga', 10, () => isHouseStrong(d1, 2) && isHouseStrong(d1, 11) && hasConnection(planets.Rahu, planets.Jupiter, d1), () => ruleEvidence([planets.Rahu, planets.Jupiter])),
      rule('rare_lakshmi', 'Rare', 'Lakshmi Style Fortune Yoga', 10, () => isPlanetStrong(lords[9]) && [1, 4, 7, 10].includes(lords[9]?.house || 0), () => ruleEvidence([lords[9]])),
      rule('rare_mahalakshmi', 'Rare', 'Maha Lakshmi Wealth Yoga', 10, () => isPlanetStrong(planets.Venus) && isHouseStrong(d1, 9), () => ruleEvidence([planets.Venus]))
    );

    rules.push(
      rule('d2_validation', 'D2 Validation', 'D2 Liquidity / Accumulation Strong', 14, () => Boolean(d2 && evaluateD2WealthStrength(d2) >= 70), () => [houseSummary(d2, 2), houseSummary(d2, 11)]),
      rule('d10_validation', 'D10 Validation', 'D10 Career Income Strong', 12, () => Boolean(d10 && evaluateD10IncomeStrength(d10) >= 65), () => [houseSummary(d10, 10), houseSummary(d10, 11)]),
      rule('d11_validation', 'D11 Validation', 'D11 Gains Chart Strong', 12, () => Boolean(d11 && evaluateD11GainsStrength(d11) >= 65), () => [houseSummary(d11, 11), houseSummary(d11, 2)]),
      rule('d9_validation', 'D9 Validation', 'D9 Planetary Support', 8, () => Boolean(d9 && chartPlanetSupport(d9) >= 55), () => [houseSummary(d9, 1), houseSummary(d9, 10)]),
      rule('d24_validation', 'D24 Validation', 'D24 Skill / Education Support', 6, () => Boolean(d24 && (isHouseStrong(d24, 5) || isHouseStrong(d24, 9))), () => [houseSummary(d24, 5), houseSummary(d24, 9)]),
      rule('d60_validation', 'D60 Validation', 'D60 Karmic Wealth Refinement', 6, () => Boolean(d60 && (isHouseStrong(d60, 2) || isHouseStrong(d60, 11) || isHouseStrong(d60, 10))), () => [houseSummary(d60, 2), houseSummary(d60, 11), houseSummary(d60, 10)])
    );

    return rules;
  }

  function detectRule(rule, context) {
    try {
      if (!rule.when(context)) return null;
      return {
        id: rule.id,
        category: rule.category,
        label: rule.label,
        score: rule.score,
        evidence: rule.evidence(context)
      };
    } catch (error) {
      return null;
    }
  }

  function classifyWealthSources(yogas) {
    const categories = {
      Savings: [],
      Business: [],
      Investments: [],
      Inheritance: [],
      RealEstate: [],
      Foreign: [],
      Authority: [],
      Creative: [],
      Education: [],
      Corporate: [],
      Specialized: [],
      Research: [],
      Rare: []
    };

    yogas.forEach(yoga => {
      const text = String(yoga).toLowerCase();
      if (/savings|cash flow|liquidity|accumulation|stored wealth|banking/.test(text)) categories.Savings.push(yoga);
      if (/business|entrepreneur|startup|commerce|trade|family business/.test(text)) categories.Business.push(yoga);
      if (/investment|stock|trading|speculative|crypto|fintech|market/.test(text)) categories.Investments.push(yoga);
      if (/inheritance|windfall|hidden wealth|spousal wealth|transfer/.test(text)) categories.Inheritance.push(yoga);
      if (/property|real estate|landlord|construction|asset|land/.test(text)) categories.RealEstate.push(yoga);
      if (/foreign|international|mnc|aviation|maritime|import|export|global/.test(text)) categories.Foreign.push(yoga);
      if (/government|authority|public sector|executive|politics|treasury|military|police|defense/.test(text)) categories.Authority.push(yoga);
      if (/creative|media|film|brand|influencer|music|design|luxury/.test(text)) categories.Creative.push(yoga);
      if (/education|knowledge|consulting|advisory|professor|teacher/.test(text)) categories.Education.push(yoga);
      if (/corporate|management|operations|hr|banking|finance corporate/.test(text)) categories.Corporate.push(yoga);
      if (/agriculture|hospitality|logistics|manufacturing|mining|oil|defense contractor|fintech/.test(text)) categories.Specialized.push(yoga);
      if (/research|scientist|analytics|data/.test(text)) categories.Research.push(yoga);
      if (/lakshmi|kubera|vipreet|saraswati|chandra-mangal|maha lakshmi/.test(text)) categories.Rare.push(yoga);
    });

    return categories;
  }

  function classifyWealthDomains(yogas) {
    return Object.fromEntries(Object.entries(classifyWealthSources(yogas)).map(([key, values]) => [key, values.length]));
  }

  function weightedWealthScore(scores) {
    const components = [
      { key: 'd1Promise', weight: 0.35 },
      { key: 'd2Liquidity', weight: 0.30 },
      { key: 'd10Income', weight: 0.15 },
      { key: 'dashaTiming', weight: 0.10 },
      { key: 'transitActivation', weight: 0.10 }
    ];
    const available = components.filter(item => Number.isFinite(scores[item.key]) && scores[item.key] > 0);
    const pool = available.length ? available : components.filter(item => Number.isFinite(scores[item.key]));
    const normalizer = pool.reduce((sum, item) => sum + item.weight, 0) || 1;
    const total = pool.reduce((sum, item) => sum + ((scores[item.key] || 0) * item.weight), 0);
    return Math.max(0, Math.min(100, Math.round(total / normalizer)));
  }

  function inferWealthClusters(context) {
    const { charts, categoryScores, d1Promise, d2Liquidity, d10Income, d11Gains } = context;
    const clusters = [];
    const addCluster = (label, score, evidence) => clusters.push({ label, score, evidence });

    const savingsScore = (categoryScores.Savings || 0) + (categoryScores.Foundational || 0) + (d2Liquidity >= 70 ? 10 : 0);
    if (savingsScore >= 18) addCluster('Savings / Banking / Accumulation', savingsScore, ['2nd house strength', 'D2 liquidity', 'Saturn accumulation']);

    const businessScore = (categoryScores.Business || 0) + (categoryScores.Corporate || 0) + (d1Promise >= 70 ? 8 : 0) + (d10Income >= 60 ? 8 : 0);
    if (businessScore >= 20) addCluster('Business / Entrepreneurship', businessScore, ['2-7-11 support', 'Mercury / Rahu / Venus / Lagna lord']);

    const investmentScore = (categoryScores.Investments || 0) + (d2Liquidity >= 60 ? 8 : 0) + (d11Gains >= 60 ? 8 : 0);
    if (investmentScore >= 18) addCluster('Stock Market / Trading / Crypto', investmentScore, ['5th house speculation', 'Rahu-Mercury', 'D11 gains']);

    const inheritanceScore = (categoryScores.Inheritance || 0) + (isHouseStrong(charts.d1, 8) ? 8 : 0);
    if (inheritanceScore >= 14) addCluster('Inheritance / Family Assets', inheritanceScore, ['8th house support', '2nd-8th linkage']);

    const propertyScore = (categoryScores.RealEstate || 0) + (isHouseStrong(charts.d1, 4) ? 8 : 0);
    if (propertyScore >= 14) addCluster('Real Estate / Property', propertyScore, ['4th house support', 'Venus-Mars / Saturn land patterns']);

    const foreignScore = (categoryScores.Foreign || 0) + (hasConnection(getPlanet(charts.d1, 'Rahu'), getPlanet(charts.d1, 'Mercury'), charts.d1) ? 6 : 0);
    if (foreignScore >= 14) addCluster('Foreign / MNC / Import-Export', foreignScore, ['12th axis', 'Rahu', 'international links']);

    const authorityScore = (categoryScores.Authority || 0) + (d10Income >= 60 ? 8 : 0);
    if (authorityScore >= 16) addCluster('Government / Authority / Treasury', authorityScore, ['Sun-Saturn', 'Sun-Jupiter', '10th house support']);

    const creativeScore = (categoryScores.Creative || 0) + (categoryScores.Education || 0);
    if (creativeScore >= 14) addCluster('Creative / Media / Brand', creativeScore, ['Venus-Mercury', 'Moon-Venus', 'audience revenue']);

    const consultingScore = (categoryScores.Education || 0) + (categoryScores.Specialized || 0);
    if (consultingScore >= 14) addCluster('Consulting / Advisory / Services', consultingScore, ['Jupiter-Mercury', 'Moon-Mercury', 'client work']);

    const researchScore = (categoryScores.Research || 0) + (hasConnection(getPlanet(charts.d1, 'Ketu'), getPlanet(charts.d1, 'Jupiter'), charts.d1) ? 6 : 0);
    if (researchScore >= 12) addCluster('Research / Analytics / Science', researchScore, ['Ketu-Jupiter', '8th / 9th / 12th support']);

    const specializedScore = (categoryScores.Specialized || 0);
    if (specializedScore >= 14) addCluster('Specialized Industries', specializedScore, ['agriculture', 'logistics', 'manufacturing', 'defense', 'hospitality']);

    const rareScore = (categoryScores.Rare || 0) + (d1Promise >= 75 ? 6 : 0) + (d2Liquidity >= 75 ? 6 : 0);
    if (rareScore >= 12) addCluster('High-Value Wealth Combinations', rareScore, ['Kubera / Lakshmi / Vipreet', 'multi-source accumulation']);

    clusters.sort((a, b) => b.score - a.score);
    return clusters;
  }

  function buildNotes({ d1Promise, d2Liquidity, d10Income, d11Gains, dashaTiming, transitActivation }) {
    const notes = [];
    if (d2Liquidity >= 70) notes.push('D2 is a major wealth override: liquidity and accumulation are strong.');
    if (d11Gains >= 70) notes.push('D11 confirms gains and cashflow patterns.');
    if (d10Income >= 70) notes.push('D10 is supportive for career-generated income.');
    if (d1Promise >= 70) notes.push('D1 shows a solid money promise baseline.');
    if (dashaTiming >= 50) notes.push('Current dasa indicators can activate wealth-yoga results.');
    if (transitActivation >= 40) notes.push('Transit activation suggests timing support for growth.');
    if (!notes.length) notes.push('No strong wealth timing notes yet.');
    return notes;
  }

  function analyzeWealthCharts(chartsInput) {
    const charts = {
      d1: chartsInput?.d1 ? normalizeChart(chartsInput.d1, 'D1') : null,
      d9: chartsInput?.d9 ? normalizeChart(chartsInput.d9, 'D9') : null,
      d10: chartsInput?.d10 ? normalizeChart(chartsInput.d10, 'D10') : null,
      d11: chartsInput?.d11 ? normalizeChart(chartsInput.d11, 'D11') : null,
      d2: chartsInput?.d2 ? normalizeChart(chartsInput.d2, 'D2') : null,
      d24: chartsInput?.d24 ? normalizeChart(chartsInput.d24, 'D24') : null,
      d60: chartsInput?.d60 ? normalizeChart(chartsInput.d60, 'D60') : null
    };

    if (!charts.d1) {
      return { version: '1.0.0', error: 'D1 chart is required for wealth analysis.' };
    }

    const context = buildContext(charts);
    const rules = createRuleSet(context);
    const detected = [];
    const categoryScores = {};

    rules.forEach(rule => {
      const match = detectRule(rule, context);
      if (!match) return;
      detected.push(match);
      categoryScores[match.category] = (categoryScores[match.category] || 0) + match.score;
    });

    const d1Promise = evaluateD1WealthPromise(charts.d1);
    const d2Liquidity = charts.d2 ? evaluateD2WealthStrength(charts.d2) : 0;
    const d10Income = charts.d10 ? evaluateD10IncomeStrength(charts.d10) : 0;
    const d11Gains = charts.d11 ? evaluateD11GainsStrength(charts.d11) : 0;
    const dashaTiming = evaluateTimingSupport();
    const transitActivation = evaluateTransitSupport();

    const weighted = weightedWealthScore({ d1Promise, d2Liquidity, d10Income, dashaTiming, transitActivation });
    const wealthCategories = classifyWealthSources(detected.map(rule => rule.label));
    const wealthDomainScores = classifyWealthDomains(detected.map(rule => rule.label));
    const clusters = inferWealthClusters({ charts, categoryScores, d1Promise, d2Liquidity, d10Income, d11Gains });
    const wealthSupportFromCareer = Math.min(100, Math.round(
      (houseStrengthScore(charts.d1, 2) * 0.25) +
      (houseStrengthScore(charts.d1, 11) * 0.25) +
      (houseStrengthScore(charts.d1, 10) * 0.20) +
      (charts.d2 ? d2Liquidity * 0.15 : 0) +
      (charts.d10 ? d10Income * 0.15 : 0)
    ));

    return {
      version: '1.0.0',
      chart_types: {
        d1: charts.d1?.type || null,
        d9: charts.d9?.type || null,
        d10: charts.d10?.type || null,
        d11: charts.d11?.type || null,
        d2: charts.d2?.type || null,
        d24: charts.d24?.type || null,
        d60: charts.d60?.type || null
      },
      detected_dhan_yogas: detected.map(rule => rule.label),
      wealth_yoga_details: detected,
      wealth_strength_score: weighted,
      best_wealth_paths: clusters.slice(0, 6).map(cluster => cluster.label),
      top_wealth_sources: clusters.slice(0, 6),
      wealth_categories: wealthCategories,
      wealth_category_scores: categoryScores,
      wealth_domain_scores: wealthDomainScores,
      wealth_potential: {
        savings: clusters.some(cluster => /savings|banking|accumulation/i.test(cluster.label)),
        business: clusters.some(cluster => /business|entrepreneur/i.test(cluster.label)),
        investments: clusters.some(cluster => /stock market|trading|crypto/i.test(cluster.label)),
        inheritance: clusters.some(cluster => /inheritance|family assets/i.test(cluster.label)),
        property: clusters.some(cluster => /real estate|property/i.test(cluster.label)),
        foreign: clusters.some(cluster => /foreign|mnc|import-export/i.test(cluster.label)),
        authority: clusters.some(cluster => /government|authority|treasury/i.test(cluster.label)),
        creative: clusters.some(cluster => /creative|media|brand/i.test(cluster.label)),
        corporate: clusters.some(cluster => /corporate/i.test(cluster.label)),
        specialized: clusters.some(cluster => /specialized/i.test(cluster.label)),
        research: clusters.some(cluster => /research/i.test(cluster.label)),
        rare: clusters.some(cluster => /high-value wealth/i.test(cluster.label))
      },
      wealth_support_from_career: wealthSupportFromCareer,
      d1_promise: d1Promise,
      d2_liquidity: d2Liquidity,
      d10_income: d10Income,
      d11_gains: d11Gains,
      dasha_timing: dashaTiming,
      transit_activation: transitActivation,
      divisional_validation: {
        d1: d1Promise,
        d2: d2Liquidity,
        d9: charts.d9 ? Math.min(100, Math.round(chartPlanetSupport(charts.d9))) : 0,
        d10: d10Income,
        d11: d11Gains,
        d24: charts.d24 ? Math.min(100, Math.round((houseStrengthScore(charts.d24, 5) + houseStrengthScore(charts.d24, 9)) / 2)) : 0,
        d60: charts.d60 ? Math.min(100, Math.round((houseStrengthScore(charts.d60, 2) + houseStrengthScore(charts.d60, 11)) / 2)) : 0
      },
      component_scores: {
        d1: d1Promise,
        d2: d2Liquidity,
        d10: d10Income,
        d11: d11Gains,
        dasha: dashaTiming,
        transit: transitActivation
      },
      formula: 'Total Wealth Potential = (D1 Wealth Promise * 0.35) + (D2 Liquid Wealth * 0.30) + (D10 Career Income * 0.15) + (Dasha Timing * 0.10) + (Transit Activation * 0.10)',
      data_quality: {
        d1_present: Boolean(charts.d1),
        d9_present: Boolean(charts.d9),
        d10_present: Boolean(charts.d10),
        d11_present: Boolean(charts.d11),
        d2_present: Boolean(charts.d2),
        d24_present: Boolean(charts.d24),
        d60_present: Boolean(charts.d60),
        ruled_count: detected.length
      },
      clusters,
      notes: buildNotes({ d1Promise, d2Liquidity, d10Income, d11Gains, dashaTiming, transitActivation })
    };
  }

  function renderWealthReport(result, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!result) {
      target.innerHTML = '<div class="card tiny muted">Wealth engine has no result to render.</div>';
      return;
    }

    if (result.error) {
      target.innerHTML = `<div class="card tiny muted">${escapeHtml(result.error)}</div>`;
      return;
    }

    const categoryPairs = Object.entries(result.wealth_domain_scores || {}).sort((a, b) => b[1] - a[1]);
    const topPaths = Array.isArray(result.best_wealth_paths) ? result.best_wealth_paths : [];
    const detected = Array.isArray(result.detected_dhan_yogas) ? result.detected_dhan_yogas : [];
    const details = Array.isArray(result.wealth_yoga_details) ? result.wealth_yoga_details : [];
    const notes = Array.isArray(result.notes) ? result.notes : [];

    target.innerHTML = `
      <div style="display:grid; gap:14px;">
        <div class="card tiny">
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;">
            <div>
              <div class="tiny muted">Wealth Strength</div>
              <div style="font-size:28px; font-weight:800; letter-spacing:-0.03em;">${Math.max(0, Math.min(100, Math.round(result.wealth_strength_score || 0)))}</div>
            </div>
            <div class="tiny muted" style="text-align:right;">
              D1 ${Math.round(result.d1_promise || 0)} | D2 ${Math.round(result.d2_liquidity || 0)} | D10 ${Math.round(result.d10_income || 0)} | D11 ${Math.round(result.d11_gains || 0)}
            </div>
          </div>
          <div class="tiny muted">${escapeHtml(result.formula || 'Weighted wealth formula active.')}</div>
          <div class="tiny muted" style="margin-top:8px;">Dhan yogas detected: ${detected.length}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Best Wealth Sources</div>
          <div>${topPaths.length ? topPaths.map(path => `<span class="tag info" style="margin-right:6px; margin-bottom:6px; display:inline-block;">${escapeHtml(path)}</span>`).join('') : '<span class="tiny muted">No dominant wealth path detected yet.</span>'}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Divisional Validation</div>
          <div class="tiny">D1 ${Math.round(result.divisional_validation?.d1 || 0)} | D2 ${Math.round(result.divisional_validation?.d2 || 0)} | D9 ${Math.round(result.divisional_validation?.d9 || 0)} | D10 ${Math.round(result.divisional_validation?.d10 || 0)} | D11 ${Math.round(result.divisional_validation?.d11 || 0)}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Wealth Categories</div>
          <div class="tiny">${categoryPairs.length ? categoryPairs.map(([name, value]) => `${escapeHtml(name)} ${value}`).join(' | ') : 'No category hits yet.'}</div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Top Dhan Yogas</div>
          <div style="display:grid; gap:8px;">
            ${details.slice(0, 12).map(item => `
              <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                <div>
                  <div style="font-weight:700;">${escapeHtml(item.label)}</div>
                  <div class="tiny muted">${escapeHtml(item.category)}</div>
                </div>
                <div class="tiny muted">${Math.round(item.score || 0)}</div>
              </div>
            `).join('')}
            ${details.length > 12 ? `<div class="tiny muted">+${details.length - 12} more</div>` : ''}
          </div>
        </div>

        <div class="card tiny">
          <div class="tiny muted" style="margin-bottom:6px;">Notes</div>
          <div class="tiny">${notes.map(note => `<div style="margin-bottom:6px;">${escapeHtml(note)}</div>`).join('')}</div>
        </div>
      </div>
    `;
  }

  function evaluateFromState() {
    const state = getAppState();
    return analyzeWealthCharts({
      d1: state?.d1 || null,
      d9: state?.d9 || null,
      d10: state?.d10 || null,
      d11: state?.d11 || null,
      d2: state?.d2 || null,
      d24: state?.d24 || null,
      d60: state?.d60 || null
    });
  }

  function runAndRender(targetId) {
    const result = evaluateFromState();
    renderWealthReport(result, targetId || 'wealthOutput');
    return result;
  }

  root.WealthEngine = {
    evaluate: analyzeWealthCharts,
    evaluateFromState,
    render: renderWealthReport,
    runAndRender,
    normalizeChart,
    houseStrengthScore,
    planetStrengthScore,
    hasConnection,
    isHouseStrong,
    isPlanetStrong,
    evaluateD2WealthStrength,
    evaluateD10IncomeStrength,
    evaluateD11GainsStrength,
    classifyWealthSources,
    classifyWealthDomains,
    isDhanaSupport
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
