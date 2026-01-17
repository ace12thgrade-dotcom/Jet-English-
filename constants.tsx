
import { Topic, Quiz } from './types';

export interface ImportantQuestion {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tag: 'High Yield' | 'PYQ' | 'Critical';
  frequency: number; // Number of times asked in previous exams
}

export const SYLLABUS_TOPICS: Topic[] = [
  // --- PAPER 1 (GENERAL) ---
  {
    id: 'p1-teaching',
    title: 'Teaching Aptitude',
    subject: 'Paper 1',
    category: 'Unit I',
    content: `Teaching Aptitude covers:
1. Levels: Memory (Herbart), Understanding (Morrison), Reflective (Hunt).
2. Learner Characteristics: Individual differences, cognitive and emotional traits.
3. Digital Platforms: SWAYAM, SWAYAM PRABHA, MOOCs.
4. Evaluation: CBCS, Formative vs. Summative assessment.`,
    difficulty: 'Easy'
  },
  {
    id: 'p1-research',
    title: 'Research Aptitude',
    subject: 'Paper 1',
    category: 'Unit II',
    content: `Research Aptitude focuses on:
1. Methods: Experimental, Descriptive, Historical.
2. Qualitative vs Quantitative: Inductive vs Deductive approaches.
3. Steps: Problem, Hypothesis, Design, Collection, Analysis, Report.
4. Referencing: MLA 9th Edition is most vital for Literature students.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-logical',
    title: 'Logical Reasoning',
    subject: 'Paper 1',
    category: 'Unit VI',
    content: `Logical Reasoning involves:
1. Fallacies: Formal and Informal.
2. Indian Logic: Pramanas - Pratyaksha, Anumana, Upamana, Shabda.
3. Square of Opposition: A, E, I, O relationships.`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-drama',
    title: 'Drama: Elizabethan to Modern',
    subject: 'English Literature',
    category: 'Module 1',
    content: `Detailed drama study:
1. Shakespeare: Tragedies, Comedies, and Histories.
2. Ben Jonson: Comedy of Humours.
3. Modern: Theatre of the Absurd, Kitchen Sink Realism.`,
    difficulty: 'Hard'
  }
];

export const IMPORTANT_QUESTIONS: ImportantQuestion[] = [
  // --- LITERATURE: HIGH FREQUENCY ---
  {
    id: 'iq1',
    question: 'Who coined the term "Metaphysical Poets"?',
    answer: 'Ye term "Samuel Johnson" ne apne work "Lives of the Most Eminent English Poets" mein use kiya tha, specifically Cowley ke chapter mein. Unhone in poets (Donne, Herbert, etc.) ko criticise karte huye kaha tha ki ye "heterogeneous ideas ko yoked by violence together" karte hain. Matlab, ye do alag-alag ideas ko zabardasti ek saath jod dete hain (Conceits).',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 12
  },
  {
    id: 'iq2',
    question: 'What is "Hamartia" in Aristotelian Tragedy?',
    answer: 'Hamartia ka matlab hai "Tragic Flaw" ya "Error of Judgment". Aristotle kehta hai ki tragedy ka hero bilkul bura nahi hona chahiye, balki ek acha insaan hona chahiye jiski ek choti si galti (Hamartia) uske downfall ka kaaran banti hai. Jaise Hamlet ki "Procrastination" ya Othello ki "Jealousy".',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 15
  },
  {
    id: 'iq3',
    question: 'Explain the "Intentional Fallacy".',
    answer: 'Ye concept W.K. Wimsatt aur Monroe Beardsley ne "The Verbal Icon" (1954) mein diya tha. Inka kehna hai ki kisi poem ka meaning author ke "intention" (jo woh kehna chahta tha) se judge karna galat hai. Text apne aap mein complete hota hai. Author ka intention "neither available nor desirable" hai text ko samajhne ke liye.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 9
  },
  {
    id: 'iq4',
    question: 'Who are the "Lake Poets"?',
    answer: 'Ye teen poets hain: William Wordsworth, Samuel Taylor Coleridge, aur Robert Southey. Ye England ke "Lake District" mein rehte the, isliye Francis Jeffrey ne inhe "Lake School" kaha tha. Ye Romantic movement ke early phase ke pillars hain.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 11
  },
  {
    id: 'iq5',
    question: 'What is the "Willing Suspension of Disbelief"?',
    answer: 'S.T. Coleridge ne "Biographia Literaria" (1817) mein ye term diya tha. Iska matlab hai ki jab hum koi supernatural story padhte hain (jaise "The Ancient Mariner"), toh hum thodi der ke liye apne "logic" ko side mein rakh dete hain taaki hum us story ka maza le sakein. Hum jante hain ki woh sach nahi hai, par hum "believe" karne ka dikhawa karte hain.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 14
  },
  {
    id: 'iq6',
    question: 'Discuss "Gynocriticism" by Elaine Showalter.',
    answer: 'Showalter ne "A Literature of Their Own" mein ye concept diya. Iska matlab hai "Women as Writers" ki study karna. Pehle feminism "Women as Readers" (misogyny in male texts) par focus karta tha, par Gynocriticism female experience, female language, aur female literary history ki baat karta hai.',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 8
  },
  {
    id: 'iq7',
    question: 'Who are the "Cavalier Poets"?',
    answer: 'Ye woh poets the jo King Charles I ko support karte the English Civil War ke time. Inki poetry light, graceful aur "Carpe Diem" (Seize the day) theme par hoti thi. Main poets: Robert Herrick, Richard Lovelace, Sir John Suckling, aur Thomas Carew.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 7
  },
  {
    id: 'iq8',
    question: 'What is "Egotistical Sublime"?',
    answer: 'John Keats ne ye term William Wordsworth ke liye use kiya tha. Keats ka manna tha ki Wordsworth apni poetry mein hamesha apni "ego" ya apni "personality" ko itna upar rakhte hain ki har cheez unke hi perspective se dikhti hai. Ye Keats ke "Negative Capability" ke bilkul opposite hai.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 6
  },
  {
    id: 'iq9',
    question: 'Explain "Hegemony" by Antonio Gramsci.',
    answer: 'Gramsci ek Marxist thinker the. Unhone kaha ki ruling class sirf "Force" (police/army) se rule nahi karti, balki "Consent" se bhi karti hai. Woh culture, education aur media ke zariye apni ideologies ko "Common Sense" bana dete hain. Is mental dominance ko hi "Hegemony" kehte hain.',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 10
  },
  {
    id: 'iq10',
    question: 'What is "Sprung Rhythm"?',
    answer: 'Gerard Manley Hopkins ne ye concept diya tha. Traditional poetry mein syllables fix hote hain, par Sprung Rhythm mein "Stressed syllables" fix hote hain par unstressed syllables vary kar sakte hain. Isse poetry mein ek natural, speech-like rhythm aati hai.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 5
  },

  // --- PAPER 1: HIGH FREQUENCY ---
  {
    id: 'iq11',
    question: 'What is "Action Research"?',
    answer: 'Action Research ka main purpose hota hai "Immediate solution to a local problem". Ye cycles mein hota hai: Plan -> Act -> Observe -> Reflect. Ye aksar teachers classroom problems solve karne ke liye use karte hain. Iska aim theory banana nahi, balki practice improve karna hota hai.',
    subject: 'Paper 1',
    tag: 'PYQ',
    frequency: 18
  },
  {
    id: 'iq12',
    question: 'Difference between "Formative" and "Summative" Evaluation.',
    answer: 'Formative evaluation padhai ke "dauran" hota hai (jaise unit tests, quizzes) taaki student ko feedback mil sake. Summative evaluation course ke "end" mein hota hai (jaise final exams) taaki final grade ya certificate diya ja sake. Formative improvement ke liye hai, Summative judgment ke liye.',
    subject: 'Paper 1',
    tag: 'High Yield',
    frequency: 20
  },
  {
    id: 'iq13',
    question: 'What are "Pramanas" in Indian Logic?',
    answer: 'Pramanas ka matlab hai "Means of Knowledge" (Gyan lene ke tareeke). Total 6 hote hain: 1. Pratyaksha (Perception - aankhon se dekhna), 2. Anumana (Inference - dhuye se aag ka andaza), 3. Upamana (Comparison), 4. Shabda (Verbal Testimony - expert ki baat), 5. Arthapatti (Presumption), 6. Anupalabddhi (Non-perception).',
    subject: 'Paper 1',
    tag: 'Critical',
    frequency: 16
  },
  {
    id: 'iq14',
    question: 'Explain "Types of Fallacies" (Ad Hominem, etc.).',
    answer: 'Fallacy matlab argument mein galti. 1. Ad Hominem: Jab aap argument ke bajaye us insaan par attack karte ho. 2. Slippery Slope: Jab aap kehte ho ki ek choti cheez se disaster ho jayega. 3. Straw Man: Jab aap dusre ke argument ko distort kar dete ho taaki use harana easy ho.',
    subject: 'Paper 1',
    tag: 'High Yield',
    frequency: 13
  },
  {
    id: 'iq15',
    question: 'What is "CBCS" in Higher Education?',
    answer: 'Full form: Choice Based Credit System. Ismein students ko flexibility milti hai ki woh apni pasand ke "Elective" courses choose kar sakein. Ismein grades "Credits" ke form mein milte hain. Iska aim education ko student-centric banana aur inter-disciplinary learning ko promote karna hai.',
    subject: 'Paper 1',
    tag: 'PYQ',
    frequency: 14
  },
  {
    id: 'iq16',
    question: 'What is "Inductive" vs "Deductive" Reasoning?',
    answer: 'Inductive: Bottom-Up. Hum specific facts se start karte hain aur general theory banate hain (P-S-G: Particular to General). Deductive: Top-Down. Hum ek general theory se start karte hain aur specific result nikalte hain (G-S-P: General to Particular). Science aksar inductive se start hota hai.',
    subject: 'Paper 1',
    tag: 'Critical',
    frequency: 17
  },
  {
    id: 'iq17',
    question: 'Explain "Sampling" in Research (Probability vs Non-probability).',
    answer: 'Sampling matlab puri population mein se kuch logon ko choose karna. Probability sampling (Random): Har kisi ka chance equal hota hai (e.g., Simple Random, Stratified). Non-probability: Researcher apni marzi ya convenience se choose karta hai (e.g., Snowball, Quota). Random sampling results ko generalize karne ke liye zaroori hai.',
    subject: 'Paper 1',
    tag: 'High Yield',
    frequency: 15
  },
  {
    id: 'iq18',
    question: 'What is "MOOCs" and "SWAYAM PRABHA"?',
    answer: 'MOOCs: Massive Open Online Courses. SWAYAM PRABHA ek group hai 40 DTH channels ka jo 24/7 educational programs dikhate hain. Ye un areas ke liye hai jahan internet acha nahi hai. Iska content GSAT-15 satellite se broadcast hota hai.',
    subject: 'Paper 1',
    tag: 'PYQ',
    frequency: 12
  },
  {
    id: 'iq19',
    question: 'Define "Positivism" vs "Post-Positivism".',
    answer: 'Positivism: Ye manta hai ki reality objective hai aur use science/logic se measure kiya ja sakta hai (Quantitative). Post-Positivism: Ye manta hai ki humari observations biased ho sakti hain aur reality ko puri tarah samajhna mushkil hai (Qualitative/Subjective).',
    subject: 'Paper 1',
    tag: 'Critical',
    frequency: 9
  },
  {
    id: 'iq20',
    question: 'What is "Referencing" (APA vs MLA)?',
    answer: 'Referencing matlab source ka credit dena. MLA (Modern Language Association): Ismein "Author-Page Number" format hota hai (e.g., Wordsworth 25). Ye Humanities/Literature mein chalta hai. APA (American Psychological Association): Ismein "Author-Year" format hota hai (e.g., Smith, 2020). Ye Social Sciences mein chalta hai.',
    subject: 'Paper 1',
    tag: 'High Yield',
    frequency: 11
  },

  // --- ADDITIONAL LITERATURE (RAPID ROUND) ---
  {
    id: 'iq21',
    question: 'Who is the author of "The Waste Land"?',
    answer: 'T.S. Eliot (1922). Ye 5 parts mein hai: 1. The Burial of the Dead, 2. A Game of Chess, 3. The Fire Sermon, 4. Death by Water, 5. What the Thunder Said. Iska dedication Ezra Pound ko hai ("il miglior fabbro" - the better craftsman).',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 19
  },
  {
    id: 'iq22',
    question: 'What is "Stream of Consciousness"?',
    answer: 'Ye term William James ne diya tha, par literature mein ise Dorothy Richardson, Virginia Woolf aur James Joyce ne popular kiya. Ismein character ke thoughts bina kisi filter ya structure ke "flow" karte dikhaye jate hain, jaise humara dimaag kaam karta hai.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 13
  },
  {
    id: 'iq23',
    question: 'Discuss "Post-colonialism" by Homi Bhabha.',
    answer: 'Bhabha ne key terms diye hain: 1. Mimicry (colonized insaan colonizer ko copy karta hai), 2. Hybridity (do cultures ka mix), 3. Ambivalence. Unka focus cultural identity aur colonizer-colonized ke complex relationship par hota hai.',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 7
  },
  {
    id: 'iq24',
    question: 'Who are the "Graveyard Poets"?',
    answer: '18th-century poets jo maut (death), kabr (graveyards), aur life ki short-term nature par likhte the. Main example: Thomas Gray ("Elegy Written in a Country Churchyard"). Inhone Romanticism ka rasta khola.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 9
  },
  {
    id: 'iq25',
    question: 'What is "New Criticism"?',
    answer: '20th-century movement jo sirf "Text" par focus karti hai. Ye author ki biography ya history ko ignore karti hai aur "Close Reading" par zor deti hai. Key terms: Irony, Paradox, Ambiguity, aur Tension.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 12
  },
  {
    id: 'iq26',
    question: 'Define "Metafiction".',
    answer: 'Metafiction woh fiction hai jo baar-baar reader ko yaad dilata hai ki woh ek "kahani" padh raha hai. Ye self-conscious hota hai aur writing process ko hi story ka part bana deta hai. Example: Italo Calvino ki "If on a winter\'s night a traveler".',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 4
  },
  {
    id: 'iq27',
    question: 'Who is "The Father of English Poetry"?',
    answer: 'Geoffrey Chaucer. Ye unhe John Dryden ne kaha tha. Unka sabse famous work "The Canterbury Tales" hai jo Middle English mein likha gaya hai.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 15
  },
  {
    id: 'iq28',
    question: 'What is "Inscape" and "Instress"?',
    answer: 'G.M. Hopkins ke terms hain. Inscape matlab har cheez ki unique internal design ya identity. Instress matlab woh energy ya force jo us Inscape ko humare dimaag tak pahunchati hai. Ye God ki presence ko nature mein dikhane ka tareeka hai.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 5
  },
  {
    id: 'iq29',
    question: 'Explain "Structuralism" (Signifier/Signified).',
    answer: 'Ferdinand de Saussure ne ye diya. Signifier matlab "Sound/Word" (jaise DOG bolna). Signified matlab us word se juda "Concept" (kutte ki image). In dono ke beech ka link "Arbitrary" hota hai (koi logical reason nahi hai ki use DOG hi kyun kahein).',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 11
  },
  {
    id: 'iq30',
    question: 'Who are the "Pre-Raphaelite Brotherhood"?',
    answer: '1848 mein ek group bana painters aur poets ka (D.G. Rossetti, Christina Rossetti, William Morris). Ye log Raphael se pehle ki medieval art ki "simplicity" aur "detail" ko wapas lana chahte the. Inki poetry bahut "sensuous" aur colourful hoti thi.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 8
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q-p1-full',
    title: 'Paper 1 Comprehensive Mock',
    subject: 'Paper 1',
    questions: [
      {
        id: 'qp1',
        question: 'Which research method is most suitable for studying "The impact of ICT on student learning in rural areas"?',
        options: ['Historical', 'Experimental', 'Descriptive Survey', 'Ex-post Facto'],
        correctAnswer: 2,
        explanation: 'Descriptive Survey is best for assessing current status and trends in a specific population.'
      }
    ]
  }
];
