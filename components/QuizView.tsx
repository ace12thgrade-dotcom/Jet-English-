
import React, { useState } from 'react';
import { MOCK_QUIZZES } from '../constants';
import { Quiz, QuizQuestion } from '../types';
import { Check, X, ArrowLeft, Trophy, RotateCcw } from 'lucide-react';

const QuizView: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    if (selectedAnswer === activeQuiz!.questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuiz!.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsSubmitted(false);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished && activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold serif-heading mb-2">Quiz Completed!</h2>
          <p className="text-slate-500 mb-8">You scored {score} out of {activeQuiz.questions.length}</p>
          
          <div className="w-full bg-slate-100 h-4 rounded-full mb-12">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${(score / activeQuiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveQuiz(null)}
              className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to List
            </button>
            <button 
              onClick={() => startQuiz(activeQuiz)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setActiveQuiz(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} /> Quit Quiz
          </button>
          <div className="text-sm font-bold text-slate-400">
            QUESTION {currentQuestionIndex + 1} OF {activeQuiz.questions.length}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-8">{question.question}</h3>
          
          <div className="space-y-4 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group
                  ${selectedAnswer === idx ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'}
                  ${isSubmitted && idx === question.correctAnswer ? '!border-green-500 !bg-green-50 !text-green-900 !ring-0' : ''}
                  ${isSubmitted && selectedAnswer === idx && idx !== question.correctAnswer ? '!border-red-500 !bg-red-50 !text-red-900 !ring-0' : ''}
                `}
              >
                <span className="font-medium">{option}</span>
                {isSubmitted && idx === question.correctAnswer && <Check className="text-green-600" size={24} />}
                {isSubmitted && selectedAnswer === idx && idx !== question.correctAnswer && <X className="text-red-600" size={24} />}
              </button>
            ))}
          </div>

          {isSubmitted && (
            <div className="p-6 bg-slate-50 rounded-2xl mb-8 animate-in slide-in-from-bottom duration-300">
              <p className="text-sm font-bold text-slate-400 mb-1 uppercase">Explanation</p>
              <p className="text-slate-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          <div className="flex justify-end">
            {!isSubmitted ? (
              <button 
                disabled={selectedAnswer === null}
                onClick={submitAnswer}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={nextQuestion}
                className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-100"
              >
                {currentQuestionIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold serif-heading">Mock Exam Center</h2>
        <p className="text-slate-500">Practice with exam-pattern questions for JET 2025.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_QUIZZES.map(quiz => (
          <div key={quiz.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block ${quiz.subject === 'Paper 1' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                {quiz.subject}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h3>
              <p className="text-slate-500 mb-6">{quiz.questions.length} Questions • Detailed Explanations</p>
            </div>
            <button 
              onClick={() => startQuiz(quiz)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
            >
              Start Mock Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizView;
