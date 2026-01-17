
import { Topic, Quiz } from './types';

export interface ImportantQuestion {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tag: 'High Yield' | 'PYQ' | 'Critical';
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
3. Digital Platforms: SWAYAM (Free online courses), SWAYAM PRABHA (DTH channels), MOOCs.
4. Evaluation: CBCS (Choice Based Credit System), Formative vs. Summative assessment.`,
    difficulty: 'Easy'
  },
  {
    id: 'p1-research',
    title: 'Research Aptitude',
    subject: 'Paper 1',
    category: 'Unit II',
    content: `Research Aptitude focuses on:
1. Methods: Experimental (Variable control), Descriptive (Fact finding), Historical (Past events).
2. Qualitative vs Quantitative: Inductive vs Deductive approaches.
3. Steps: Problem, Hypothesis, Design, Collection, Analysis, Report.
4. Referencing: MLA 9th Edition is most vital for Literature students.
5. Ethics: Plagiarism detection and research integrity.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-logical',
    title: 'Logical Reasoning',
    subject: 'Paper 1',
    category: 'Unit VI',
    content: `Logical Reasoning involves:
1. Formal Fallacies: Mistakes in structure. Informal Fallacies: Content mistakes.
2. Indian Logic: Pramanas are key. Pratyaksha (Perception), Anumana (Inference), Upamana (Comparison).
3. Square of Opposition: A, E, I, O propositions and their relationships.`,
    difficulty: 'Hard'
  },

  // --- ENGLISH LITERATURE (PAPER 2) ---
  {
    id: 'eng-drama',
    title: 'Drama: Elizabethan to Modern',
    subject: 'English Literature',
    category: 'Module 1',
    content: `Detailed drama study:
1. Shakespeare: Tragic Flaw (Hamartia), Soliloquies, and Comic Relief.
2. Ben Jonson: Comedy of Humours (Blood, Phlegm, Yellow Bile, Black Bile).
3. Restoration: Comedy of Manners (Sexual intrigue, high-society wit).
4. Theatre of the Absurd: Samuel Beckett’s 'Waiting for Godot' (Life as meaningless).`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-criticism',
    title: 'Literary Criticism',
    subject: 'English Literature',
    category: 'Module 5',
    content: `Classical to New Criticism:
1. Aristotle: Poetics (Mimesis, Catharsis).
2. Wordsworth: Preface to Lyrical Ballads (Poetry as spontaneous overflow).
3. Arnold: Touchstone Method (Comparative analysis).
4. T.S. Eliot: Tradition and Individual Talent (Impersonality of poetry).`,
    difficulty: 'Hard'
  }
];

