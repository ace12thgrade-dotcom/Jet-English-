
export type Subject = 'Paper 1' | 'English Literature';

export interface Topic {
  id: string;
  title: string;
  subject: Subject;
  category: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StudyProgress {
  topicId: string;
  completed: boolean;
  score?: number;
}
