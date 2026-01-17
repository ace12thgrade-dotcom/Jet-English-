
import { Topic, Quiz } from './types';

export interface ImportantQuestion {
  id: string;
  question: string;
  answer: string;
  subject: string;
  tag: 'High Yield' | 'PYQ' | 'Critical';
  frequency: number; 
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
3. Evaluation: CBCS, Formative vs. Summative assessment.
4. Platforms: SWAYAM, SWAYAM PRABHA, MOOCs.`,
    difficulty: 'Easy'
  },
  {
    id: 'p1-research',
    title: 'Research Aptitude',
    subject: 'Paper 1',
    category: 'Unit II',
    content: `Research Aptitude focuses on:
1. Methods: Experimental, Descriptive, Historical, Qualitative vs Quantitative.
2. Steps: Problem, Hypothesis, Design, Analysis.
3. Referencing: MLA 9th Edition vs APA.
4. Ethics: Plagiarism and Research integrity.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-comm',
    title: 'Communication',
    subject: 'Paper 1',
    category: 'Unit IV',
    content: `Communication Essentials:
1. Types: Verbal, Non-verbal, Inter-cultural, Group.
2. Barriers: Semantic, Psychological, Physical, Cultural.
3. Mass Media: Role of Media in society and Education.`,
    difficulty: 'Easy'
  },
  {
    id: 'p1-math-reasoning',
    title: 'Mathematical Reasoning',
    subject: 'Paper 1',
    category: 'Unit V',
    content: `Core Topics:
1. Number Series, Letter Series, Codes.
2. Math Aptitude: Fraction, Time & Distance, Ratio, Proportion.
3. Percentage, Profit & Loss, Interest, Discounting.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-logical',
    title: 'Logical Reasoning',
    subject: 'Paper 1',
    category: 'Unit VI',
    content: `Logic Fundamentals:
1. Understanding the structure of arguments.
2. Deductive and Inductive reasoning.
3. Venn Diagrams.
4. Indian Logic (Pramanas): Pratyaksha, Anumana, Upamana, Shabda.`,
    difficulty: 'Hard'
  },
  {
    id: 'p1-ict',
    title: 'ICT Basics',
    subject: 'Paper 1',
    category: 'Unit VIII',
    content: `ICT in Education:
1. General abbreviations and terminology.
2. Basics of Internet, Intranet, E-mail, Audio/Video-conferencing.
3. Digital initiatives in higher education.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-higher-edu',
    title: 'Higher Education System',
    subject: 'Paper 1',
    category: 'Unit X',
    content: `System Evolution:
1. Institutions of higher learning and education in ancient India.
2. Evolution of higher learning and research in Post-Independence India.
3. Regulatory bodies: UGC, AICTE, NAAC.
4. NEP 2020: National Education Policy.`,
    difficulty: 'Medium'
  },
  {
    id: 'p1-env',
    title: 'People & Environment',
    subject: 'Paper 1',
    category: 'Unit IX',
    content: `Development and Environment:
1. MDGs and SDGs (Sustainable Development Goals).
2. Human-environment interaction: Anthropogenic activities.
3. Environmental issues: Local, Regional, Global.
4. Natural hazards and disasters: Mitigation strategies.`,
    difficulty: 'Medium'
  },

  // --- ENGLISH LITERATURE (PAPER 2) ---
  {
    id: 'eng-chaucer',
    title: 'Age of Chaucer',
    subject: 'English Literature',
    category: 'Medieval Age',
    content: `Middle English Period:
1. Geoffrey Chaucer: The Canterbury Tales (General Prologue).
2. Contemporary Poets: William Langland (Piers Plowman), John Gower.
3. Social Context: Black Death, Peasant's Revolt, Hundred Years War.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-renaissance',
    title: 'Renaissance & Reformation',
    subject: 'English Literature',
    category: 'The Elizabethan Age',
    content: `Renaissance focus:
1. Humanism and the revival of learning.
2. Poetry: Sidney (Astrophel and Stella), Spenser (The Faerie Queene).
3. The Sonnet tradition: Petrarchan vs Shakespearean.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-drama-1',
    title: 'Elizabethan Drama',
    subject: 'English Literature',
    category: 'Drama',
    content: `Early Drama:
1. University Wits: Christopher Marlowe (Dr. Faustus), Thomas Kyd.
2. William Shakespeare: Tragedies, Comedies, Histories, Romances.
3. Theatre: The Globe, Rose, Swan.`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-metaphysical',
    title: 'Metaphysical Poetry',
    subject: 'English Literature',
    category: '17th Century',
    content: `The Wit & The Conceit:
1. John Donne: Religious and Secular poetry.
2. Other poets: George Herbert, Andrew Marvell, Henry Vaughan.
3. Characteristics: Conceits, paradox, argumentative style.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-milton',
    title: 'Milton & The Age of Dryden',
    subject: 'English Literature',
    category: 'Puritan to Restoration',
    content: `Epoch Transitions:
1. John Milton: Paradise Lost, Lycidas, Areopagitica.
2. John Dryden: Absalom and Achitophel, Mac Flecknoe.
3. Restoration Drama: Comedy of Manners (Congreve, Wycherley).`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-augustan',
    title: 'The Augustan Age',
    subject: 'English Literature',
    category: '18th Century',
    content: `Reason and Satire:
1. Alexander Pope: The Rape of the Lock, An Essay on Criticism.
2. Jonathan Swift: Gulliver's Travels, A Modest Proposal.
3. Rise of the Novel: Defoe, Richardson, Fielding, Sterne.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-romantic',
    title: 'The Romantic Age',
    subject: 'English Literature',
    category: '1798-1837',
    content: `The Return to Nature:
1. 1st Generation: Wordsworth (Lyrical Ballads), Coleridge.
2. 2nd Generation: Keats (Odes), Shelley, Byron.
3. Prose: Charles Lamb, William Hazlitt.
4. Fiction: Jane Austen, Walter Scott.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-victorian',
    title: 'The Victorian Age',
    subject: 'English Literature',
    category: '1837-1901',
    content: `Industrialization & Faith:
1. Poetry: Tennyson, Browning (Dramatic Monologue), Matthew Arnold.
2. Novel: Charles Dickens, Thomas Hardy, George Eliot, Brontë Sisters.
3. Pre-Raphaelites: D.G. Rossetti, Christina Rossetti.`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-modern',
    title: 'The Modern Age',
    subject: 'English Literature',
    category: '20th Century',
    content: `Fragmentation & Experiment:
1. Poetry: T.S. Eliot (The Waste Land), W.B. Yeats, W.H. Auden.
2. Fiction: Virginia Woolf (Stream of Consciousness), James Joyce.
3. Drama: G.B. Shaw, T.S. Eliot (Murder in the Cathedral).`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-postcolonial',
    title: 'Post-Colonial & Theory',
    subject: 'English Literature',
    category: 'Modern/Theory',
    content: `Identity & Resistance:
1. Key Thinkers: Edward Said (Orientalism), Homi Bhabha (Hybridity).
2. Authors: Chinua Achebe, Salman Rushdie, Toni Morrison.
3. Literary Theory: Structuralism, Post-structuralism, Feminism, Marxism.`,
    difficulty: 'Hard'
  },
  {
    id: 'eng-indian',
    title: 'Indian Writing in English',
    subject: 'English Literature',
    category: 'National Lit',
    content: `National Identity:
1. Trio: Mulk Raj Anand, R.K. Narayan, Raja Rao.
2. Poetry: Nissim Ezekiel, Kamala Das, A.K. Ramanujan.
3. Contemporary: Anita Desai, Vikram Seth, Arundhati Roy.`,
    difficulty: 'Medium'
  },
  {
    id: 'eng-american',
    title: 'American Literature',
    subject: 'English Literature',
    category: 'National Lit',
    content: `Themes of Democracy & Individualism:
1. Classics: Walt Whitman, Emily Dickinson, Mark Twain.
2. 20th Cent: Robert Frost, Ernest Hemingway, F. Scott Fitzgerald.
3. Drama: Arthur Miller, Eugene O'Neill, Tennessee Williams.`,
    difficulty: 'Medium'
  }
];

