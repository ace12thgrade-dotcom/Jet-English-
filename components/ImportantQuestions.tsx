
import React, { useState } from 'react';
import { IMPORTANT_QUESTIONS } from '../constants';
import { HelpCircle, ChevronDown, ChevronUp, Star, GraduationCap, Flame } from 'lucide-react';

const ImportantQuestions: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Paper 1' | 'English Literature'>('All');

  const filteredQuestions = IMPORTANT_QUESTIONS.filter(q => 
    filter === 'All' || q.subject === filter
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold serif-heading text-slate-800">High-Yield Questions</h2>
          <p className="text-slate-500 mt-1">Focus on these concepts for maximum impact in JET 2025.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {['All', 'Paper 1', 'English Literature'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredQuestions.map((iq) => (
          <div 
            key={iq.id} 
            className={`bg-white rounded-3xl border transition-all duration-300 ${expandedId === iq.id ? 'border-indigo-300 shadow-xl shadow-indigo-50 ring-1 ring-indigo-100' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
          >
            <button 
              onClick={() => setExpandedId(expandedId === iq.id ? null : iq.id)}
              className="w-full text-left p-6 md:p-8 flex items-start gap-4"
            >
              <div className={`p-3 rounded-2xl hidden md:flex shrink-0 ${iq.subject === 'Paper 1' ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}>
                {iq.subject === 'Paper 1' ? <GraduationCap size={24} /> : <Flame size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${iq.tag === 'PYQ' ? 'bg-amber-100 text-amber-700' : iq.tag === 'High Yield' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {iq.tag}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{iq.subject}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-snug pr-8">{iq.question}</h3>
              </div>
              <div className="p-2 text-slate-300">
                {expandedId === iq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>
            
            {expandedId === iq.id && (
              <div className="px-6 pb-8 md:px-8 md:pb-10 md:pl-24 animate-in slide-in-from-top-2 duration-300">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                  <div className="absolute -top-3 left-6 px-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Answer</div>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {iq.answer}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                    <Star size={14} /> Mark for Final Revision
                  </button>
                  <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600">
                    <HelpCircle size={14} /> Discuss with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-4 serif-heading">Smart Recall System</h3>
          <p className="text-indigo-100 opacity-80 mb-6 text-lg">Our algorithm identifies these questions as high-probability for the 2025 session. Review them at least 3 times before the exam.</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all">Start Flashcards</button>
            <button className="px-6 py-3 bg-indigo-500/20 border border-indigo-400/30 text-white rounded-xl font-bold text-sm hover:bg-indigo-500/30 transition-all">Download Question Bank</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default ImportantQuestions;
