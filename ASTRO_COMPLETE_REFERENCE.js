/**
 * ============================================================================
 * COMPLETE ASTROLOGY PLATFORM - REFERENCE DATA & CHART CATALOG
 * ============================================================================
 * 
 * Copy this entire code block and paste into ChatGPT or any AI tool
 * to get detailed analysis, explanations, and insights about:
 * - All divisional charts (D1-D60)
 * - Shadbala (6 types of planetary strength)
 * - Vimsottari Dasas (planetary periods)
 * - Planet properties & relationships
 * - House meanings & interpretations
 * - Zodiac signs & elements
 * 
 * ============================================================================
 */

const ASTROLOGY_COMPLETE_REFERENCE = {
  
  // ==================== PLATFORM INFO ====================
  platform: {
    name: "AstroScope - Professional Astrology Detection Platform",
    version: "1.0",
    description: "Single-page Vedic astrology platform with D1/D9 analysis, multi-divisional charts, shadbala strength analysis, and Vimsottari dasa timeline generation",
    baseUrl: "https://json.freeastrologyapi.com",
    authentication: "x-api-key header with dual-key fallback support"
  },

  // ==================== API ENDPOINTS CATALOG ====================
  apiEndpoints: {
    core: [
      {
        id: "d1",
        name: "Planets Extended (D1 - Rasi Chart)",
        path: "planets/extended",
        description: "Birth chart showing planetary positions in 12 signs and 12 houses. Foundation of all Vedic astrology readings.",
        importance: "MANDATORY - Core life blueprint",
        output: "7 planets with zodiac_sign_name, house_number, degrees, minutes, seconds, nakshatra_name, nakshatra_pada, isRetro"
      },
      {
        id: "d9",
        name: "Navamsa Chart Info (D9)",
        path: "navamsa-chart-info",
        description: "9th harmonic division showing marriage, partnerships, inner strength maturity, and D1 promise fulfillment. Most important secondary chart.",
        importance: "MANDATORY - Marriage & dharma",
        output: "7 planets with name, current_sign, house_number, isRetro"
      }
    ],

    divisionalCharts: [
      {
        id: "d2",
        name: "D2 Chart Info",
        path: "d2-chart-info",
        division: 2,
        description: "Hora Chart - Shows family wealth, assets, financial status, and inherited property. Reflects second house matters.",
        focusArea: "Finances, family resources, banking"
      },
      {
        id: "d3",
        name: "D3 Chart Info",
        path: "d3-chart-info",
        division: 3,
        description: "Drekkana - Siblings, courage, mental strength. Shows how native handles challenges and competition.",
        focusArea: "Siblings, mental fortitude, short travels"
      },
      {
        id: "d4",
        name: "D4 Chart Info",
        path: "d4-chart-info",
        division: 4,
        description: "Chaturthamsha - Real estate, landed property, vehicles, and fixed assets. 4th house amplified.",
        focusArea: "Property, vehicles, mother, domestic happiness"
      },
      {
        id: "d5",
        name: "D5 Chart Info",
        path: "d5-chart-info",
        division: 5,
        description: "Panchamamsha - Children, intellect, creativity, romance, speculation. 5th house matters amplified.",
        focusArea: "Children, romance, creativity, investments"
      },
      {
        id: "d6",
        name: "D6 Chart Info",
        path: "d6-chart-info",
        division: 6,
        description: "Shashthamsha - Health, disease, enemies, debts, litigation. Shows challenges and how to overcome them.",
        focusArea: "Health, diseases, enemies, legal matters"
      },
      {
        id: "d7",
        name: "D7 Chart Info",
        path: "d7-chart-info",
        division: 7,
        description: "Saptamamsha - Marriage, spouse nature, relationship dynamics. Detailed marriage analysis chart.",
        focusArea: "Spouse nature, marriage quality, partnerships"
      },
      {
        id: "d8",
        name: "D8 Chart Info",
        path: "d8-chart-info",
        division: 8,
        description: "Ashtamamsha - Longevity, death, inheritance, occult knowledge, sudden gains/losses. Mystery and transformation.",
        focusArea: "Longevity, inheritance, occult, sudden events"
      },
      {
        id: "d10",
        name: "D10 Chart Info",
        path: "d10-chart-info",
        division: 10,
        description: "Dasamsha - Career, profession, public image, authority. 10th house complete amplification.",
        focusArea: "Career, profession, government, authority"
      },
      {
        id: "d11",
        name: "D11 Chart Info",
        path: "d11-chart-info",
        division: 11,
        description: "Ekadashamsha - Gains, wishes fulfillment, social networks, elder siblings. 11th house matters.",
        focusArea: "Gains, friendships, hopes, wishes"
      },
      {
        id: "d12",
        name: "D12 Chart Info",
        path: "d12-chart-info",
        division: 12,
        description: "Dvadashamsha - Expenditure, losses, foreign travel, spirituality, bed pleasures. 12th house amplified.",
        focusArea: "Expenses, losses, spirituality, foreign lands"
      },
      {
        id: "d16",
        name: "D16 Chart Info",
        path: "d16-chart-info",
        division: 16,
        description: "Shodashamsha - Vehicles and conveyances. Indicates type of transportation and related matters.",
        focusArea: "Vehicles, transportation, mobility"
      },
      {
        id: "d20",
        name: "D20 Chart Info",
        path: "d20-chart-info",
        division: 20,
        description: "Vimshamsha - Spiritual attainment, psychic abilities, meditation, inner power. Highest frequency divisional.",
        focusArea: "Spirituality, meditation, psychic power"
      },
      {
        id: "d24",
        name: "D24 Chart Info",
        path: "d24-chart-info",
        division: 24,
        description: "Chaturvimshamsha - Education, learning, intellect, academic achievement.",
        focusArea: "Education, learning, intellect"
      },
      {
        id: "d27",
        name: "D27 Chart Info",
        path: "d27-chart-info",
        division: 27,
        description: "Saptavimsamsha - General strength of all planets. Most refined strength indicator.",
        focusArea: "Planet strength analysis"
      },
      {
        id: "d30",
        name: "D30 Chart Info",
        path: "d30-chart-info",
        division: 30,
        description: "Trimshamsha - Auspiciousness vs inauspiciousness. Shows good and bad periods.",
        focusArea: "Good/bad periods, auspiciousness"
      },
      {
        id: "d40",
        name: "D40 Chart Info",
        path: "d40-chart-info",
        division: 40,
        description: "Khavedamsha - Fine distinctions in planetary effects. Advanced analysis chart.",
        focusArea: "Detailed planetary effects"
      },
      {
        id: "d45",
        name: "D45 Chart Info",
        path: "d45-chart-info",
        division: 45,
        description: "Akshavedamsha - Ultimate refinement of planetary strength. Most detailed analysis.",
        focusArea: "Ultimate strength analysis"
      },
      {
        id: "d60",
        name: "D60 Chart Info",
        path: "d60-chart-info",
        division: 60,
        description: "Shashtyamsha - Most refined, complex divisional. Shows exact nature of events and timing.",
        focusArea: "Event timing, exact nature of effects"
      }
    ],

    shadbala: [
      {
        id: "shadbala-summary",
        name: "Shad Bala Summary",
        path: "shadbala/summary",
        description: "Overview of all six types of planetary strength combined. Quick strength assessment.",
        output: "Strength values for each planet (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)"
      },
      {
        id: "shadbala-breakup",
        name: "Shad Bala Break-up",
        path: "shadbala/break-up",
        description: "Detailed breakdown of all 6 shadbala components for each planet",
        output: "Individual strength metrics: sthana, kaala, dig, cheshta, drig, naisargika"
      }
    ],

    shadbalaComponents: [
      {
        name: "Sthana Bala (Positional Strength)",
        description: "Strength based on placement in zodiac sign, house, and planetary positions",
        components: ["Sign strength", "House strength", "Planetary position"]
      },
      {
        name: "Kaala Bala (Temporal Strength)",
        description: "Strength based on time - day/night, season, tithi, hora",
        components: ["Diurnal/nocturnal strength", "Seasonal strength", "Weekly day strength", "Hora strength"]
      },
      {
        name: "Dig Bala (Directional Strength)",
        description: "Strength based on optimal house direction for each planet",
        components: ["Sun 10th", "Moon 4th", "Mars 10th", "Mercury 1st", "Jupiter 1st", "Venus 4th", "Saturn 7th"]
      },
      {
        name: "Cheshta Bala (Motional Strength)",
        description: "Strength based on speed and retrograde status",
        components: ["Speed of planet", "Retrograde status", "Direction of movement"]
      },
      {
        name: "Drig Bala (Aspectual Strength)",
        description: "Strength gained from beneficial aspects of other planets",
        components: ["Benefic aspect strength", "Malefic aspect strength"]
      },
      {
        name: "Naisargika Bala (Natural Strength)",
        description: "Inherent strength of each planet based on nature",
        strength: {
          "Sun": 60,
          "Moon": 51,
          "Jupiter": 45,
          "Mercury": 45,
          "Venus": 42,
          "Mars": 51,
          "Saturn": 50
        }
      }
    ],

    dasa: [
      {
        id: "vim-maha",
        name: "Vimsottari Maha Dasas",
        path: "vimsottari-dasa/maha-dasas",
        description: "Major planetary periods (120 years cycle). Shows which planet rules which life phase.",
        cycleLength: "120 years total",
        planets: ["Ketu 7yr", "Venus 20yr", "Sun 6yr", "Moon 10yr", "Mars 7yr", "Rahu 18yr", "Jupiter 16yr", "Saturn 19yr", "Mercury 17yr"]
      },
      {
        id: "vim-maha-antar",
        name: "Maha + Antar Dasas",
        path: "vimsottari-dasa/maha-antar-dasas",
        description: "Major periods subdivided into sub-periods (Antar Dasas). Shows detailed timing of events.",
        detail: "Each maha dasa is further divided into 9 antar dasa periods for precise event timing"
      }
    ]
  },

  // ==================== PLANET INFORMATION ====================
  planets: {
    Sun: {
      number: 1,
      symbol: "☉",
      element: "Fire",
      nature: "Malefic (but benefic for authority)",
      dignity: { exalted: "Aries", debilitated: "Libra" },
      exaltationDegree: 10,
      debilitationDegree: 10,
      moolaTrikona: "Leo 0-20°",
      ownSigns: ["Leo"],
      dasPeriod: 6,
      dayOfWeek: "Sunday",
      color: "Golden/Yellow",
      metal: "Gold",
      gemstone: "Ruby",
      meaning: "Soul, ego, father, authority, vitality, will power, government"
    },
    Moon: {
      number: 2,
      symbol: "☽",
      element: "Water",
      nature: "Benefic",
      dignity: { exalted: "Taurus", debilitated: "Scorpio" },
      exaltationDegree: 3,
      debilitationDegree: 3,
      moolaTrikona: "Taurus 0-3°",
      ownSigns: ["Cancer"],
      dasPeriod: 10,
      dayOfWeek: "Monday",
      color: "White/Silver",
      metal: "Silver",
      gemstone: "Pearl",
      meaning: "Mind, emotions, mother, home, public, liquids, fertility, beauty"
    },
    Mars: {
      number: 3,
      symbol: "♂",
      element: "Fire",
      nature: "Malefic",
      dignity: { exalted: "Capricorn", debilitated: "Cancer" },
      exaltationDegree: 28,
      debilitationDegree: 28,
      moolaTrikona: "Aries 0-12°",
      ownSigns: ["Aries", "Scorpio"],
      dasPeriod: 7,
      dayOfWeek: "Tuesday",
      color: "Red",
      metal: "Copper",
      gemstone: "Red Coral",
      meaning: "Energy, courage, aggression, war, surgery, accident, passion, siblings"
    },
    Mercury: {
      number: 4,
      symbol: "☿",
      element: "Earth",
      nature: "Neutral (benefic with benefics, malefic with malefics)",
      dignity: { exalted: "Virgo", debilitated: "Pisces" },
      exaltationDegree: 15,
      debilitationDegree: 15,
      moolaTrikona: "Virgo 15-20°",
      ownSigns: ["Gemini", "Virgo"],
      dasPeriod: 17,
      dayOfWeek: "Wednesday",
      color: "Green",
      metal: "Bronze",
      gemstone: "Emerald",
      meaning: "Communication, business, intellect, trade, youth, writing, nervous system"
    },
    Jupiter: {
      number: 5,
      symbol: "♃",
      element: "Fire",
      nature: "Great Benefic",
      dignity: { exalted: "Cancer", debilitated: "Capricorn" },
      exaltationDegree: 5,
      debilitationDegree: 5,
      moolaTrikona: "Sagittarius 0-10°",
      ownSigns: ["Sagittarius", "Pisces"],
      dasPeriod: 16,
      dayOfWeek: "Thursday",
      color: "Yellow/Gold",
      metal: "Gold",
      gemstone: "Yellow Sapphire",
      meaning: "Luck, wisdom, children, higher learning, spirituality, prosperity, guru, justice"
    },
    Venus: {
      number: 6,
      symbol: "♀",
      element: "Water",
      nature: "Benefic",
      dignity: { exalted: "Pisces", debilitated: "Virgo" },
      exaltationDegree: 27,
      debilitationDegree: 27,
      moolaTrikona: "Libra 0-15°",
      ownSigns: ["Taurus", "Libra"],
      dasPeriod: 20,
      dayOfWeek: "Friday",
      color: "White/Green",
      metal: "Copper",
      gemstone: "Diamond",
      meaning: "Love, marriage, beauty, arts, luxury, vehicles, spouse, pleasure, creativity"
    },
    Saturn: {
      number: 7,
      symbol: "♄",
      element: "Air",
      nature: "Malefic (becomes benefic in 3rd, 6th, 11th)",
      dignity: { exalted: "Libra", debilitated: "Aries" },
      exaltationDegree: 20,
      debilitationDegree: 20,
      moolaTrikona: "Aquarius 0-20°",
      ownSigns: ["Capricorn", "Aquarius"],
      dasPeriod: 19,
      dayOfWeek: "Saturday",
      color: "Black/Dark Blue",
      metal: "Iron",
      gemstone: "Blue Sapphire",
      meaning: "Karma, limitation, discipline, delay, disease, longevity, poverty, service, humility"
    }
  },

  // ==================== ZODIAC SIGNS ====================
  zodiacSigns: {
    Aries: {
      number: 1,
      symbol: "♈",
      element: "Fire",
      modality: "Movable",
      lord: "Mars",
      exaltation: "Sun 10°",
      debilitation: "-",
      enemy: "-",
      qualities: "Brave, ambitious, aggressive, impulsive",
      ruledHouses: "1st house"
    },
    Taurus: {
      number: 2,
      symbol: "♉",
      element: "Earth",
      modality: "Fixed",
      lord: "Venus",
      exaltation: "Moon 3°",
      debilitation: "-",
      enemy: "-",
      qualities: "Stable, practical, materialistic, stubborn",
      ruledHouses: "2nd house"
    },
    Gemini: {
      number: 3,
      symbol: "♊",
      element: "Air",
      modality: "Dual",
      lord: "Mercury",
      exaltation: "-",
      debilitation: "-",
      enemy: "-",
      qualities: "Communicative, curious, adaptable, scattered",
      ruledHouses: "3rd house"
    },
    Cancer: {
      number: 4,
      symbol: "♋",
      element: "Water",
      modality: "Movable",
      lord: "Moon",
      exaltation: "Jupiter 5°",
      debilitation: "Mars 28°",
      enemy: "-",
      qualities: "Emotional, nurturing, protective, moody",
      ruledHouses: "4th house"
    },
    Leo: {
      number: 5,
      symbol: "♌",
      element: "Fire",
      modality: "Fixed",
      lord: "Sun",
      exaltation: "-",
      debilitation: "-",
      enemy: "-",
      qualities: "Proud, creative, generous, dramatic",
      ruledHouses: "5th house"
    },
    Virgo: {
      number: 6,
      symbol: "♍",
      element: "Earth",
      modality: "Dual",
      lord: "Mercury",
      exaltation: "Mercury 15°",
      debilitation: "Venus 27°",
      enemy: "-",
      qualities: "Analytical, practical, critical, perfectionist",
      ruledHouses: "6th house"
    },
    Libra: {
      number: 7,
      symbol: "♎",
      element: "Air",
      modality: "Movable",
      lord: "Venus",
      exaltation: "Saturn 20°",
      debilitation: "Sun 10°",
      enemy: "-",
      qualities: "Balanced, diplomatic, social, indecisive",
      ruledHouses: "7th house"
    },
    Scorpio: {
      number: 8,
      symbol: "♏",
      element: "Water",
      modality: "Fixed",
      lord: "Mars",
      exaltation: "-",
      debilitation: "Moon 3°",
      enemy: "-",
      qualities: "Intense, secretive, powerful, obsessive",
      ruledHouses: "8th house"
    },
    Sagittarius: {
      number: 9,
      symbol: "♐",
      element: "Fire",
      modality: "Dual",
      lord: "Jupiter",
      exaltation: "-",
      debilitation: "-",
      enemy: "-",
      qualities: "Optimistic, philosophical, adventurous, reckless",
      ruledHouses: "9th house"
    },
    Capricorn: {
      number: 10,
      symbol: "♑",
      element: "Earth",
      modality: "Movable",
      lord: "Saturn",
      exaltation: "Mars 28°",
      debilitation: "Jupiter 5°",
      enemy: "-",
      qualities: "Ambitious, disciplined, responsible, pessimistic",
      ruledHouses: "10th house"
    },
    Aquarius: {
      number: 11,
      symbol: "♒",
      element: "Air",
      modality: "Fixed",
      lord: "Saturn",
      exaltation: "-",
      debilitation: "-",
      enemy: "-",
      qualities: "Humanitarian, innovative, detached, rebellious",
      ruledHouses: "11th house"
    },
    Pisces: {
      number: 12,
      symbol: "♓",
      element: "Water",
      modality: "Dual",
      lord: "Jupiter",
      exaltation: "Venus 27°",
      debilitation: "Mercury 15°",
      enemy: "-",
      qualities: "Compassionate, spiritual, artistic, escapist",
      ruledHouses: "12th house"
    }
  },

  // ==================== HOUSE MEANINGS ====================
  houses: {
    1: {
      name: "Lagna House / Self",
      governs: "Appearance, personality, constitution, health, vitality, general fortune, beginning of life",
      significator: "Ascendant sign and its lord",
      timing: "Childhood, up to age 30 approximately"
    },
    2: {
      name: "House of Wealth",
      governs: "Money, property, family, speech, inner resources, food, throat, eyes, nose",
      significator: "Venus",
      timing: "Financial matters, family relations"
    },
    3: {
      name: "House of Siblings",
      governs: "Siblings, courage, communication, short travels, arms, shoulders, hands, listening ability",
      significator: "Mercury",
      timing: "Youth, up to age 20"
    },
    4: {
      name: "House of Mother/Home",
      governs: "Mother, home, property, vehicles, heart, emotional security, real estate, farming",
      significator: "Moon",
      timing: "Later life, from age 50+, comfort in home"
    },
    5: {
      name: "House of Children",
      governs: "Children, creativity, romance, speculation, intelligence, past life merits, stomach",
      significator: "Sun",
      timing: "Youth, romantic period, children's life"
    },
    6: {
      name: "House of Health & Service",
      governs: "Health, disease, enemies, debts, litigation, workplace, servants, conflicts",
      significator: "Mars",
      timing: "Challenges, health issues, work problems"
    },
    7: {
      name: "House of Marriage",
      governs: "Spouse, marriage, partnerships, sexual relations, business partner, trading",
      significator: "Venus",
      timing: "Marriage age, partnerships"
    },
    8: {
      name: "House of Longevity",
      governs: "Longevity, death, inheritance, occult, hidden matters, insurance, transformation, mysteries",
      significator: "Saturn",
      timing: "Crisis periods, sudden changes, inheritance"
    },
    9: {
      name: "House of Dharma",
      governs: "Religion, philosophy, higher learning, guru, father, long travels, luck, moral values",
      significator: "Jupiter",
      timing: "Middle age, spiritual quest, higher learning"
    },
    10: {
      name: "House of Career",
      governs: "Career, profession, reputation, government, authority, public image, status",
      significator: "Saturn",
      timing: "Career development, middle age, peak career"
    },
    11: {
      name: "House of Gains",
      governs: "Income, wishes, friendships, elder siblings, social networks, profit, community",
      significator: "Jupiter",
      timing: "Financial gains, friendships, wishes fulfillment"
    },
    12: {
      name: "House of Losses",
      governs: "Expenditure, losses, foreign travel, spirituality, bed pleasures, hospitals, prisons, imagination",
      significator: "Jupiter",
      timing: "Old age, spiritual pursuits, foreign lands"
    }
  },

  // ==================== PLANET RELATIONSHIPS ====================
  planetRelationships: {
    Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"], neutral: ["Mercury"] },
    Moon: { friends: ["Sun", "Mercury"], enemies: [], neutral: ["Mars", "Jupiter", "Venus", "Saturn"] },
    Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"], neutral: ["Venus", "Saturn"] },
    Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"], neutral: ["Mars", "Jupiter", "Saturn"] },
    Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"], neutral: ["Saturn"] },
    Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"], neutral: ["Mars", "Jupiter"] },
    Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"], neutral: ["Jupiter"] }
  },

  // ==================== NAKSHATRAS (27 LUNAR MANSIONS) ====================
  nakshatras: [
    { name: "Ashwini", lord: "Ketu", sign: "Aries", pada: 1, deities: "Ashwini Kumars" },
    { name: "Bharani", lord: "Venus", sign: "Aries", pada: 1, deities: "Yama" },
    { name: "Krittika", lord: "Sun", sign: "Aries/Taurus", pada: 1, deities: "Agni" },
    { name: "Rohini", lord: "Moon", sign: "Taurus", pada: 1, deities: "Brahma" },
    { name: "Mrigashira", lord: "Mars", sign: "Taurus/Gemini", pada: 1, deities: "Soma" },
    { name: "Ardra", lord: "Rahu", sign: "Gemini", pada: 1, deities: "Rudra" },
    { name: "Punarvasu", lord: "Jupiter", sign: "Gemini/Cancer", pada: 1, deities: "Aditi" },
    { name: "Pushya", lord: "Saturn", sign: "Cancer", pada: 1, deities: "Brihaspati" },
    { name: "Ashlesha", lord: "Mercury", sign: "Cancer", pada: 1, deities: "Sarpa" },
    { name: "Magha", lord: "Ketu", sign: "Leo", pada: 1, deities: "Pitri" },
    { name: "Purva Phalguni", lord: "Venus", sign: "Leo", pada: 1, deities: "Aryaman" },
    { name: "Uttara Phalguni", lord: "Sun", sign: "Leo/Virgo", pada: 1, deities: "Bhaga" },
    { name: "Hasta", lord: "Moon", sign: "Virgo", pada: 1, deities: "Savitar" },
    { name: "Chitra", lord: "Mars", sign: "Virgo/Libra", pada: 1, deities: "Tvastr" },
    { name: "Swati", lord: "Rahu", sign: "Libra", pada: 1, deities: "Vayu" },
    { name: "Vishakha", lord: "Jupiter", sign: "Libra/Scorpio", pada: 1, deities: "Indra-Agni" },
    { name: "Anuradha", lord: "Saturn", sign: "Scorpio", pada: 1, deities: "Mitra" },
    { name: "Jyeshtha", lord: "Mercury", sign: "Scorpio", pada: 1, deities: "Indra" },
    { name: "Mula", lord: "Ketu", sign: "Sagittarius", pada: 1, deities: "Nirriti" },
    { name: "Purva Ashadha", lord: "Venus", sign: "Sagittarius", pada: 1, deities: "Apah" },
    { name: "Uttara Ashadha", lord: "Sun", sign: "Sagittarius/Capricorn", pada: 1, deities: "Vishvedeva" },
    { name: "Shravana", lord: "Moon", sign: "Capricorn", pada: 1, deities: "Vishnu" },
    { name: "Dhanishtha", lord: "Mars", sign: "Capricorn/Aquarius", pada: 1, deities: "Vasu" },
    { name: "Shatabhisha", lord: "Rahu", sign: "Aquarius", pada: 1, deities: "Varuna" },
    { name: "Purva Bhadrapada", lord: "Jupiter", sign: "Aquarius/Pisces", pada: 1, deities: "Aja Ekapad" },
    { name: "Uttara Bhadrapada", lord: "Saturn", sign: "Pisces", pada: 1, deities: "Ahir Budhanya" },
    { name: "Revati", lord: "Mercury", sign: "Pisces", pada: 1, deities: "Pushan" }
  ],

  // ==================== CALCULATION RULES ====================
  calculations: {
    planetaryStrength: {
      method: "Shadbala System - 6 types combined",
      scale: "0 to full strength (varies by planet type)",
      usage: "Determine planet effectiveness in chart interpretation"
    },
    atmakaraka: {
      definition: "Planet with highest degree (excluding nodes). Represents soul's primary lesson.",
      calculation: "Find planet with maximum degrees + minutes + seconds/60",
      significance: "Most important planet for karma and life direction"
    },
    vimsottariDasa: {
      definition: "120-year planetary period cycle based on Moon's nakshatra",
      calculation: "Birth Moon nakshatra determines starting planet and balance period",
      usage: "Predict major life events and timing"
    },
    dignity: {
      exaltation: "Planet performs at peak strength",
      debilitation: "Planet performs at lowest strength",
      own: "Planet in its ruled sign - good performance",
      moolatrikona: "Planet's most powerful placement range"
    }
  },

  // ==================== RELATIONSHIP ANALYSIS ====================
  relationshipAnalysis: {
    friendPlanets: "Support each other's significations. Positive combinations.",
    enemyPlanets: "Create tension and conflict. Negative combinations need management.",
    neutralPlanets: "Neither support nor oppose. Mixed results depending on other factors.",
    conjunctions: "Planets in same sign create blended energy",
    aspects: "Planets influencing from distance. 7th house aspect is strongest."
  },

  // ==================== DATA FORMAT EXAMPLES ====================
  dataFormatExample: {
    d1ChartFormat: {
      planet: "Sun",
      zodiac_sign_name: "Cancer",
      house_number: 1,
      degrees: 27,
      minutes: 12,
      seconds: 13,
      nakshatra_name: "Pushya",
      nakshatra_pada: 2,
      isRetro: false,
      longitude: 97.203611
    },
    shadbalaFormat: {
      planet: "Sun",
      sthana_bala: 42.5,
      kaala_bala: 30.2,
      dig_bala: 60.0,
      cheshta_bala: 45.0,
      drig_bala: 25.3,
      naisargika_bala: 60.0,
      total: 263.0
    },
    dasaFormat: {
      planet: "Venus",
      startDate: "2020-01-15",
      endDate: "2040-01-15",
      duration: "20 years",
      antarDasas: [
        { lord: "Venus", start: "2020-01-15", end: "2020-08-25" },
        { lord: "Sun", start: "2020-08-25", end: "2021-01-09" }
      ]
    }
  },

  // ==================== INTERPRETATION GUIDELINES ====================
  interpretationGuidelines: {
    d1Chart: "Foundation of all readings. Shows overall life blueprint and character.",
    d9Chart: "Marriage, partnerships, dharma (purpose). How D1 promise matures.",
    divisionals: "D2 finance, D7 marriage, D10 career, D12 spirituality - specialize in their areas",
    shadbala: "Planet strength. Strong planets give positive results, weak planets need support.",
    dasa: "Timing indicator. When events likely to occur and which planet is active.",
    combinations: "Always look at planet dignity, placement, aspects, and dasas together",
    dignity: "Exalted = strong, debilitated = weak, normal = medium. Always factor this.",
    relationships: "Friends help each other. Enemies create stress. Neutral = depends on context."
  }
};

/**
 * ============================================================================
 * HOW TO USE THIS DATA WITH ChatGPT
 * ============================================================================
 * 
 * Copy the entire ASTROLOGY_COMPLETE_REFERENCE object above and use these prompts:
 * 
 * 1. For chart analysis:
 *    "Based on this astrology reference, analyze this D1 chart: [paste chart data]"
 * 
 * 2. For planet interpretation:
 *    "Using this reference, what does Sun in Cancer in 1st house mean?"
 * 
 * 3. For strength analysis:
 *    "According to shadbala data [paste data], which planets are strongest?"
 * 
 * 4. For dasa timing:
 *    "Based on vimsottari dasa info, when are important life events likely?"
 * 
 * 5. For general reference:
 *    "Reference: [paste relevant section]. Question: [your question]"
 * 
 * ============================================================================
 */

// Export for use in browser
if (typeof window !== 'undefined') {
  window.ASTROLOGY_COMPLETE_REFERENCE = ASTROLOGY_COMPLETE_REFERENCE;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ASTROLOGY_COMPLETE_REFERENCE;
}
