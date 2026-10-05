// Word and Pronunciation Practice Service

export const CURATED_PRACTICE_WORDS = [
  // English Words
  {
    id: 'pw_en_1',
    word: 'Confidence',
    language: 'en',
    syllables: 'con · fi · dence',
    phonetic: '/ˈkɒn.fɪ.dəns/',
    definition: 'A feeling of self-assurance arising from an appreciation of one’s abilities.',
    tip: 'Place stress on the first syllable: CON-fi-dence.',
    difficulty: 'Intermediate'
  },
  {
    id: 'pw_en_2',
    word: 'Fluency',
    language: 'en',
    syllables: 'flu · en · cy',
    phonetic: '/ˈfluː.ən.si/',
    definition: 'The ability to speak or read smoothly, easily, and accurately.',
    tip: 'Keep the "u" smooth and flow seamlessly into "en-cy".',
    difficulty: 'Intermediate'
  },
  {
    id: 'pw_en_3',
    word: 'Persevere',
    language: 'en',
    syllables: 'per · se · vere',
    phonetic: '/ˌpɜː.sɪˈvɪər/',
    definition: 'To continue in a course of action in spite of difficulty or lack of success.',
    tip: 'The final syllable "vere" sounds like "veer".',
    difficulty: 'Advanced'
  },
  {
    id: 'pw_en_4',
    word: 'Curiosity',
    language: 'en',
    syllables: 'cu · ri · os · i · ty',
    phonetic: '/ˌkjʊə.riˈɒs.ə.ti/',
    definition: 'A strong desire to know or learn something new.',
    tip: 'Notice the five gentle syllables: cu-ri-OS-i-ty.',
    difficulty: 'Intermediate'
  },
  {
    id: 'pw_en_5',
    word: 'Whisper',
    language: 'en',
    syllables: 'whis · per',
    phonetic: '/ˈwɪs.pər/',
    definition: 'To speak very softly using one’s breath rather than the vocal cords.',
    tip: 'Soft gentle start with "wh".',
    difficulty: 'Beginner'
  },
  {
    id: 'pw_en_6',
    word: 'Breeze',
    language: 'en',
    syllables: 'breeze',
    phonetic: '/briːz/',
    definition: 'A gentle and refreshing wind.',
    tip: 'Single smooth syllable with a soft vibrating "z" finish.',
    difficulty: 'Beginner'
  },
  {
    id: 'pw_en_7',
    word: 'Magnificent',
    language: 'en',
    syllables: 'mag · nif · i · cent',
    phonetic: '/mæɡˈnɪf.ɪ.sənt/',
    definition: 'Extremely beautiful, elaborate, or impressive.',
    tip: 'Stress falls on the second syllable: mag-NIF-i-cent.',
    difficulty: 'Advanced'
  },
  {
    id: 'pw_en_8',
    word: 'Ecosystem',
    language: 'en',
    syllables: 'e · co · sys · tem',
    phonetic: '/ˈiː.kəʊˌsɪs.təm/',
    definition: 'A biological community of interacting organisms and their physical environment.',
    tip: 'Start with a clear long "E" sound.',
    difficulty: 'Advanced'
  },

  // Tamil Words
  {
    id: 'pw_ta_1',
    word: 'நம்பிக்கை',
    transliteration: 'Nambikkai',
    language: 'ta',
    syllables: 'நம் · பிக் · கை',
    phonetic: 'nam-bik-kai',
    definition: 'Confidence, faith, and belief in oneself.',
    tip: 'வலியொலி ‘க்’ எழுத்தோடு அழுத்தமாக உச்சரிக்கவும்.',
    difficulty: 'Beginner'
  },
  {
    id: 'pw_ta_2',
    word: 'வாசிப்பு',
    transliteration: 'Vaasippu',
    language: 'ta',
    syllables: 'வா · சிப் · பு',
    phonetic: 'vaa-sip-pu',
    definition: 'The act of reading and absorbing knowledge.',
    tip: 'நெடில் ‘வா’ நீட்டி உச்சரிக்க வேண்டும்.',
    difficulty: 'Beginner'
  },
  {
    id: 'pw_ta_3',
    word: 'செழுமை',
    transliteration: 'Sezhumai',
    language: 'ta',
    syllables: 'செ · ழு · மை',
    phonetic: 'se-zhu-mai',
    definition: 'Richness, prosperity, and fullness of thought.',
    tip: 'சிறப்பு ‘ழ’ கரத்தை நாக்கை உள்வளைத்து மென்மையாக ஒலிக்கவும்.',
    difficulty: 'Intermediate'
  },
  {
    id: 'pw_ta_4',
    word: 'மகிழ்ச்சி',
    transliteration: 'Magizhchi',
    language: 'ta',
    syllables: 'ம · கிழ் ச் · சி',
    phonetic: 'ma-gizh-chi',
    definition: 'Joy, delight, and cheerful happiness.',
    tip: '‘கிழ்’ ழகர ஒலியைத் தெளிவாக உச்சரிக்கவும்.',
    difficulty: 'Intermediate'
  },
  {
    id: 'pw_ta_5',
    word: 'புத்துணர்ச்சி',
    transliteration: 'Puththunarchchi',
    language: 'ta',
    syllables: 'புத் · து · ணர்ச் · சி',
    phonetic: 'puth-thu-nar-chchi',
    definition: 'Refreshing rejuvenation of mind and spirit.',
    tip: 'டண்ணகர ‘ணர்’ மெய்யெழுத்தை அழுத்தமாக ஒலிக்கவும்.',
    difficulty: 'Advanced'
  },
  {
    id: 'pw_ta_6',
    word: 'விழுமியங்கள்',
    transliteration: 'Vizhumiyangal',
    language: 'ta',
    syllables: 'வி · ழு · மி · யங் · கள்',
    phonetic: 'vi-zhu-mi-yang-gal',
    definition: 'Cherished moral values and guiding principles.',
    tip: 'ஐந்து அசைகளையும் சீராகப் பிரித்துப் பழகவும்.',
    difficulty: 'Advanced'
  }
];

export function getPracticeWords(language = 'all') {
  if (!language || language === 'all') return CURATED_PRACTICE_WORDS;
  return CURATED_PRACTICE_WORDS.filter(w => w.language === language);
}
