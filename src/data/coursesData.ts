import { CourseDetail } from '../types/academy';

export const COURSES_DATA: CourseDetail[] = [
  {
    id: 'madni-qaida',
    title: 'Madni Qaida',
    arabicTitle: 'القاعدة المدنية',
    shortDesc: 'The essential step-by-step foundation course for kids and beginners to learn Arabic alphabets, phonetics, and correct pronunciation.',
    fullDesc: 'Madni Qaida is the fundamental stepping stone for anyone who wants to learn how to read the Holy Quran correctly from scratch. Our qualified teachers guide students letter-by-letter through articulation points (Makharij), compound letters (Murakkabat), vowel marks (Harakat), Tanween, and Sukoon with gentle patience.',
    duration: '2 to 3 Months',
    level: 'Beginner / Zero Foundation',
    suitableFor: 'Children (4+ years) & Adult Beginners',
    image: '/src/assets/images/girl_student_tablet_1790595268013.jpg',
    keyTopics: [
      'Identification of 29 Arabic Alphabets',
      'Accurate Makharij (origin points of each letter)',
      'Single and Joint letter identification (Murakkabat)',
      'Harakat (Zabar, Zer, Pesh) & Tanween',
      'Standing Harakat (Khari Zabar, Khari Zer, Ulta Pesh)',
      'Sukoon (Jazm) and Tashdeed (Shaddah) rules',
      'Madd rules and basic pause (Waqf) practice'
    ],
    learningOutcomes: [
      'Recognize and pronounce all Arabic letters with perfect articulation',
      'Join letters smoothly into words and phrases',
      'Ready to transition seamlessly into the Holy Quran with confidence',
      'Build a strong phonetic foundation that prevents lifelong recitation errors'
    ],
    highlights: [
      'Interactive digital Qaida slides on Zoom screen sharing',
      'One-to-one dedicated teacher attention',
      'Daily audio-visual repetition & homework guidance',
      'Specialized pedagogy for very young children'
    ]
  },
  {
    id: 'quran-reading',
    title: 'Quran Reading (Nazra)',
    arabicTitle: 'قراءة القرآن الكريم',
    shortDesc: 'Fluent and confident reading of the Holy Quran with correct pauses, punctuation, and smooth continuous flow.',
    fullDesc: 'The Quran Reading (Nazra) course is designed for students who have completed the Qaida or have basic letter recognition and want to read the entire Holy Quran with speed, rhythmic fluency, and precision. Students recite Surah by Surah under the direct supervision of an expert Qari.',
    duration: '6 to 12 Months',
    level: 'Elementary to Intermediate',
    suitableFor: 'Kids, Youths & Adults',
    image: '/src/assets/images/hero_quran_learning_1790595240873.jpg',
    keyTopics: [
      'Smooth sentence construction and continuous recitation',
      'Applying basic stopping signs (Waqf, Sakta, Qif)',
      'Recitation of short Surahs from Juz Amma to longer Surahs',
      'Correcting common rhythm hesitations and pronunciation slips',
      'Daily revision and recitation tracker',
      'Etiquettes (Adab) of holding and reciting the Holy Quran'
    ],
    learningOutcomes: [
      'Read any Surah in the Holy Quran independently without stumbling',
      'Complete the entire 30 Juz recitation from cover to cover',
      'Understand the visual symbols and signs in the standard Uthmani script',
      'Develop a daily habit of emotional connection with the words of Allah'
    ],
    highlights: [
      'Flexible pacing customized to each student\'s speed',
      'Weekly progress report card sent via WhatsApp',
      'Special celebratory completion certificate (Khatam-ul-Quran)',
      'Gentle, encouraging environment without pressure'
    ]
  },
  {
    id: 'quran-tajweed',
    title: 'Quran with Tajweed',
    arabicTitle: 'تجويد القرآن الكريم',
    shortDesc: 'Master the divine science of Tajweed rules, melodic intonation, and authentic recitation as recited by the Prophet (PBUH).',
    fullDesc: 'Tajweed literally means "beautification and mastery." Reciting the Holy Quran with Tajweed is an obligation for every Muslim. This specialized course covers the comprehensive theoretical and practical rules of Tajweed, including Noon Sakinah, Meem Sakinah, Ghunnah, Qalqalah, and the diverse lengths of Madd.',
    duration: '4 to 6 Months',
    level: 'Intermediate to Advanced',
    suitableFor: 'All Age Groups desiring Tajweed Mastery',
    image: '/src/assets/images/quran_tajweed_rehal_1790595280541.jpg',
    keyTopics: [
      'Deep dive into Makharij al-Huroof (17 specific throat/mouth points)',
      'Sifat al-Huroof (Characteristics: Hams, Jahr, Isti\'la, Qalqalah)',
      'Rules of Noon Sakinah & Tanween (Izhar, Idgham, Iqlab, Ikhfa)',
      'Rules of Meem Sakinah & Rules of Raa and Lam',
      'Types and durations of Madd (Asli, Muttasil, Munfasil, Lazim)',
      'Practical recitation of selected classical Surahs with audio feedback'
    ],
    learningOutcomes: [
      'Recite the Quran with melodious, authentic Arabic intonation',
      'Identify and name every Tajweed rule appearing on any Quranic page',
      'Prevent Jali (major) and Khafi (subtle) recitation errors',
      'Attain recitation elegance that moves hearts and deepens prayer'
    ],
    highlights: [
      'Teachers certified with Ijazah in Tajweed & Qira\'ah',
      'Side-by-side audio waveform & vocal pitch guidance',
      'Color-coded Tajweed Mushaf provided in digital format',
      'Both theory and practical drill in every session'
    ]
  },
  {
    id: 'hifz-ul-quran',
    title: 'Hifz-ul-Quran (Memorization)',
    arabicTitle: 'حفظ القرآن الكريم',
    shortDesc: 'Structured and systematic memorization of the Holy Quran (full or selected Surahs) with rigorous revision techniques.',
    fullDesc: 'Memorizing the words of Allah is among the highest honors in Islam. Faizan-e-Mustafa Online Academy provides an established, time-tested 3-pillar memorization methodology: Sabaq (new lesson), Sabqi (recent revision), and Manzil (cumulative long-term revision) to ensure what is memorized remains firmly locked in memory forever.',
    duration: '2 to 3 Years (Full Hifz) or Custom for Short Surahs',
    level: 'Dedicated Students',
    suitableFor: 'Committed Children, Teens & Adults',
    image: '/src/assets/images/teacher_online_class_1790595255599.jpg',
    keyTopics: [
      'Structured daily memorization target (1 to 2 pages or custom)',
      'The 3-stage memory technique (Sabaq, Sabqi, Manzil)',
      'Techniques for Mutashabihat (similar verses across Surahs)',
      'Breathing control and stamina building for continuous recitation',
      'Daily 1-on-1 testing and correction with a designated Hafiz tutor',
      'Monthly assessment with senior Academy Head of Tahfeez'
    ],
    learningOutcomes: [
      'Memorize selected Surahs or the complete 30 Juz with rock-solid retention',
      'Lead prayers (Salah & Taraweeh) with unshakeable confidence',
      'Instill supreme discipline, focus, and spiritual peace',
      'Achieve the supreme reward of Hifz promised in authentic Hadith'
    ],
    highlights: [
      'One-to-one dedicated Hafiz-e-Quran mentor',
      'Flexible schedules accommodating school or professional work',
      'Customized tracks: Juz 30 only, Surah Yaseen/Mulk/Kahf, or Full Hifz',
      'Continuous motivational coaching & parent updates'
    ]
  },
  {
    id: 'islamic-studies',
    title: 'Basic Islamic Studies',
    arabicTitle: 'التعليم والتربية الإسلامية',
    shortDesc: 'Essential Islamic knowledge: daily prayers, masnoon duas, Hadith, pillars of Iman, Seerah of Prophet Muhammad (PBUH) & ethics.',
    fullDesc: 'Equip your children and yourself with essential everyday Islamic knowledge and values. This course bridges recitation with understanding and character building. Students learn the practical execution of Taharah (wudu/ghusl), Salah with step-by-step meaning, 40 essential Masnoon Duas, moral stories of the Prophets, and core Islamic etiquette for modern life.',
    duration: '3 to 6 Months',
    level: 'All Levels',
    suitableFor: 'Children, Youths & Reverts / Adults',
    image: '/src/assets/images/girl_student_tablet_1790595268013.jpg',
    keyTopics: [
      'Wudu, Ghusl, and purification fundamentals',
      'Practical prayer (Salah) step-by-step with translation',
      'Daily Masnoon Duas (waking up, eating, sleeping, travelling, entering mosque)',
      'Six Kalimahs with authentic English/Urdu translation',
      'Beliefs of Islam (Tawheed, Angels, Revealed Books, Prophets, Akhirah)',
      'Seerah of the Beloved Prophet Muhammad (Peace & Blessings Be Upon Him)',
      'Islamic manners (Akhlaq), honoring parents, kindness, honesty'
    ],
    learningOutcomes: [
      'Perform daily Salah independently with correct postures and awareness',
      'Memorize and regularly practice essential day-to-day sunnah supplications',
      'Understand the fundamental core tenets and ethics of our Deen',
      'Build strong Muslim identity and resilience with wholesome character'
    ],
    highlights: [
      'Child-friendly engaging presentations and visual slide decks',
      'Interactive Q&A tackling contemporary questions',
      'Separate male and female teachers suited for all age groups',
      'Comprehensive digital booklet provided free of charge'
    ]
  }
];