export const IMPORTANT_QUESTIONS: ImportantQuestion[] = [
  {
    id: 'iq1',
    question: 'What is "Catharsis" according to Aristotle?',
    answer: 'Aristotle ne "Poetics" mein Catharsis ka concept diya hai. Iska simple matlab hai "purgation" ya "cleansing" of emotions (pity and fear). Jab hum ek Tragedy dekhte hain, toh humein dar (fear) aur taras (pity) feel hota hai. Aristotle kehta hai ki tragedy dekhne ke baad humare ye emotions release ho jate hain aur humein ek mental relief milta hai. Ye audience ke emotional purification ke liye zaroori hota hai.',
    subject: 'English Literature',
    tag: 'Critical'
  },
  {
    id: 'iq2',
    question: 'Explain T.S. Eliot\'s "Objective Correlative".',
    answer: 'Eliot ke according, poetry mein emotions ko directly "feel" karwane ke liye ek set of objects, situations ya chain of events zaroori hote hain. Matlab, sirf "dukh" kehne se reader ko dukh feel nahi hoga; humein aise objects ya scene dikhane honge jo us emotion ko trigger karein. Hamlet mein Eliot ko laga ki Shakespeare ne objective correlative theek se use nahi kiya, isliye unhone Hamlet ko ek "Artistic Failure" kaha tha.',
    subject: 'English Literature',
    tag: 'High Yield'
  },
  {
    id: 'iq3',
    question: 'What is the "Square of Opposition" in Paper 1?',
    answer: 'Logical reasoning mein ye 4 types ke categorical propositions (A, E, I, O) ke beech ka relationship batata hai. 1. Contradictories (A and O, E and I): Agar ek true hai toh dusra pakka false hoga. 2. Contraries (A and E): Dono ek saath true nahi ho sakte, par dono false ho sakte hain. 3. Sub-contraries (I and O): Dono ek saath false nahi ho sakte, par true ho sakte hain. 4. Subalternation (A to I, E to O): Agar universal true hai toh particular bhi true hoga.',
    subject: 'Paper 1',
    tag: 'Critical'
  },
  {
    id: 'iq4',
    question: 'Discuss "Negative Capability" by John Keats.',
    answer: 'Ye concept Keats ne ek letter mein diya tha. Unka kehna tha ki ek bada writer woh hota hai jo "uncertainties" aur "mysteries" ke saath reh sake, bina "reason" ya "fact" ke peeche bhage. Matlab, Shakespeare jaise writers apni identity ko bhul kar characters mein kho jate hain aur unke mysteries ko accept karte hain, bajaye iske ki har cheez ko logic se solve karein.',
    subject: 'English Literature',
    tag: 'PYQ'
  },
  {
    id: 'iq5',
    question: 'What is "SWAYAM" and why is it important?',
    answer: 'SWAYAM ka full form hai "Study Webs of Active-Learning for Young Aspiring Minds". Ye India ka apna MOOC (Massive Open Online Course) platform hai. Iska aim "Access, Equity, aur Quality" hai. Isse students ghar baithe world-class education free mein le sakte hain. Iske 4 quadrants hote hain: Video lecture, reading material, self-assessment tests, aur online discussion forum.',
    subject: 'Paper 1',
    tag: 'High Yield'
  },
  {
    id: 'iq6',
    question: 'Analyze "The Touchstone Method" of Matthew Arnold.',
    answer: 'Arnold ne kaha ki kisi bhi nayi poem ki quality check karne ke liye humein purane great masters (like Homer, Dante, Milton, Shakespeare) ki lines se use compare karna chahiye. In "great lines" ko woh "Touchstones" kehta hai. Agar nayi poem un touchstones ke standard ko match karti hai, toh woh high-quality poetry hai. Ye ek comparative criticism ka method hai.',
    subject: 'English Literature',
    tag: 'Critical'
  },
  {
    id: 'iq7',
    question: 'What is "Deconstruction" in Literary Theory?',
    answer: 'Jacques Derrida ne ye term diya tha. Deconstruction ka matlab ye nahi ki text ko destroy karna, balki ye dikhana ki text ka koi "fixed" ya "ultimate" meaning nahi hota. Har text mein contradictions hote hain aur meaning hamesha "deferred" (postponed) hota rehta hai. Derrida kehta hai ki text ke bahaar kuch nahi hai ("There is nothing outside the text").',
    subject: 'English Literature',
    tag: 'High Yield'
  },
  {
    id: 'iq8',
    question: 'Explain "Validity" vs "Reliability" in Research.',
    answer: 'Research mein Reliability ka matlab hai "Consistency" (agar baar baar test karein toh result same aaye). Validity ka matlab hai "Accuracy" (kya hum wahi measure kar rahe hain jo humne socha tha?). Example: Agar aapka weighing scale har baar 5kg kam dikhata hai, toh woh reliable hai (kyunki result consistent hai) par valid nahi hai (kyunki woh accurate nahi hai).',
    subject: 'Paper 1',
    tag: 'Critical'
  },
  {
    id: 'iq9',
    question: 'Who are the "University Wits"?',
    answer: 'University Wits late 16th-century ke Oxford aur Cambridge graduates the jo popular playwrights bane. Inmein Christopher Marlowe, Robert Greene, Thomas Nashe (Cambridge) aur John Lyly, Thomas Lodge, George Peele (Oxford) shaamil the. Thomas Kyd bhi inka part mane jate hain (halanki unhone kisi university se graduation nahi kiya tha). Inhone Shakespeare ke liye rasta saaf kiya tha.',
    subject: 'English Literature',
    tag: 'PYQ'
  },
  {
    id: 'iq10',
    question: 'What is "Orientalism" according to Edward Said?',
    answer: 'Edward Said ki 1978 ki book "Orientalism" post-colonial studies ki foundation hai. Woh kehte hain ki Western scholars aur writers ne "East" (Orient) ko hamesha "Exotic", "Backward", aur "Irrational" dikhaya hai taaki woh "West" ko "Superior" prove kar sakein. Ye ek tarah ka intellectual tool tha imperialism ko justify karne ke liye.',
    subject: 'English Literature',
    tag: 'Critical'
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