export const IMPORTANT_QUESTIONS: ImportantQuestion[] = [
  {
    id: 'iq1',
    question: 'Who coined the term "Metaphysical Poets"?',
    answer: 'Ye term "Samuel Johnson" ne apne work "Lives of the Most Eminent English Poets" mein use kiya tha. Unhone in poets ko "heterogeneous ideas yoked by violence together" ke liye criticise kiya tha.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 15
  },
  {
    id: 'iq2',
    question: 'What is the "Willing Suspension of Disbelief"?',
    answer: 'S.T. Coleridge ne "Biographia Literaria" (1817) mein ye term diya. Iska matlab hai ki supernatural stories padhte waqt hum thodi der ke liye logic side mein rakh dete hain taaki story enjoy kar sakein.',
    subject: 'English Literature',
    tag: 'High Yield',
    frequency: 12
  },
  {
    id: 'iq3',
    question: 'What is the "Oxford Movement"?',
    answer: 'Ye Victorian period ka ek religious movement tha jo 1833 mein start hua. Iska aim Church of England ko Catholic tradition se wapas jodna tha. Key leaders: John Henry Newman, John Keble, aur Edward Pusey.',
    subject: 'English Literature',
    tag: 'PYQ',
    frequency: 9
  },
  {
    id: 'iq4',
    question: 'Explain "Hamartia" in Aristotle\'s Poetics.',
    answer: 'Hamartia ka matlab hai "Tragic Flaw" ya "Error of Judgment". Aristotle kehte hain ki tragedy ka hero bilkul bura nahi hona chahiye, balki ek noble insaan hona chahiye jiski ek galti uske downfall ka kaaran banti hai.',
    subject: 'English Literature',
    tag: 'Critical',
    frequency: 18
  },
  {
    id: 'iq5',
    question: 'What are "Pramanas" in Indian Logic?',
    answer: 'Paper 1 ka important topic hai. Pramanas ka matlab hai "Means of Knowledge". Total 6 hote hain: Pratyaksha (Perception), Anumana (Inference), Upamana (Comparison), Shabda (Verbal Testimony), Arthapatti (Presumption), aur Anupalabdhi (Non-perception).',
    subject: 'Paper 1',
    tag: 'PYQ',
    frequency: 22
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
