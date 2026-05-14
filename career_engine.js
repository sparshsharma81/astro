// Professional career yoga detection engine
// Supports normalized D1, D9, D10 and optional D2, D24, D60 validation.
(function (root) {
  'use strict';

  const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const MALEFICS = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];
  const KENDRAS = [1, 4, 7, 10];
  const TRIKONAS = [1, 5, 9];
  const UPACHAYAS = [3, 6, 10, 11];
  const DHANA_HOUSES = [2, 11];
  const CAREER_HOUSES = {
    1: 'Self / ambition',
    2: 'Income / speech / family business',
    5: 'Intelligence / strategy',
    6: 'Service / competition / employment',
    7: 'Business / public dealings',
    9: 'Fortune / ethics / higher authority',
    10: 'Profession / karma',
    11: 'Gains / network'
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

  const HOUSE_MEANINGS = {
    1: 'Self, direction, initiative',
    2: 'Income, speech, family assets',
    3: 'Skills, communication, effort',
    4: 'Education, property, stability',
    5: 'Intelligence, creativity, strategy',
    6: 'Service, conflict, competition',
    7: 'Business, contracts, public dealings',
    8: 'Research, risk, transformation',
    9: 'Fortune, ethics, higher guidance',
    10: 'Profession, status, karma',
    11: 'Gains, networks, promotion',
    12: 'Foreign links, expense, retreat'
  };

  const PANCHA_MAHAPURUSHA = [
    { id: 'Ruchaka', planet: 'Mars', signs: ['Aries', 'Scorpio'] },
    { id: 'Bhadra', planet: 'Mercury', signs: ['Gemini', 'Virgo'] },
    { id: 'Hamsa', planet: 'Jupiter', signs: ['Sagittarius', 'Pisces'] },
    { id: 'Malavya', planet: 'Venus', signs: ['Taurus', 'Libra'] },
    { id: 'Shasha', planet: 'Saturn', signs: ['Capricorn', 'Aquarius'] }
  ];

  function getAppState() {
    return root.state || root.__ASTRO_STATE__ || null;
  }

  function asNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function asText(value) {
    return value == null ? '' : String(value).trim();
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

  function isTruthy(value) {
    if (value === true) return true;
    if (value === false || value == null) return false;
    if (typeof value === 'number') return value !== 0;
    const normalized = asText(value).toLowerCase();
    return ['true', 'yes', 'y', '1', 'exalted', 'strong', 'present', 'combust', 'retrograde'].includes(normalized);
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
    const aspects = normalizeAspectList(payload.aspects || payload.aspecting || payload.drishti || payload.drstis || payload.aspected_by);
    const conjunctions = normalizeAspectList(payload.conjunctions || payload.conjunction || payload.companions || payload.with);
    const nakshatra = asText(payload.nakshatra_name || payload.nakshatra || payload.star || payload.asterism) || null;
    const houseName = CAREER_HOUSES[house] || null;
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
      raw: payload,
      houseName
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
        const house = index + 1;
        houseSigns[house] = normalizeSign(value);
      });
    }

    const filteredPlanets = Array.isArray(planets) ? planets : [];
    filteredPlanets.forEach(planet => {
      if (!planet.house || !planet.sign) return;
      if (!houseSigns[planet.house]) {
        houseSigns[planet.house] = planet.sign;
      }
    });

    return houseSigns;
  }

  function buildHouseMap(source, planets) {
    const chart = unwrapChartSource(source);
    const houseSigns = extractHouseSigns(source, planets);
    const houses = {};

    for (let house = 1; house <= 12; house += 1) {
      houses[house] = {
        house,
        sign: houseSigns[house] || null,
        lord: houseSigns[house] ? SIGN_LORDS[houseSigns[house]] || null : null,
        occupants: [],
        notes: []
      };
    }

    planets.forEach(planet => {
      if (planet.house && houses[planet.house]) {
        houses[planet.house].occupants.push(planet.name);
      }
    });

    if (chart.house_details && typeof chart.house_details === 'object') {
      Object.entries(chart.house_details).forEach(([key, value]) => {
        const house = asNumber(key, null);
        if (!house || !houses[house]) return;
        if (value && typeof value === 'object') {
          houses[house].sign = houses[house].sign || normalizeSign(value.sign || value.zodiac_sign || value.rasi || value.name);
          houses[house].lord = houses[house].lord || value.lord || value.house_lord || null;
        }
      });
    }

    return houses;
  }

  function normalizeChart(source, fallbackType = 'D1') {
    const chartSource = unwrapChartSource(source);
    const planets = extractPlanets(chartSource);
    const houses = buildHouseMap(chartSource, planets);
    const houseSigns = {};
    Object.values(houses).forEach(entry => {
      if (entry.sign) houseSigns[entry.house] = entry.sign;
    });

    const lords = {};
    for (let house = 1; house <= 12; house += 1) {
      const sign = houseSigns[house];
      if (sign) {
        lords[house] = SIGN_LORDS[sign] || null;
      }
    }

    return {
      type: asText(chartSource.chart_type || chartSource.type || fallbackType).toUpperCase(),
      source: chartSource,
      planets,
      houses,
      houseSigns,
      lords,
      raw: chartSource
    };
  }

  function getPlanet(chart, name) {
    if (!chart || !name) return null;
    const normalized = normalizePlanetName(name);
    const planets = chart.planets || [];
    return planets.find(planet => normalizePlanetName(planet.name) === normalized) || null;
  }

  function getHouseOccupants(chart, house) {
    if (!chart || !chart.houses || !chart.houses[house]) return [];
    return chart.houses[house].occupants || [];
  }

  function getHouseSign(chart, house) {
    if (!chart) return null;
    return chart.houseSigns && chart.houseSigns[house] ? chart.houseSigns[house] : chart.houses?.[house]?.sign || null;
  }

  function getHouseLordPlanet(chart, house) {
    if (!chart) return null;
    const sign = getHouseSign(chart, house);
    const lordName = chart.lords?.[house] || (sign ? SIGN_LORDS[sign] : null);
    return lordName ? getPlanet(chart, lordName) : null;
  }

  function houseStrengthScore(chart, house) {
    if (!chart) return 0;
    const occupants = getHouseOccupants(chart, house);
    const occupantScore = Math.min(occupants.length * 12, 36);
    const lord = getHouseLordPlanet(chart, house);
    const lordScore = lord ? (planetStrengthScore(lord, chart) >= 60 ? 28 : 12) : 6;
    const beneficSupport = chart.planets.filter(planet => planet.house === house && BENEFICS.includes(planet.name)).length * 10;
    const maleficPenalty = chart.planets.filter(planet => planet.house === house && ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(planet.name)).length * 8;
    const aspectSupport = chart.planets.filter(planet => Array.isArray(planet.aspects) && planet.aspects.some(target => String(target).includes(String(house)))).length * 4;
    const base = occupantScore + lordScore + beneficSupport + aspectSupport - maleficPenalty;
    const d10Boost = chart.type === 'D10' && house === 10 ? 14 : 0;
    return Math.max(0, Math.min(100, base + d10Boost));
  }

  function isHouseStrong(chart, house) {
    return houseStrengthScore(chart, house) >= 40;
  }

  function planetStrengthScore(planet, chart) {
    if (!planet) return 0;
    let score = 0;
    if (planet.exalted) score += 24;
    if (planet.ownSign) score += 20;
    if (planet.mooltrikona) score += 14;
    if (planet.vargottama) score += 12;
    if (planet.retrograde) score += 4;
    if (planet.combust) score -= 20;
    if (planet.debilitated) score -= 18;

    const sign = planet.sign;
    if (sign) {
      if (SIGN_LORDS[sign] === planet.name) score += 8;
      if (SIGN_GROUPS.FIRE.includes(sign) && ['Sun', 'Mars', 'Jupiter'].includes(planet.name)) score += 5;
      if (SIGN_GROUPS.EARTH.includes(sign) && ['Mercury', 'Venus', 'Saturn'].includes(planet.name)) score += 5;
      if (SIGN_GROUPS.AIR.includes(sign) && ['Mercury', 'Saturn', 'Rahu'].includes(planet.name)) score += 5;
      if (SIGN_GROUPS.WATER.includes(sign) && ['Moon', 'Jupiter', 'Venus'].includes(planet.name)) score += 5;
    }

    if (planet.house && KENDRAS.includes(planet.house) && ['Jupiter', 'Venus', 'Mercury', 'Moon', 'Sun', 'Saturn'].includes(planet.name)) score += 5;
    if (planet.house && UPACHAYAS.includes(planet.house) && ['Mars', 'Saturn', 'Mercury', 'Rahu'].includes(planet.name)) score += 8;
    if (chart?.type === 'D10' && planet.name === 'Mercury') score += 10;
    if (chart?.type === 'D10' && planet.name === 'Saturn') score += 6;

    return Math.max(0, Math.min(100, score));
  }

  function isPlanetStrong(planet, chart) {
    return planetStrengthScore(planet, chart) >= 45;
  }

  function sameSignOrHouse(a, b) {
    return Boolean(a && b && ((a.house && b.house && a.house === b.house) || (a.sign && b.sign && a.sign === b.sign)));
  }

  function aspectMatch(source, target) {
    if (!source || !target) return false;
    const targetName = normalizePlanetName(target.name);
    const targetHouse = target.house ? String(target.house) : '';
    const aspects = [].concat(source.aspects || [], source.conjunctions || []);
    return aspects.some(item => {
      const text = String(item).toLowerCase();
      return text.includes(targetName.toLowerCase()) || (targetHouse && text.includes(targetHouse));
    });
  }

  function hasConnection(entity1, entity2, chart) {
    if (!entity1 || !entity2) return false;
    const a = typeof entity1 === 'string' ? getPlanet(chart, entity1) : entity1;
    const b = typeof entity2 === 'string' ? getPlanet(chart, entity2) : entity2;
    if (!a || !b) return false;

    if (sameSignOrHouse(a, b)) return true;
    if (a.sign && b.sign && a.sign === b.sign) return true;
    if (Math.abs(asNumber(a.degree, 999) - asNumber(b.degree, -999)) <= 8 && a.sign && a.sign === b.sign) return true;
    if (aspectMatch(a, b) || aspectMatch(b, a)) return true;

    const aLord = a.sign ? SIGN_LORDS[a.sign] : null;
    const bLord = b.sign ? SIGN_LORDS[b.sign] : null;
    if (a.dispositor && normalizePlanetName(a.dispositor) === b.name) return true;
    if (b.dispositor && normalizePlanetName(b.dispositor) === a.name) return true;
    if (aLord === b.name || bLord === a.name) return true;
    if (a.sign && b.sign && SIGN_LORDS[a.sign] === b.name && SIGN_LORDS[b.sign] === a.name) return true;

    return false;
  }

  function isRajyoga(lord1, lord2, chart) {
    const a = typeof lord1 === 'string' ? getPlanet(chart, lord1) : lord1;
    const b = typeof lord2 === 'string' ? getPlanet(chart, lord2) : lord2;
    if (!a || !b) return false;
    const aIsKendra = a.house && KENDRAS.includes(a.house);
    const bIsKendra = b.house && KENDRAS.includes(b.house);
    const aIsTrikona = a.house && TRIKONAS.includes(a.house);
    const bIsTrikona = b.house && TRIKONAS.includes(b.house);
    return ((aIsKendra && bIsTrikona) || (bIsKendra && aIsTrikona)) && hasConnection(a, b, chart);
  }

  function isDhanaSupport(chart) {
    const lord2 = getHouseLordPlanet(chart, 2);
    const lord11 = getHouseLordPlanet(chart, 11);
    if (!lord2 || !lord11) return false;
    return hasConnection(lord2, lord11, chart);
  }

  function hasBeneficSupport(chart, house) {
    return chart.planets.some(planet => planet.house === house && BENEFICS.includes(planet.name));
  }

  function hasMaleficPressure(chart, house) {
    return chart.planets.some(planet => planet.house === house && MALEFICS.includes(planet.name));
  }

  function evaluateD1Promise(chart, support) {
    let score = 0;
    score += Math.min(houseStrengthScore(chart, 10) * 0.22, 22);
    score += Math.min(houseStrengthScore(chart, 6) * 0.14, 14);
    score += Math.min(houseStrengthScore(chart, 11) * 0.14, 14);
    score += Math.min(houseStrengthScore(chart, 2) * 0.10, 10);
    score += Math.min(houseStrengthScore(chart, 7) * 0.10, 10);

    const careerPlanets = ['Sun', 'Saturn', 'Mercury', 'Jupiter', 'Mars', 'Venus', 'Rahu']
      .map(name => getPlanet(chart, name))
      .filter(Boolean);

    careerPlanets.forEach(planet => {
      const strength = planetStrengthScore(planet, chart);
      if (strength >= 60) score += 4;
      else if (strength >= 45) score += 2;
    });

    if (support.yogas.some(yoga => yoga.category === 'Raj Yoga')) score += 10;
    if (support.yogas.some(yoga => yoga.category === 'Government')) score += 5;
    if (isDhanaSupport(chart)) score += 8;
    if (hasBeneficSupport(chart, 10)) score += 4;
    if (hasMaleficPressure(chart, 10)) score -= 6;
    if (chart.type === 'D1' && chart.planets.some(planet => planet.name === 'Sun' && planet.house === 10)) score += 6;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function evaluateD10Execution(chart, support) {
    if (!chart) return 0;
    let score = 0;
    score += Math.min(houseStrengthScore(chart, 10) * 0.30, 30);
    score += Math.min(houseStrengthScore(chart, 6) * 0.08, 8);
    score += Math.min(houseStrengthScore(chart, 11) * 0.08, 8);

    const d10Lord10 = getHouseLordPlanet(chart, 10);
    if (d10Lord10) {
      const strength = planetStrengthScore(d10Lord10, chart);
      if (strength >= 60) score += 18;
      else if (strength >= 45) score += 10;
    }

    ['Sun', 'Saturn', 'Mercury', 'Jupiter', 'Mars', 'Venus', 'Rahu'].forEach(name => {
      const planet = getPlanet(chart, name);
      if (!planet || !d10Lord10) return;
      if (hasConnection(d10Lord10, planet, chart)) score += 5;
    });

    if (support.yogas.some(yoga => yoga.category === 'D10 Validation')) score += 10;
    if (chart.planets.some(planet => planet.name === 'Mercury' && planet.house === 10)) score += 5;
    if (chart.planets.some(planet => planet.name === 'Saturn' && KENDRAS.includes(planet.house))) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function evaluateDivisionalSupport(charts) {
    const result = {
      d1: charts.d1 ? evaluateD1Promise(charts.d1, { yogas: [] }) : 0,
      d10: charts.d10 ? evaluateD10Execution(charts.d10, { yogas: [] }) : 0,
      d9: charts.d9 ? Math.min(100, Math.round((houseStrengthScore(charts.d9, 1) + houseStrengthScore(charts.d9, 10) + chartPlanetSupport(charts.d9)) / 3)) : 0,
      d2: charts.d2 ? Math.min(100, Math.round((houseStrengthScore(charts.d2, 2) + houseStrengthScore(charts.d2, 11)) / 2)) : 0,
      d24: charts.d24 ? Math.min(100, Math.round((houseStrengthScore(charts.d24, 5) + houseStrengthScore(charts.d24, 9)) / 2)) : 0,
      d60: charts.d60 ? Math.min(100, Math.round((houseStrengthScore(charts.d60, 6) + houseStrengthScore(charts.d60, 10)) / 2)) : 0
    };
    return result;
  }

  function chartPlanetSupport(chart) {
    if (!chart) return 0;
    let total = 0;
    ['Sun', 'Moon', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Mars'].forEach(name => {
      const planet = getPlanet(chart, name);
      if (!planet) return;
      total += planetStrengthScore(planet, chart) >= 45 ? 12 : 4;
    });
    return Math.min(100, total);
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

  function buildContext(charts) {
    const d1 = charts.d1 || null;
    const d9 = charts.d9 || null;
    const d10 = charts.d10 || null;
    const d2 = charts.d2 || null;
    const d24 = charts.d24 || null;
    const d60 = charts.d60 || null;

    const plan = {
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

    return {
      charts,
      d1,
      d9,
      d10,
      d2,
      d24,
      d60,
      planets: plan,
      lords: {
        1: d1 ? getHouseLordPlanet(d1, 1) : null,
        2: d1 ? getHouseLordPlanet(d1, 2) : null,
        4: d1 ? getHouseLordPlanet(d1, 4) : null,
        5: d1 ? getHouseLordPlanet(d1, 5) : null,
        6: d1 ? getHouseLordPlanet(d1, 6) : null,
        7: d1 ? getHouseLordPlanet(d1, 7) : null,
        9: d1 ? getHouseLordPlanet(d1, 9) : null,
        10: d1 ? getHouseLordPlanet(d1, 10) : null,
        11: d1 ? getHouseLordPlanet(d1, 11) : null,
        12: d1 ? getHouseLordPlanet(d1, 12) : null
      },
      support: {
        d9: d9 ? chartPlanetSupport(d9) : 0,
        d10: d10 ? chartPlanetSupport(d10) : 0,
        d2: d2 ? chartPlanetSupport(d2) : 0,
        d24: d24 ? chartPlanetSupport(d24) : 0,
        d60: d60 ? chartPlanetSupport(d60) : 0
      }
    };
  }

  function createRuleSet(context) {
    const { d1, d9, d10, d2, d24, d60, planets, lords } = context;

    return [
      { id: 'foundation_10', category: 'Foundational', label: 'Strong 10th House Foundation', score: 8, when: () => isHouseStrong(d1, 10), evidence: () => [houseSummary(d1, 10)] },
      { id: 'foundation_6', category: 'Foundational', label: 'Strong 6th House Service Capacity', score: 6, when: () => isHouseStrong(d1, 6), evidence: () => [houseSummary(d1, 6)] },
      { id: 'foundation_2_11', category: 'Foundational', label: '2nd-11th Wealth Support', score: 7, when: () => isHouseStrong(d1, 2) && isHouseStrong(d1, 11), evidence: () => [houseSummary(d1, 2), houseSummary(d1, 11)] },
      { id: 'foundation_7', category: 'Foundational', label: 'Strong 7th House Business/Public Dealings', score: 6, when: () => isHouseStrong(d1, 7), evidence: () => [houseSummary(d1, 7)] },
      { id: 'foundation_1_5_9', category: 'Foundational', label: 'Self-Strategy-Fortune Triad', score: 8, when: () => isHouseStrong(d1, 1) && isHouseStrong(d1, 5) && isHouseStrong(d1, 9), evidence: () => [houseSummary(d1, 1), houseSummary(d1, 5), houseSummary(d1, 9)] },

      { id: 'raj_dharma_karma', category: 'Raj Yoga', label: 'Dharma-Karma Adhipati Yoga', score: 16, when: () => hasConnection(lords[9], lords[10], d1), evidence: () => ruleEvidence([lords[9], lords[10]]) },
      { id: 'raj_kendra_trikona', category: 'Raj Yoga', label: 'Kendra-Trikona Raja Yoga', score: 14, when: () => [1, 4, 7, 10].some(k => [1, 5, 9].some(t => isRajyoga(lords[k], lords[t], d1))), evidence: () => ruleEvidence([lords[1], lords[4], lords[7], lords[10], lords[5], lords[9]]) },
      { id: 'raj_amala', category: 'Raj Yoga', label: 'Amala Yoga', score: 10, when: () => [1, 10].some(base => BENEFICS.some(name => { const planet = planets[name]; return planet && planet.house === (base === 1 ? planet.house : 10); })), evidence: () => ruleEvidence(BENEFICS.map(name => planets[name])) },
      { id: 'raj_kahala', category: 'Raj Yoga', label: 'Kahala Yoga', score: 10, when: () => isHouseStrong(d1, 4) && isHouseStrong(d1, 9), evidence: () => [houseSummary(d1, 4), houseSummary(d1, 9)] },
      { id: 'raj_lakshmi', category: 'Raj Yoga', label: 'Lakshmi Yoga', score: 10, when: () => isPlanetStrong(lords[1], d1) && isPlanetStrong(lords[9], d1), evidence: () => ruleEvidence([lords[1], lords[9]]) },
      { id: 'raj_parvata', category: 'Raj Yoga', label: 'Parvata Yoga', score: 9, when: () => KENDRAS.every(house => isHouseStrong(d1, house)), evidence: () => KENDRAS.map(house => houseSummary(d1, house)) },
      { id: 'raj_vasumati', category: 'Raj Yoga', label: 'Vasumati Yoga', score: 9, when: () => UPACHAYAS.filter(house => hasBeneficSupport(d1, house)).length >= 2, evidence: () => UPACHAYAS.map(house => houseSummary(d1, house)) },
      { id: 'raj_gaja_kesari', category: 'Raj Yoga', label: 'Gaja Kesari Yoga', score: 12, when: () => hasConnection(planets.Moon, planets.Jupiter, d1) && isHouseStrong(d1, 1), evidence: () => ruleEvidence([planets.Moon, planets.Jupiter]) },
      ...PANCHA_MAHAPURUSHA.map(config => ({
        id: `mahapurusha_${config.id.toLowerCase()}`,
        category: 'Raj Yoga',
        label: `${config.id} Mahapurusha Yoga`,
        score: 12,
        when: () => {
          const planet = planets[config.planet];
          return Boolean(planet && config.signs.includes(planet.sign) && planet.house && KENDRAS.includes(planet.house) && isPlanetStrong(planet, d1));
        },
        evidence: () => ruleEvidence([planets[config.planet]])
      })),

      { id: 'gov_sun_10', category: 'Government', label: 'Sun in 10th or exalted', score: 10, when: () => Boolean(planets.Sun && (planets.Sun.house === 10 || planets.Sun.exalted)), evidence: () => ruleEvidence([planets.Sun]) },
      { id: 'gov_sun_saturn', category: 'Government', label: 'Sun-Saturn Authority Yoga', score: 10, when: () => hasConnection(planets.Sun, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Sun, planets.Saturn]) },
      { id: 'gov_sun_jupiter', category: 'Government', label: 'Sun-Jupiter Leadership Yoga', score: 9, when: () => hasConnection(planets.Sun, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Sun, planets.Jupiter]) },
      { id: 'gov_sun_mars', category: 'Government', label: 'Sun-Mars Command Yoga', score: 9, when: () => hasConnection(planets.Sun, planets.Mars, d1), evidence: () => ruleEvidence([planets.Sun, planets.Mars]) },
      { id: 'gov_10l_sun_jupiter', category: 'Government', label: '10th Lord with Sun/Jupiter', score: 10, when: () => hasConnection(lords[10], planets.Sun, d1) || hasConnection(lords[10], planets.Jupiter, d1), evidence: () => ruleEvidence([lords[10], planets.Sun, planets.Jupiter]) },
      { id: 'gov_saturn_own_10', category: 'Government', label: 'Saturn in own sign in 10th', score: 9, when: () => Boolean(planets.Saturn && planets.Saturn.house === 10 && planets.Saturn.ownSign), evidence: () => ruleEvidence([planets.Saturn]) },
      { id: 'gov_jupiter_10_aspect', category: 'Government', label: 'Jupiter support on 10th', score: 8, when: () => isHouseStrong(d1, 10) && hasConnection(planets.Jupiter, getHouseLordPlanet(d1, 10), d1), evidence: () => [houseSummary(d1, 10), ruleEvidence([planets.Jupiter]).join(', ')] },
      { id: 'gov_l6_l10_link', category: 'Government', label: '6th and 10th Lord Connection', score: 9, when: () => hasConnection(lords[6], lords[10], d1), evidence: () => ruleEvidence([lords[6], lords[10]]) },
      { id: 'gov_rahu_10_benefic', category: 'Government', label: 'Rahu in 10th with benefic support', score: 8, when: () => Boolean(planets.Rahu && planets.Rahu.house === 10 && BENEFICS.some(name => hasConnection(planets.Rahu, planets[name], d1))), evidence: () => ruleEvidence([planets.Rahu, planets.Mercury, planets.Jupiter, planets.Venus, planets.Moon]) },

      { id: 'biz_2_7_11', category: 'Business', label: '2nd-7th-11th Business Support', score: 10, when: () => isHouseStrong(d1, 2) && isHouseStrong(d1, 7) && isHouseStrong(d1, 11), evidence: () => [houseSummary(d1, 2), houseSummary(d1, 7), houseSummary(d1, 11)] },
      { id: 'biz_mercury_venus', category: 'Business', label: 'Mercury-Venus Commerce Yoga', score: 9, when: () => hasConnection(planets.Mercury, planets.Venus, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Venus]) },
      { id: 'biz_mercury_mars', category: 'Business', label: 'Mercury-Mars Trade/Execution Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Mars, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Mars]) },
      { id: 'biz_rahu_7_10', category: 'Business', label: 'Rahu in 7th/10th Entrepreneurial Drive', score: 8, when: () => Boolean(planets.Rahu && [7, 10].includes(planets.Rahu.house)), evidence: () => ruleEvidence([planets.Rahu]) },
      { id: 'biz_10l_7', category: 'Business', label: '10th Lord in 7th', score: 9, when: () => Boolean(lords[10] && lords[10].house === 7), evidence: () => ruleEvidence([lords[10]]) },
      { id: 'biz_lagna_lord_7', category: 'Business', label: 'Lagna Lord in 7th', score: 8, when: () => Boolean(lords[1] && lords[1].house === 7), evidence: () => ruleEvidence([lords[1]]) },
      { id: 'biz_moon_mercury', category: 'Business', label: 'Moon-Mercury Client Handling Yoga', score: 7, when: () => hasConnection(planets.Moon, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Moon, planets.Mercury]) },
      { id: 'biz_2_11_exchange', category: 'Business', label: '2nd-11th Exchange / Dhana Flow', score: 9, when: () => isDhanaSupport(d1), evidence: () => [houseSummary(d1, 2), houseSummary(d1, 11)] },

      { id: 'tech_mars_saturn', category: 'Technical', label: 'Mars-Saturn Engineering Yoga', score: 10, when: () => hasConnection(planets.Mars, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Mars, planets.Saturn]) },
      { id: 'tech_mars_mercury', category: 'Technical', label: 'Mars-Mercury Technical Yoga', score: 9, when: () => hasConnection(planets.Mars, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Mars, planets.Mercury]) },
      { id: 'tech_rahu_mars', category: 'Technical', label: 'Rahu-Mars High-Tech Drive', score: 8, when: () => hasConnection(planets.Rahu, planets.Mars, d1), evidence: () => ruleEvidence([planets.Rahu, planets.Mars]) },
      { id: 'tech_upachaya_3_10', category: 'Technical', label: 'Strong 3rd and 10th Houses', score: 8, when: () => isHouseStrong(d1, 3) && isHouseStrong(d1, 10), evidence: () => [houseSummary(d1, 3), houseSummary(d1, 10)] },
      { id: 'tech_earth_mercury', category: 'Technical', label: 'Mercury in Earth Sign', score: 7, when: () => Boolean(planets.Mercury && SIGN_GROUPS.EARTH.includes(planets.Mercury.sign)), evidence: () => ruleEvidence([planets.Mercury]) },
      { id: 'tech_saturn_tech_houses', category: 'Technical', label: 'Saturn in Technical Houses', score: 7, when: () => Boolean(planets.Saturn && [3, 6, 10, 11].includes(planets.Saturn.house)), evidence: () => ruleEvidence([planets.Saturn]) },
      { id: 'it_mercury_rahu', category: 'IT', label: 'Mercury-Rahu Software / Analytics Yoga', score: 10, when: () => hasConnection(planets.Mercury, planets.Rahu, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Rahu]) },
      { id: 'it_ketu_mercury', category: 'IT', label: 'Ketu-Mercury Data / Programming Yoga', score: 8, when: () => hasConnection(planets.Ketu, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Ketu, planets.Mercury]) },
      { id: 'it_gemini_virgo', category: 'IT', label: 'Gemini / Virgo Dominance', score: 8, when: () => ['Gemini', 'Virgo'].includes(planets.Mercury?.sign) || ['Gemini', 'Virgo'].includes(planets.Rahu?.sign), evidence: () => ruleEvidence([planets.Mercury, planets.Rahu]) },
      { id: 'it_d10_mercury', category: 'IT', label: 'Strong Mercury in D10', score: 10, when: () => Boolean(d10 && isPlanetStrong(getPlanet(d10, 'Mercury'), d10)), evidence: () => ruleEvidence([d10 ? getPlanet(d10, 'Mercury') : null]) },

      { id: 'med_sun_mars', category: 'Medical', label: 'Sun-Mars Surgical Drive', score: 9, when: () => hasConnection(planets.Sun, planets.Mars, d1), evidence: () => ruleEvidence([planets.Sun, planets.Mars]) },
      { id: 'med_mars_ketu', category: 'Medical', label: 'Mars-Ketu Surgical Specialization', score: 9, when: () => hasConnection(planets.Mars, planets.Ketu, d1), evidence: () => ruleEvidence([planets.Mars, planets.Ketu]) },
      { id: 'med_6_8_10', category: 'Medical', label: '6th-8th-10th Medical Axis', score: 10, when: () => [6, 8, 10].filter(house => isHouseStrong(d1, house)).length >= 2, evidence: () => [houseSummary(d1, 6), houseSummary(d1, 8), houseSummary(d1, 10)] },
      { id: 'med_moon_mars', category: 'Medical', label: 'Moon-Mars Healing / Surgery Yoga', score: 8, when: () => hasConnection(planets.Moon, planets.Mars, d1), evidence: () => ruleEvidence([planets.Moon, planets.Mars]) },
      { id: 'med_virgo_scorpio', category: 'Medical', label: 'Virgo / Scorpio Prominence', score: 7, when: () => [planets.Mercury, planets.Mars, planets.Ketu].some(planet => planet && ['Virgo', 'Scorpio'].includes(planet.sign)), evidence: () => ruleEvidence([planets.Mercury, planets.Mars, planets.Ketu]) },

      { id: 'law_jupiter_saturn', category: 'Legal', label: 'Jupiter-Saturn Legal Discipline Yoga', score: 9, when: () => hasConnection(planets.Jupiter, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Jupiter, planets.Saturn]) },
      { id: 'law_sun_jupiter', category: 'Legal', label: 'Sun-Jupiter Administrative Law Yoga', score: 8, when: () => hasConnection(planets.Sun, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Sun, planets.Jupiter]) },
      { id: 'law_9_10', category: 'Legal', label: '9th-10th Axis Legal/Public Authority', score: 10, when: () => isHouseStrong(d1, 9) && isHouseStrong(d1, 10), evidence: () => [houseSummary(d1, 9), houseSummary(d1, 10)] },
      { id: 'law_mercury_jupiter', category: 'Legal', label: 'Mercury-Jupiter Advocacy Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Jupiter]) },
      { id: 'law_venus_saturn', category: 'Legal', label: 'Venus-Saturn Balanced Judgment', score: 7, when: () => hasConnection(planets.Venus, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Venus, planets.Saturn]) },

      { id: 'creative_venus_mercury', category: 'Creative', label: 'Venus-Mercury Media Yoga', score: 9, when: () => hasConnection(planets.Venus, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Venus, planets.Mercury]) },
      { id: 'creative_moon_venus', category: 'Creative', label: 'Moon-Venus Artistic Sensibility', score: 8, when: () => hasConnection(planets.Moon, planets.Venus, d1), evidence: () => ruleEvidence([planets.Moon, planets.Venus]) },
      { id: 'creative_rahu_venus', category: 'Creative', label: 'Rahu-Venus Mass Media / Glamour', score: 8, when: () => hasConnection(planets.Rahu, planets.Venus, d1), evidence: () => ruleEvidence([planets.Rahu, planets.Venus]) },
      { id: 'creative_5_10', category: 'Creative', label: '5th-10th Creative Profession Axis', score: 8, when: () => isHouseStrong(d1, 5) && isHouseStrong(d1, 10), evidence: () => [houseSummary(d1, 5), houseSummary(d1, 10)] },
      { id: 'creative_d10_venus', category: 'Creative', label: 'Strong Venus in D10', score: 8, when: () => Boolean(d10 && isPlanetStrong(getPlanet(d10, 'Venus'), d10)), evidence: () => ruleEvidence([d10 ? getPlanet(d10, 'Venus') : null]) },

      { id: 'finance_2_11_lords', category: 'Finance', label: '2nd and 11th Lords Link', score: 10, when: () => hasConnection(lords[2], lords[11], d1), evidence: () => ruleEvidence([lords[2], lords[11]]) },
      { id: 'finance_jupiter_mercury', category: 'Finance', label: 'Jupiter-Mercury Finance Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Jupiter, planets.Mercury]) },
      { id: 'finance_venus_jupiter', category: 'Finance', label: 'Venus-Jupiter Wealth / Comfort Yoga', score: 8, when: () => hasConnection(planets.Venus, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Venus, planets.Jupiter]) },
      { id: 'finance_mercury_2', category: 'Finance', label: 'Mercury in 2nd House', score: 7, when: () => Boolean(planets.Mercury && planets.Mercury.house === 2), evidence: () => ruleEvidence([planets.Mercury]) },
      { id: 'finance_rahu_11', category: 'Finance', label: 'Rahu in 11th Gains Expansion', score: 8, when: () => Boolean(planets.Rahu && planets.Rahu.house === 11), evidence: () => ruleEvidence([planets.Rahu]) },
      { id: 'finance_saturn_mercury', category: 'Finance', label: 'Saturn-Mercury Structured Finance', score: 8, when: () => hasConnection(planets.Saturn, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Saturn, planets.Mercury]) },
      { id: 'finance_d2_d10', category: 'Finance', label: 'D2 and D10 Wealth Confirmation', score: 10, when: () => Boolean(d2 && d10 && evaluateD10Execution(d10, { yogas: [] }) >= 60), evidence: () => [houseSummary(d2, 2), houseSummary(d2, 11), houseSummary(d10, 10)] },

      { id: 'spiritual_jupiter_ketu', category: 'Spiritual', label: 'Jupiter-Ketu Advisory Yoga', score: 9, when: () => hasConnection(planets.Jupiter, planets.Ketu, d1), evidence: () => ruleEvidence([planets.Jupiter, planets.Ketu]) },
      { id: 'spiritual_9_12', category: 'Spiritual', label: '9th-12th Moksha Axis', score: 8, when: () => isHouseStrong(d1, 9) || isHouseStrong(d1, 12), evidence: () => [houseSummary(d1, 9), houseSummary(d1, 12)] },
      { id: 'spiritual_moon_jupiter', category: 'Spiritual', label: 'Moon-Jupiter Guidance Yoga', score: 7, when: () => hasConnection(planets.Moon, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Moon, planets.Jupiter]) },
      { id: 'spiritual_sun_ketu', category: 'Spiritual', label: 'Sun-Ketu Detachment / Teaching Yoga', score: 8, when: () => hasConnection(planets.Sun, planets.Ketu, d1), evidence: () => ruleEvidence([planets.Sun, planets.Ketu]) },
      { id: 'spiritual_ketu_10', category: 'Spiritual', label: 'Ketu in 10th', score: 7, when: () => Boolean(planets.Ketu && planets.Ketu.house === 10), evidence: () => ruleEvidence([planets.Ketu]) },

      { id: 'gov_ias_upsc', category: 'Government', label: 'IAS / UPSC Executive Yoga', score: 12, when: () => hasConnection(planets.Sun, planets.Saturn, d1) && hasConnection(planets.Jupiter, planets.Saturn, d1) && isHouseStrong(d1, 10), evidence: () => ruleEvidence([planets.Sun, planets.Saturn, planets.Jupiter]) },
      { id: 'gov_politics', category: 'Government', label: 'Political Leadership Yoga', score: 10, when: () => hasConnection(planets.Sun, planets.Mars, d1) && (isHouseStrong(d1, 9) || isHouseStrong(d1, 10) || isHouseStrong(d1, 11)), evidence: () => ruleEvidence([planets.Sun, planets.Mars]) },
      { id: 'gov_treasury', category: 'Government', label: 'Government Treasury / Finance Authority Yoga', score: 9, when: () => hasConnection(planets.Jupiter, lords[2], d1) && hasConnection(planets.Sun, lords[10], d1), evidence: () => ruleEvidence([planets.Jupiter, lords[2], planets.Sun, lords[10]]) },
      { id: 'gov_public_sector_exec', category: 'Government', label: 'Public Sector Executive Yoga', score: 8, when: () => Boolean(planets.Sun && [10, 11].includes(planets.Sun.house) && isPlanetStrong(planets.Sun, d1)), evidence: () => ruleEvidence([planets.Sun]) },
      { id: 'gov_police_defense', category: 'Government', label: 'Police / Defense Authority Yoga', score: 10, when: () => hasConnection(planets.Mars, planets.Saturn, d1) && isHouseStrong(d1, 6), evidence: () => ruleEvidence([planets.Mars, planets.Saturn]) },
      { id: 'gov_military_command', category: 'Government', label: 'Military Command Yoga', score: 10, when: () => Boolean(planets.Mars && planets.Mars.house === 10 && isPlanetStrong(planets.Mars, d1)), evidence: () => ruleEvidence([planets.Mars]) },

      { id: 'corp_mnc_exec', category: 'Corporate', label: 'MNC Executive Yoga', score: 8, when: () => Boolean(planets.Rahu && [10, 11, 12].includes(planets.Rahu.house) && hasConnection(planets.Rahu, lords[10], d1)), evidence: () => ruleEvidence([planets.Rahu, lords[10]]) },
      { id: 'corp_hr_management', category: 'Corporate', label: 'HR / Management Yoga', score: 7, when: () => hasConnection(planets.Venus, planets.Mercury, d1) && isHouseStrong(d1, 7), evidence: () => ruleEvidence([planets.Venus, planets.Mercury]) },
      { id: 'corp_operations', category: 'Corporate', label: 'Operations Leadership Yoga', score: 8, when: () => hasConnection(planets.Saturn, planets.Mars, d1) && isHouseStrong(d1, 10), evidence: () => ruleEvidence([planets.Saturn, planets.Mars]) },
      { id: 'corp_banking', category: 'Corporate', label: 'Banking Sector Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Venus, d1) && isHouseStrong(d1, 11), evidence: () => ruleEvidence([planets.Jupiter, planets.Venus]) },
      { id: 'corp_finance', category: 'Corporate', label: 'Finance Corporate Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Mercury, d1) && isHouseStrong(d1, 2), evidence: () => ruleEvidence([planets.Jupiter, planets.Mercury]) },

      { id: 'biz_family', category: 'Business', label: 'Family Business Yoga', score: 8, when: () => hasConnection(lords[2], lords[7], d1) || hasConnection(lords[2], lords[10], d1), evidence: () => ruleEvidence([lords[2], lords[7], lords[10]]) },
      { id: 'biz_trading', category: 'Business', label: 'Trading Business Yoga', score: 8, when: () => hasConnection(planets.Mercury, lords[11], d1) || hasConnection(planets.Rahu, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Mercury, lords[11], planets.Rahu]) },
      { id: 'biz_import_export', category: 'Business', label: 'Import Export Yoga', score: 8, when: () => hasConnection(lords[7], lords[12], d1) || (planets.Rahu && planets.Rahu.house === 12 && hasConnection(planets.Rahu, lords[10], d1)), evidence: () => ruleEvidence([lords[7], lords[12], planets.Rahu]) },
      { id: 'biz_real_estate', category: 'Business', label: 'Real Estate Business Yoga', score: 8, when: () => hasConnection(planets.Mars, planets.Venus, d1) && isHouseStrong(d1, 4), evidence: () => ruleEvidence([planets.Mars, planets.Venus]) },
      { id: 'biz_luxury_brand', category: 'Business', label: 'Luxury Brand Entrepreneurship Yoga', score: 8, when: () => Boolean(planets.Venus && planets.Venus.house === 10 && hasConnection(planets.Venus, planets.Mercury, d1)), evidence: () => ruleEvidence([planets.Venus, planets.Mercury]) },
      { id: 'biz_stock_market', category: 'Finance', label: 'Stock Market Business Yoga', score: 8, when: () => hasConnection(planets.Rahu, planets.Jupiter, d1) && isHouseStrong(d1, 5), evidence: () => ruleEvidence([planets.Rahu, planets.Jupiter]) },

      { id: 'tech_software_analytics', category: 'IT', label: 'AI / Data Science Yoga', score: 10, when: () => hasConnection(planets.Rahu, planets.Mercury, d1) && hasConnection(planets.Jupiter, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Rahu, planets.Mercury, planets.Jupiter]) },
      { id: 'tech_cybersecurity', category: 'IT', label: 'Cybersecurity Yoga', score: 8, when: () => hasConnection(planets.Mars, planets.Rahu, d1) && isHouseStrong(d1, 8), evidence: () => ruleEvidence([planets.Mars, planets.Rahu]) },
      { id: 'tech_electronics', category: 'Technical', label: 'Electronics Engineering Yoga', score: 8, when: () => hasConnection(planets.Mars, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Mars, planets.Mercury]) },
      { id: 'tech_product_management', category: 'IT', label: 'Product Management Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Saturn, d1) && isHouseStrong(d1, 10), evidence: () => ruleEvidence([planets.Mercury, planets.Saturn]) },
      { id: 'tech_digital_transformation', category: 'IT', label: 'Digital Transformation Yoga', score: 8, when: () => hasConnection(planets.Rahu, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Rahu, planets.Saturn]) },

      { id: 'med_pharma', category: 'Medical', label: 'Pharmaceutical Career Yoga', score: 7, when: () => hasConnection(planets.Mercury, planets.Moon, d1) && isHouseStrong(d1, 8), evidence: () => ruleEvidence([planets.Mercury, planets.Moon]) },
      { id: 'med_psychology', category: 'Medical', label: 'Psychology Career Yoga', score: 7, when: () => hasConnection(planets.Moon, planets.Ketu, d1), evidence: () => ruleEvidence([planets.Moon, planets.Ketu]) },
      { id: 'med_alternative_healing', category: 'Medical', label: 'Alternative Healing Yoga', score: 7, when: () => hasConnection(planets.Ketu, planets.Jupiter, d1), evidence: () => ruleEvidence([planets.Ketu, planets.Jupiter]) },

      { id: 'law_professor', category: 'Legal', label: 'Professor / Teacher Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Mercury, d1) && (isHouseStrong(d1, 5) || isHouseStrong(d1, 9)), evidence: () => ruleEvidence([planets.Jupiter, planets.Mercury]) },
      { id: 'law_academic_research', category: 'Legal', label: 'Academic Research Yoga', score: 8, when: () => hasConnection(planets.Jupiter, lords[5], d1) && isHouseStrong(d1, 9), evidence: () => ruleEvidence([planets.Jupiter, lords[5]]) },
      { id: 'law_chartered_accountant', category: 'Finance', label: 'Chartered Accountant Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Jupiter, d1) && isHouseStrong(d1, 2), evidence: () => ruleEvidence([planets.Mercury, planets.Jupiter]) },

      { id: 'creative_film', category: 'Creative', label: 'Film Industry Yoga', score: 8, when: () => Boolean(planets.Venus && planets.Venus.house === 10 && planets.Moon && [3, 5, 10].includes(planets.Moon.house)), evidence: () => ruleEvidence([planets.Venus, planets.Moon]) },
      { id: 'creative_influencer', category: 'Creative', label: 'Influencer / Digital Media Yoga', score: 8, when: () => hasConnection(planets.Rahu, planets.Venus, d1) && isHouseStrong(d1, 3), evidence: () => ruleEvidence([planets.Rahu, planets.Venus]) },
      { id: 'creative_content_creator', category: 'Creative', label: 'Content Creator Yoga', score: 7, when: () => hasConnection(planets.Mercury, planets.Moon, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Moon]) },
      { id: 'creative_music', category: 'Creative', label: 'Music Career Yoga', score: 7, when: () => hasConnection(planets.Venus, planets.Moon, d1), evidence: () => ruleEvidence([planets.Venus, planets.Moon]) },
      { id: 'creative_design', category: 'Creative', label: 'Design Career Yoga', score: 7, when: () => hasConnection(planets.Venus, planets.Mercury, d1) && isHouseStrong(d1, 5), evidence: () => ruleEvidence([planets.Venus, planets.Mercury]) },

      { id: 'foreign_diplomatic', category: 'Foreign', label: 'Diplomatic Career Yoga', score: 8, when: () => hasConnection(planets.Sun, planets.Venus, d1) && isHouseStrong(d1, 9), evidence: () => ruleEvidence([planets.Sun, planets.Venus]) },
      { id: 'foreign_aviation', category: 'Foreign', label: 'Aviation Career Yoga', score: 8, when: () => hasConnection(planets.Rahu, planets.Mars, d1) && isHouseStrong(d1, 9), evidence: () => ruleEvidence([planets.Rahu, planets.Mars]) },
      { id: 'foreign_maritime', category: 'Foreign', label: 'Maritime Career Yoga', score: 8, when: () => hasConnection(planets.Moon, planets.Rahu, d1) && isHouseStrong(d1, 12), evidence: () => ruleEvidence([planets.Moon, planets.Rahu]) },
      { id: 'foreign_mnc_import_export', category: 'Foreign', label: 'MNC / Import Export Yoga', score: 8, when: () => hasConnection(lords[9], lords[12], d1) && hasConnection(lords[10], lords[12], d1), evidence: () => ruleEvidence([lords[9], lords[12], lords[10]]) },

      { id: 'independent_consultant', category: 'Independent', label: 'Consultant Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Jupiter, d1) && isHouseStrong(d1, 1), evidence: () => ruleEvidence([planets.Mercury, planets.Jupiter]) },
      { id: 'independent_advisor', category: 'Independent', label: 'Advisor Strategy Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Sun, d1), evidence: () => ruleEvidence([planets.Jupiter, planets.Sun]) },
      { id: 'independent_ngo', category: 'Independent', label: 'NGO / Social Leadership Yoga', score: 8, when: () => hasConnection(planets.Jupiter, planets.Moon, d1) && isHouseStrong(d1, 11), evidence: () => ruleEvidence([planets.Jupiter, planets.Moon]) },

      { id: 'special_agriculture', category: 'Specialized', label: 'Agriculture Business Yoga', score: 8, when: () => hasConnection(planets.Moon, planets.Saturn, d1) && isHouseStrong(d1, 4), evidence: () => ruleEvidence([planets.Moon, planets.Saturn]) },
      { id: 'special_hospitality', category: 'Specialized', label: 'Hospitality Career Yoga', score: 7, when: () => hasConnection(planets.Venus, planets.Moon, d1) && isHouseStrong(d1, 7), evidence: () => ruleEvidence([planets.Venus, planets.Moon]) },
      { id: 'special_luxury_hospitality', category: 'Specialized', label: 'Luxury Hospitality Yoga', score: 7, when: () => Boolean(planets.Venus && [7, 10].includes(planets.Venus.house)), evidence: () => ruleEvidence([planets.Venus]) },
      { id: 'special_logistics', category: 'Specialized', label: 'Logistics Career Yoga', score: 7, when: () => hasConnection(planets.Saturn, planets.Mercury, d1), evidence: () => ruleEvidence([planets.Saturn, planets.Mercury]) },
      { id: 'special_manufacturing', category: 'Specialized', label: 'Manufacturing Career Yoga', score: 7, when: () => hasConnection(planets.Mars, planets.Saturn, d1), evidence: () => ruleEvidence([planets.Mars, planets.Saturn]) },
      { id: 'special_mining_oil', category: 'Specialized', label: 'Mining / Oil Industry Yoga', score: 7, when: () => hasConnection(planets.Saturn, planets.Rahu, d1) && isHouseStrong(d1, 8), evidence: () => ruleEvidence([planets.Saturn, planets.Rahu]) },
      { id: 'special_defense_contractor', category: 'Specialized', label: 'Defense Contractor Yoga', score: 8, when: () => hasConnection(planets.Mars, planets.Rahu, d1) && hasConnection(planets.Saturn, lords[10], d1), evidence: () => ruleEvidence([planets.Mars, planets.Rahu, planets.Saturn, lords[10]]) },
      { id: 'special_research_scientist', category: 'Specialized', label: 'Research Scientist Yoga', score: 8, when: () => hasConnection(planets.Ketu, planets.Jupiter, d1) && (isHouseStrong(d1, 8) || isHouseStrong(d1, 9) || isHouseStrong(d1, 12)), evidence: () => ruleEvidence([planets.Ketu, planets.Jupiter]) },

      { id: 'rare_vipreet', category: 'Rare', label: 'Vipreet Raj Yoga in Career Houses', score: 10, when: () => [6, 8, 12].some(house => isHouseStrong(d1, house) && hasMaleficPressure(d1, house)), evidence: () => [houseSummary(d1, 6), houseSummary(d1, 8), houseSummary(d1, 12)] },
      { id: 'rare_neechabhanga', category: 'Rare', label: 'Neecha Bhanga Support', score: 9, when: () => d1.planets.some(planet => planet.debilitated && !planet.combust), evidence: () => ruleEvidence(d1.planets.filter(planet => planet.debilitated)) },
      { id: 'rare_chandra_mangal', category: 'Rare', label: 'Chandra-Mangal Yoga', score: 9, when: () => hasConnection(planets.Moon, planets.Mars, d1), evidence: () => ruleEvidence([planets.Moon, planets.Mars]) },
      { id: 'rare_saraswati', category: 'Rare', label: 'Saraswati Yoga', score: 8, when: () => hasConnection(planets.Mercury, planets.Jupiter, d1) && hasConnection(planets.Jupiter, planets.Venus, d1), evidence: () => ruleEvidence([planets.Mercury, planets.Jupiter, planets.Venus]) },
      { id: 'rare_shankha', category: 'Rare', label: 'Shankha / Structured Reputation Yoga', score: 7, when: () => KENDRAS.filter(house => isHouseStrong(d1, house)).length >= 3, evidence: () => KENDRAS.map(house => houseSummary(d1, house)) },

      { id: 'd10_validation', category: 'D10 Validation', label: 'D10 Career Execution Strong', score: 14, when: () => Boolean(d10 && evaluateD10Execution(d10, { yogas: [] }) >= 65), evidence: () => [houseSummary(d10, 10), houseSummary(d10, 6), houseSummary(d10, 11)] },
      { id: 'd9_validation', category: 'D9 Validation', label: 'D9 Planetary Strength Support', score: 8, when: () => Boolean(d9 && chartPlanetSupport(d9) >= 55), evidence: () => [houseSummary(d9, 1), houseSummary(d9, 10)] },
      { id: 'd24_validation', category: 'D24 Validation', label: 'D24 Education / Skill Support', score: 6, when: () => Boolean(d24 && (isHouseStrong(d24, 5) || isHouseStrong(d24, 9))), evidence: () => [houseSummary(d24, 5), houseSummary(d24, 9)] },
      { id: 'd60_validation', category: 'D60 Validation', label: 'D60 Karmic Refinement', score: 6, when: () => Boolean(d60 && (isHouseStrong(d60, 6) || isHouseStrong(d60, 10))), evidence: () => [houseSummary(d60, 6), houseSummary(d60, 10)] }
    ];
  }

  function houseSummary(chart, house) {
    if (!chart) return `H${house}: unavailable`;
    const sign = getHouseSign(chart, house) || 'Unknown';
    const occupants = getHouseOccupants(chart, house);
    const lord = chart.lords?.[house] || SIGN_LORDS[sign] || 'Unknown';
    const strength = houseStrengthScore(chart, house);
    return `H${house} ${sign} | Lord ${lord} | Occupants ${occupants.length} | Strength ${strength}`;
  }

  function analyzeCareerCharts(chartsInput) {
    const charts = {
      d1: chartsInput?.d1 ? normalizeChart(chartsInput.d1, 'D1') : null,
      d9: chartsInput?.d9 ? normalizeChart(chartsInput.d9, 'D9') : null,
      d10: chartsInput?.d10 ? normalizeChart(chartsInput.d10, 'D10') : null,
      d2: chartsInput?.d2 ? normalizeChart(chartsInput.d2, 'D2') : null,
      d24: chartsInput?.d24 ? normalizeChart(chartsInput.d24, 'D24') : null,
      d60: chartsInput?.d60 ? normalizeChart(chartsInput.d60, 'D60') : null
    };

    if (!charts.d1) {
      return { version: '3.0.0', error: 'D1 chart is required for career analysis.' };
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

    const d1Promise = evaluateD1Promise(charts.d1, { yogas: detected });
    const d10Execution = charts.d10 ? evaluateD10Execution(charts.d10, { yogas: detected }) : 0;
    const d9Validation = charts.d9 ? Math.min(100, Math.round(chartPlanetSupport(charts.d9))) : 0;
    const d2Validation = charts.d2 ? Math.min(100, Math.round((houseStrengthScore(charts.d2, 2) + houseStrengthScore(charts.d2, 11)) / 2)) : 0;
    const d24Validation = charts.d24 ? Math.min(100, Math.round((houseStrengthScore(charts.d24, 5) + houseStrengthScore(charts.d24, 9)) / 2)) : 0;
    const d60Validation = charts.d60 ? Math.min(100, Math.round((houseStrengthScore(charts.d60, 6) + houseStrengthScore(charts.d60, 10)) / 2)) : 0;

    const dashaTiming = estimateTimingSupport(context);
    const transitActivation = estimateTransitSupport(context);

    const weighted = weightedCareerScore({ d1Promise, d10Execution, dashaTiming, transitActivation });
    const wealthSupportFromCareer = Math.min(100, Math.round(
      (houseStrengthScore(charts.d1, 2) * 0.35) +
      (houseStrengthScore(charts.d1, 11) * 0.35) +
      (isDhanaSupport(charts.d1) ? 18 : 0) +
      (charts.d2 ? d2Validation * 0.12 : 0)
    ));

    const clusters = inferCareerClusters({
      charts,
      context,
      rules: detected,
      categoryScores,
      d1Promise,
      d10Execution,
      d9Validation,
      d2Validation,
      d24Validation,
      d60Validation
    });
    const domainScores = classifyCareerDomains(detected.map(rule => rule.label));

    return {
      version: '3.0.0',
      chart_types: {
        d1: charts.d1?.type || null,
        d9: charts.d9?.type || null,
        d10: charts.d10?.type || null,
        d2: charts.d2?.type || null,
        d24: charts.d24?.type || null,
        d60: charts.d60?.type || null
      },
      career_yogas_detected: detected.map(rule => rule.label),
      career_yoga_details: detected,
      career_strength_score: weighted,
      best_career_paths: clusters.slice(0, 6).map(cluster => cluster.label),
      career_category_scores: categoryScores,
      career_domain_scores: domainScores,
      government_potential: clusters.some(cluster => /government|administrative|civil services|politics/i.test(cluster.label)),
      business_potential: clusters.some(cluster => /business|startup|entrepreneur/i.test(cluster.label)),
      technical_potential: clusters.some(cluster => /technical|engineering/i.test(cluster.label)),
      it_potential: clusters.some(cluster => /software|data|analytics|ai/i.test(cluster.label)),
      medical_potential: clusters.some(cluster => /medical|health/i.test(cluster.label)),
      legal_potential: clusters.some(cluster => /legal|judiciary/i.test(cluster.label)),
      creative_potential: clusters.some(cluster => /creative|media|film/i.test(cluster.label)),
      finance_potential: clusters.some(cluster => /finance|banking|stocks|ca/i.test(cluster.label)),
      spiritual_potential: clusters.some(cluster => /spiritual|teaching|advisor/i.test(cluster.label)),
      foreign_career: clusters.some(cluster => /foreign|international|mnc|aviation|maritime/i.test(cluster.label)),
      freelancer_potential: clusters.some(cluster => /freelancer|consultant|creator/i.test(cluster.label)),
      wealth_support_from_career: wealthSupportFromCareer,
      d10_validation: d10Execution,
      divisional_validation: {
        d1: d1Promise,
        d10: d10Execution,
        d9: d9Validation,
        d2: d2Validation,
        d24: d24Validation,
        d60: d60Validation
      },
      component_scores: {
        d1: d1Promise,
        d10: d10Execution,
        dasha: dashaTiming,
        transit: transitActivation
      },
      formula: 'Career strength = (D1 Promise * 0.4) + (D10 Execution * 0.4) + (Dasha Timing * 0.1) + (Transit Activation * 0.1)',
      data_quality: {
        d1_present: Boolean(charts.d1),
        d9_present: Boolean(charts.d9),
        d10_present: Boolean(charts.d10),
        d2_present: Boolean(charts.d2),
        d24_present: Boolean(charts.d24),
        d60_present: Boolean(charts.d60),
        ruled_count: detected.length
      },
      clusters,
      notes: buildNotes({ charts, detected, d1Promise, d10Execution, dashaTiming, transitActivation, wealthSupportFromCareer })
    };
  }

  function classifyCareerDomains(yogas) {
    const domains = {
      Government: [],
      Corporate: [],
      Business: [],
      Technology: [],
      Medical: [],
      Legal: [],
      Creative: [],
      Finance: [],
      Foreign: [],
      Independent: [],
      Specialized: [],
      Spiritual: [],
      Research: []
    };

    yogas.forEach(yoga => {
      const text = String(yoga).toLowerCase();
      if (/government|civil|ias|upsc|politic|administrative|authority|public sector|treasury|military|police|defense/.test(text)) domains.Government.push(yoga);
      if (/corporate|mnc|hr|management|operations|banking|finance corporate|executive/.test(text)) domains.Corporate.push(yoga);
      if (/business|entrepreneur|startup|trading|family business|import export|real estate|luxury brand/.test(text)) domains.Business.push(yoga);
      if (/software|data|analytics|ai|it career|technical|engineering|cybersecurity|product management|digital transformation/.test(text)) domains.Technology.push(yoga);
      if (/medical|healthcare|physician|surgical|pharma|psychology|healing/.test(text)) domains.Medical.push(yoga);
      if (/legal|judicial|law|professor|teacher|academic research|chartered accountant|audit/.test(text)) domains.Legal.push(yoga);
      if (/creative|media|film|influencer|content creator|music|design|fashion|luxury hospitality/.test(text)) domains.Creative.push(yoga);
      if (/finance|banking|accounting|stock market|treasury|wealth|ca|audit|tax/.test(text)) domains.Finance.push(yoga);
      if (/foreign|international|mnc|aviation|maritime|diplomatic|import export/.test(text)) domains.Foreign.push(yoga);
      if (/freelancer|consultant|advisor|ngo|social leadership/.test(text)) domains.Independent.push(yoga);
      if (/agriculture|hospitality|logistics|manufacturing|mining|oil|defense contractor|research scientist/.test(text)) domains.Specialized.push(yoga);
      if (/spiritual|moksha|detachment|teaching/.test(text)) domains.Spiritual.push(yoga);
      if (/research scientist|research|academic|data science/.test(text)) domains.Research.push(yoga);
    });

    return Object.fromEntries(Object.entries(domains).map(([key, values]) => [key, values.length]));
  }

  function weightedCareerScore(scores) {
    const components = [
      { key: 'd1Promise', weight: 0.4 },
      { key: 'd10Execution', weight: 0.4 },
      { key: 'dashaTiming', weight: 0.1 },
      { key: 'transitActivation', weight: 0.1 }
    ];
    const available = components.filter(item => Number.isFinite(scores[item.key]) && scores[item.key] > 0);
    const pool = available.length ? available : components.filter(item => Number.isFinite(scores[item.key]));
    const normalizer = pool.reduce((sum, item) => sum + item.weight, 0) || 1;
    const total = pool.reduce((sum, item) => sum + ((scores[item.key] || 0) * item.weight), 0);
    return Math.max(0, Math.min(100, Math.round((total / normalizer))));
  }

  function estimateTimingSupport(context) {
    const state = getAppState();
    const dasa = state?.endpointOutputs?.['vim-maha-antar']?.data || state?.endpointOutputs?.['vim-maha']?.data || null;
    if (!dasa) return 0;
    const text = JSON.stringify(dasa).toLowerCase();
    let score = 0;
    if (text.includes('sun') || text.includes('jupiter') || text.includes('mercury')) score += 30;
    if (text.includes('10') || text.includes('career') || text.includes('profession')) score += 25;
    if (text.includes('current') || text.includes('running')) score += 15;
    return Math.max(0, Math.min(100, score));
  }

  function estimateTransitSupport(context) {
    const state = getAppState();
    const transit = state?.endpointOutputs?.transit || state?.endpointOutputs?.['planet-transits'] || null;
    if (!transit) return 0;
    const text = JSON.stringify(transit).toLowerCase();
    let score = 0;
    if (text.includes('jupiter') || text.includes('saturn')) score += 20;
    if (text.includes('10') || text.includes('career')) score += 20;
    return Math.max(0, Math.min(100, score));
  }

  function inferCareerClusters(context) {
    const { charts, context: ctx, categoryScores, d1Promise, d10Execution } = context;
    const clusters = [];
    const addCluster = (label, score, evidence) => clusters.push({ label, score, evidence });

    const governmentScore = (categoryScores.Government || 0) + (categoryScores['Raj Yoga'] || 0) + (d1Promise >= 70 ? 10 : 0) + (d10Execution >= 65 ? 10 : 0);
    if (governmentScore >= 20) addCluster('IAS / UPSC / Civil Services', governmentScore, ['Sun, Saturn, Jupiter links', '10th house execution', 'D10 confirmation']);
    if (governmentScore >= 16 && hasConnection(ctx.planets.Sun, ctx.planets.Mars, charts.d1)) addCluster('Politics / Administration', governmentScore - 2, ['Sun-Mars command', 'authority pattern']);

    const securityScore = (hasConnection(ctx.planets.Mars, ctx.planets.Saturn, charts.d1) ? 12 : 0) + (isHouseStrong(charts.d1, 6) ? 8 : 0) + (isHouseStrong(charts.d1, 10) ? 8 : 0);
    if (securityScore >= 15) addCluster('Army / Police / Defense', securityScore, ['Mars-Saturn', '6th house', '10th house']);

    const businessScore = (categoryScores.Business || 0) + (isDhanaSupport(charts.d1) ? 8 : 0) + (d10Execution >= 60 ? 8 : 0);
    if (businessScore >= 18) addCluster('Business / Entrepreneurship', businessScore, ['2-7-11 support', 'Mercury / Rahu / Venus / Lagna lord']);
    if (businessScore >= 16 && hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) addCluster('Startup Founder / Tech Venture', businessScore - 1, ['Rahu-Mercury innovation', 'D10 execution']);
    if (businessScore >= 14 && hasConnection(ctx.planets.Moon, ctx.planets.Mercury, charts.d1)) addCluster('Consulting / Client Services', businessScore - 3, ['Moon-Mercury communication']);

    const technicalScore = (categoryScores.Technical || 0) + (categoryScores.IT || 0);
    if (technicalScore >= 18) addCluster('Software Engineering / Technical Roles', technicalScore, ['Mercury-Rahu', 'Mars-Mercury', 'D10 Mercury']);
    if (technicalScore >= 16 && (ctx.planets.Mercury?.sign === 'Virgo' || ctx.planets.Mercury?.sign === 'Gemini')) addCluster('Data Science / Analytics', technicalScore - 1, ['Mercury in air/earth signs', 'Rahu support']);
    if (technicalScore >= 14 && hasConnection(ctx.planets.Mercury, ctx.planets.Saturn, charts.d1)) addCluster('Product / Systems / QA', technicalScore - 2, ['Mercury-Saturn structure']);

    const medicalScore = categoryScores.Medical || 0;
    if (medicalScore >= 16) addCluster('Medical / Healthcare / Surgery', medicalScore, ['Sun-Mars', 'Mars-Ketu', '6-8-10 axis']);

    const legalScore = categoryScores.Legal || 0;
    if (legalScore >= 15) addCluster('Legal / Judiciary / Compliance', legalScore, ['Jupiter-Saturn', '9-10 axis']);

    const creativeScore = categoryScores.Creative || 0;
    if (creativeScore >= 15) addCluster('Creative / Media / Entertainment', creativeScore, ['Venus-Mercury', 'Moon-Venus', 'Rahu-Venus']);
    if (creativeScore >= 14 && hasConnection(ctx.planets.Rahu, ctx.planets.Venus, charts.d1)) addCluster('Film / Digital Media / Influencer', creativeScore - 1, ['Rahu-Venus mass reach']);

    const financeScore = categoryScores.Finance || 0;
    if (financeScore >= 15) addCluster('Finance / Banking / Accounting', financeScore, ['2nd/11th lords', 'Mercury-Jupiter', 'Saturn-Mercury']);
    if (financeScore >= 14 && hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) addCluster('Stock Market / Trading', financeScore - 1, ['Rahu-Mercury speculation']);
    if (financeScore >= 14 && hasConnection(ctx.planets.Mercury, ctx.planets.Jupiter, charts.d1)) addCluster('Chartered Accountant / Audit / Tax', financeScore - 2, ['Mercury-Jupiter analysis']);

    const spiritualScore = categoryScores.Spiritual || 0;
    if (spiritualScore >= 15) addCluster('Spiritual Teaching / Advisory', spiritualScore, ['Jupiter-Ketu', '9th/12th axis']);
    if (spiritualScore >= 14 && hasConnection(ctx.planets.Sun, ctx.planets.Ketu, charts.d1)) addCluster('NGO / Humanitarian / Service Work', spiritualScore - 1, ['Sun-Ketu service detachment']);

    if ((categoryScores.Rare || 0) >= 12) addCluster('Research Scientist / Deep Specialist', categoryScores.Rare, ['Rare yoga pattern', 'research orientation']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1) && hasConnection(ctx.planets.Venus, ctx.planets.Moon, charts.d1)) {
      addCluster('Marketing / Influencer / Digital Strategy', 16, ['Rahu-Mercury scale', 'Venus-Moon appeal']);
    }
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Sun, charts.d1) || hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) {
      addCluster('Foreign Career / MNC / Import-Export', 15, ['Rahu linkage', 'international placement']);
    }
    if (hasConnection(ctx.planets.Mars, ctx.planets.Saturn, charts.d1) && hasConnection(ctx.planets.Sun, ctx.planets.Mars, charts.d1)) {
      addCluster('Defense Contractor / Technical Security', 15, ['Mars-Saturn + Sun-Mars']);
    }
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Moon, charts.d1) || hasConnection(ctx.planets.Rahu, ctx.planets.Saturn, charts.d1)) {
      addCluster('Aviation / Maritime / Global Operations', 14, ['Rahu with Moon/Saturn']);
    }
    if (ctx.planets.Venus && ['Taurus', 'Libra', 'Pisces'].includes(ctx.planets.Venus.sign) && isHouseStrong(charts.d1, 4)) {
      addCluster('Real Estate / Luxury Assets', 13, ['Venus tone', '4th house support']);
    }
    if (ctx.planets.Moon && ['Cancer', 'Taurus', 'Pisces'].includes(ctx.planets.Moon.sign) && isHouseStrong(charts.d1, 4)) {
      addCluster('Agriculture / Land / Food Business', 13, ['Moon + earth/water support', '4th house']);
    }

    clusters.sort((a, b) => b.score - a.score);
    return clusters;
  }

  function buildNotes(state) {
    const notes = [];
    if (state.d10Execution >= 70) notes.push('D10 execution is strong enough to validate the career promise.');
    if (state.d1Promise >= 70) notes.push('D1 gives a strong career promise and visible professional momentum.');
    if (state.wealthSupportFromCareer >= 70) notes.push('Career choices are likely to support wealth accumulation.');
    if (!state.charts.d10) notes.push('D10 was not available; professional conclusions were normalized from D1 and supporting divisional data.');
    if (!state.charts.d9) notes.push('D9 was not available; planet-strength validation is partial.');
    return notes;
  }

  function renderCareerReport(result, targetOrId) {
    const target = typeof targetOrId === 'string' ? (root.document && root.document.getElementById(targetOrId)) : targetOrId;
    if (!target) return result;

    const scoreClass = result.career_strength_score >= 75 ? 'good' : result.career_strength_score >= 50 ? 'warn' : 'bad';
    const topClusterHtml = (result.clusters || []).slice(0, 6).map(cluster => `
      <div class="response-card">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
          <strong>${escapeHtml(cluster.label)}</strong>
          <span class="tag info">${cluster.score}</span>
        </div>
        <div class="tiny muted">${escapeHtml((cluster.evidence || []).join(' | '))}</div>
      </div>
    `).join('');

    const yogaHtml = (result.career_yoga_details || []).slice(0, 24).map(rule => `
      <div class="response-card">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
          <strong>${escapeHtml(rule.label)}</strong>
          <span class="tag ${rule.category === 'Government' ? 'good' : 'info'}">${escapeHtml(rule.category)}</span>
        </div>
        <div class="tiny muted">${escapeHtml((rule.evidence || []).join(' | '))}</div>
      </div>
    `).join('');

    const categoryPills = Object.entries(result.career_category_scores || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, score]) => `<span class="tag info">${escapeHtml(name)}: ${score}</span>`)
      .join(' ');

    target.innerHTML = `
      <div class="card analysis-box">
        <div class="status-bar" style="margin-bottom: 14px;">
          <span class="pill ${scoreClass}">Career Score ${result.career_strength_score}</span>
          <span class="pill">D1 ${result.divisional_validation?.d1 ?? 0}</span>
          <span class="pill">D10 ${result.divisional_validation?.d10 ?? 0}</span>
          <span class="pill">Wealth ${result.wealth_support_from_career ?? 0}</span>
        </div>
        <div class="status-bar" style="margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          ${categoryPills || '<span class="tiny muted">No category scores available yet.</span>'}
        </div>
        <div class="grid-2" style="margin-bottom: 14px;">
          <div class="card">
            <h3>Best Career Paths</h3>
            <div class="tiny muted">${(result.best_career_paths || []).map(path => `<div style="margin-bottom:8px;">${escapeHtml(path)}</div>`).join('') || 'No confident cluster yet.'}</div>
          </div>
          <div class="card">
            <h3>Validation</h3>
            <div class="tiny muted">${escapeHtml(result.formula)}</div>
            <div class="tiny muted" style="margin-top:8px;">D10: ${result.d10_validation ?? 0} | D9: ${result.divisional_validation?.d9 ?? 0} | D2: ${result.divisional_validation?.d2 ?? 0} | D24: ${result.divisional_validation?.d24 ?? 0} | D60: ${result.divisional_validation?.d60 ?? 0}</div>
          </div>
        </div>
        <div class="grid-2" style="margin-bottom: 14px;">
          <div class="card">
            <h3>Top Career Clusters</h3>
            <div class="response-list">${topClusterHtml || '<div class="tiny muted">No cluster detected yet.</div>'}</div>
          </div>
          <div class="card">
            <h3>Notes</h3>
            <div class="tiny muted">${(result.notes || []).map(note => `<div style="margin-bottom:8px;">${escapeHtml(note)}</div>`).join('') || 'No notes yet.'}</div>
          </div>
        </div>
        <details>
          <summary style="cursor:pointer; font-weight:700;">Detected Career Yogas (${(result.career_yoga_details || []).length})</summary>
          <div class="response-list" style="margin-top:12px;">${yogaHtml || '<div class="tiny muted">No yogas detected yet.</div>'}</div>
        </details>
      </div>
    `;

    return result;
  }

  function evaluateFromState(overrides = {}) {
    const state = getAppState() || {};
    const charts = {
      d1: overrides.d1 || state.d1 || null,
      d9: overrides.d9 || state.d9 || null,
      d10: overrides.d10 || state.d10 || state.endpointOutputs?.d10?.data || state.endpointOutputs?.d10 || null,
      d2: overrides.d2 || state.d2 || state.endpointOutputs?.d2?.data || null,
      d24: overrides.d24 || state.d24 || state.endpointOutputs?.d24?.data || null,
      d60: overrides.d60 || state.d60 || state.endpointOutputs?.d60?.data || null
    };
    return analyzeCareerCharts(charts);
  }

  function evaluate(chart, divisional = {}) {
    return analyzeCareerCharts({
      d1: chart,
      d9: divisional.d9 || null,
      d10: divisional.d10 || null,
      d2: divisional.d2 || null,
      d24: divisional.d24 || null,
      d60: divisional.d60 || null
    });
  }

  function runAndRender(targetOrId, overrides = {}) {
    const result = evaluateFromState(overrides);
    renderCareerReport(result, targetOrId || 'careerOutput');
    return result;
  }

  function renderLatest(targetOrId) {
    return runAndRender(targetOrId || 'careerOutput');
  }

  function estimateTimingSupport() {
    const state = getAppState();
    const dasa = state?.endpointOutputs?.['vim-maha-antar']?.data || state?.endpointOutputs?.['vim-maha']?.data || null;
    if (!dasa) return 0;
    const text = JSON.stringify(dasa).toLowerCase();
    let score = 0;
    if (text.includes('sun') || text.includes('jupiter') || text.includes('mercury')) score += 30;
    if (text.includes('10') || text.includes('career') || text.includes('profession')) score += 25;
    if (text.includes('current') || text.includes('running')) score += 15;
    return Math.max(0, Math.min(100, score));
  }

  function estimateTransitSupport() {
    const state = getAppState();
    const transit = state?.endpointOutputs?.transit || state?.endpointOutputs?.['planet-transits'] || null;
    if (!transit) return 0;
    const text = JSON.stringify(transit).toLowerCase();
    let score = 0;
    if (text.includes('jupiter') || text.includes('saturn')) score += 20;
    if (text.includes('10') || text.includes('career')) score += 20;
    return Math.max(0, Math.min(100, score));
  }

  root.CareerEngine = {
    version: '3.0.0',
    normalizeChart,
    analyzeCareerCharts,
    evaluate,
    evaluateFromState,
    runAndRender,
    render: renderCareerReport,
    renderLatest,
    helpers: { getPlanet, hasConnection, isPlanetStrong, isHouseStrong, houseStrengthScore, planetStrengthScore, isRajyoga, isDhanaSupport }
  };

  function inferCareerClusters(context) {
    const { charts, context: ctx, categoryScores, d1Promise, d10Execution } = context;
    const clusters = [];
    const addCluster = (label, score, evidence) => clusters.push({ label, score, evidence });

    const governmentScore = (categoryScores.Government || 0) + (categoryScores['Raj Yoga'] || 0) + (d1Promise >= 70 ? 10 : 0) + (d10Execution >= 65 ? 10 : 0);
    if (governmentScore >= 20) addCluster('IAS / UPSC / Civil Services', governmentScore, ['Sun, Saturn, Jupiter links', '10th house execution', 'D10 confirmation']);
    if (governmentScore >= 16 && hasConnection(ctx.planets.Sun, ctx.planets.Mars, charts.d1)) addCluster('Politics / Administration', governmentScore - 2, ['Sun-Mars command', 'authority pattern']);

    const securityScore = (hasConnection(ctx.planets.Mars, ctx.planets.Saturn, charts.d1) ? 12 : 0) + (isHouseStrong(charts.d1, 6) ? 8 : 0) + (isHouseStrong(charts.d1, 10) ? 8 : 0);
    if (securityScore >= 15) addCluster('Army / Police / Defense', securityScore, ['Mars-Saturn', '6th house', '10th house']);

    const businessScore = (categoryScores.Business || 0) + (isDhanaSupport(charts.d1) ? 8 : 0) + (d10Execution >= 60 ? 8 : 0);
    if (businessScore >= 18) addCluster('Business / Entrepreneurship', businessScore, ['2-7-11 support', 'Mercury / Rahu / Venus / Lagna lord']);
    if (businessScore >= 16 && hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) addCluster('Startup Founder / Tech Venture', businessScore - 1, ['Rahu-Mercury innovation', 'D10 execution']);
    if (businessScore >= 14 && hasConnection(ctx.planets.Moon, ctx.planets.Mercury, charts.d1)) addCluster('Consulting / Client Services', businessScore - 3, ['Moon-Mercury communication']);

    const technicalScore = (categoryScores.Technical || 0) + (categoryScores.IT || 0);
    if (technicalScore >= 18) addCluster('Software Engineering / Technical Roles', technicalScore, ['Mercury-Rahu', 'Mars-Mercury', 'D10 Mercury']);
    if (technicalScore >= 16 && (ctx.planets.Mercury?.sign === 'Virgo' || ctx.planets.Mercury?.sign === 'Gemini')) addCluster('Data Science / Analytics', technicalScore - 1, ['Mercury in air/earth signs', 'Rahu support']);
    if (technicalScore >= 14 && hasConnection(ctx.planets.Mercury, ctx.planets.Saturn, charts.d1)) addCluster('Product / Systems / QA', technicalScore - 2, ['Mercury-Saturn structure']);

    const medicalScore = categoryScores.Medical || 0;
    if (medicalScore >= 16) addCluster('Medical / Healthcare / Surgery', medicalScore, ['Sun-Mars', 'Mars-Ketu', '6-8-10 axis']);

    const legalScore = categoryScores.Legal || 0;
    if (legalScore >= 15) addCluster('Legal / Judiciary / Compliance', legalScore, ['Jupiter-Saturn', '9-10 axis']);

    const creativeScore = categoryScores.Creative || 0;
    if (creativeScore >= 15) addCluster('Creative / Media / Entertainment', creativeScore, ['Venus-Mercury', 'Moon-Venus', 'Rahu-Venus']);
    if (creativeScore >= 14 && hasConnection(ctx.planets.Rahu, ctx.planets.Venus, charts.d1)) addCluster('Film / Digital Media / Influencer', creativeScore - 1, ['Rahu-Venus mass reach']);

    const financeScore = categoryScores.Finance || 0;
    if (financeScore >= 15) addCluster('Finance / Banking / Accounting', financeScore, ['2nd/11th lords', 'Mercury-Jupiter', 'Saturn-Mercury']);
    if (financeScore >= 14 && hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) addCluster('Stock Market / Trading', financeScore - 1, ['Rahu-Mercury speculation']);
    if (financeScore >= 14 && hasConnection(ctx.planets.Mercury, ctx.planets.Jupiter, charts.d1)) addCluster('Chartered Accountant / Audit / Tax', financeScore - 2, ['Mercury-Jupiter analysis']);

    const spiritualScore = categoryScores.Spiritual || 0;
    if (spiritualScore >= 15) addCluster('Spiritual Teaching / Advisory', spiritualScore, ['Jupiter-Ketu', '9th/12th axis']);
    if (spiritualScore >= 14 && hasConnection(ctx.planets.Sun, ctx.planets.Ketu, charts.d1)) addCluster('NGO / Humanitarian / Service Work', spiritualScore - 1, ['Sun-Ketu service detachment']);

    if ((categoryScores.Rare || 0) >= 12) addCluster('Research Scientist / Deep Specialist', categoryScores.Rare, ['Rare yoga pattern', 'research orientation']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1) && hasConnection(ctx.planets.Venus, ctx.planets.Moon, charts.d1)) addCluster('Marketing / Influencer / Digital Strategy', 16, ['Rahu-Mercury scale', 'Venus-Moon appeal']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Sun, charts.d1) || hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1)) addCluster('Foreign Career / MNC / Import-Export', 15, ['Rahu linkage', 'international placement']);
    if (hasConnection(ctx.planets.Mars, ctx.planets.Saturn, charts.d1) && hasConnection(ctx.planets.Sun, ctx.planets.Mars, charts.d1)) addCluster('Defense Contractor / Technical Security', 15, ['Mars-Saturn + Sun-Mars']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Moon, charts.d1) || hasConnection(ctx.planets.Rahu, ctx.planets.Saturn, charts.d1)) addCluster('Aviation / Maritime / Global Operations', 14, ['Rahu with Moon/Saturn']);
    if (hasConnection(ctx.planets.Jupiter, ctx.planets.Ketu, charts.d1) && hasConnection(ctx.planets.Moon, ctx.planets.Jupiter, charts.d1)) addCluster('Spiritual Teaching / Counseling / Advisory', 14, ['Jupiter-Ketu + Moon-Jupiter']);
    if (ctx.planets.Venus && ['Taurus', 'Libra', 'Pisces'].includes(ctx.planets.Venus.sign) && isHouseStrong(charts.d1, 4)) addCluster('Real Estate / Luxury Assets', 13, ['Venus tone', '4th house support']);
    if (ctx.planets.Moon && ['Cancer', 'Taurus', 'Pisces'].includes(ctx.planets.Moon.sign) && isHouseStrong(charts.d1, 4)) addCluster('Agriculture / Land / Food Business', 13, ['Moon + earth/water support', '4th house']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1) && isHouseStrong(charts.d1, 11)) addCluster('Influencer / Digital Marketing / Growth', 14, ['Rahu-Mercury scale + 11th house']);
    if (hasConnection(ctx.planets.Saturn, ctx.planets.Mercury, charts.d1) && isHouseStrong(charts.d1, 3)) addCluster('Logistics / Operations / Manufacturing', 14, ['Saturn-Mercury structure + 3rd house']);
    if (hasConnection(ctx.planets.Rahu, ctx.planets.Mercury, charts.d1) && hasConnection(ctx.planets.Jupiter, ctx.planets.Mercury, charts.d1)) addCluster('Stock Market / Trading / Quant', 14, ['Rahu-Mercury + Jupiter-Mercury']);
    if (hasConnection(ctx.planets.Mars, ctx.planets.Rahu, charts.d1) && isHouseStrong(charts.d1, 8)) addCluster('Cybersecurity / Defense Tech', 14, ['Mars-Rahu + 8th house']);

    if (!clusters.length) {
      const fallbackLabels = {
        Government: 'Government / Administrative Services',
        'Raj Yoga': 'Leadership / Executive Roles',
        Business: 'Business / Entrepreneurship',
        Technical: 'Engineering / Systems',
        IT: 'Software / Data / Analytics',
        Medical: 'Medical / Healthcare',
        Legal: 'Legal / Judiciary',
        Creative: 'Creative / Media',
        Finance: 'Finance / Banking / Accounting',
        Spiritual: 'Advisory / Teaching',
        Rare: 'Specialized / Research'
      };

      Object.entries(categoryScores)
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([category, score]) => {
          addCluster(fallbackLabels[category] || `${category} Career Track`, score, ['Category-score fallback']);
        });
    }

    clusters.sort((a, b) => b.score - a.score);
    return clusters;
  }

  function buildNotes(state) {
    const notes = [];
    if (state.d10Execution >= 70) notes.push('D10 execution is strong enough to validate the career promise.');
    if (state.d1Promise >= 70) notes.push('D1 gives a strong career promise and visible professional momentum.');
    if (state.wealthSupportFromCareer >= 70) notes.push('Career choices are likely to support wealth accumulation.');
    if (!state.charts.d10) notes.push('D10 was not available; professional conclusions were normalized from D1 and supporting divisional data.');
    if (!state.charts.d9) notes.push('D9 was not available; planet-strength validation is partial.');
    return notes;
  }

  if (root.document) {
    root.document.addEventListener('DOMContentLoaded', () => {
      const button = root.document.getElementById('runCareerBtn');
      if (button) {
        button.addEventListener('click', () => {
          const targetId = root.document.getElementById('careerOutput') ? 'careerOutput' : 'analysisOutput';
          runAndRender(targetId);
          const status = root.document.getElementById('statusText');
          if (status) status.textContent = 'Career engine analyzed the chart successfully.';
        });
      }
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
