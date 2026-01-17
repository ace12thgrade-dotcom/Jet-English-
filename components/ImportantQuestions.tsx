
import React, { useState, useMemo } from 'react';
import { IMPORTANT_QUESTIONS } from '../constants';
import { HelpCircle, ChevronDown, ChevronUp, Star, GraduationCap, Flame, Search, TrendingUp } from 'lucide-react';

const ImportantQuestions: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Paper 1' | 'English Literature'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    return IMPORTANT_QUESTIONS.filter(q => {
      const matchesFilter = filter === 'All' || q.subject === filter;
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           q.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => b.frequency - a.frequency); // Sort by highest frequency first
  }, [filter, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold serif-heading text-slate-800 tracking-tight">JET 2025 PYQ Vault</h2>
          <p className="text-slate-500 mt-1 font-medium">Most frequently asked questions from previous 15 years.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
           <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-64 shadow-sm"
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['All', 'Paper 1', 'English Literature'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f === 'English Literature' ? 'Lit' : f === 'Paper 1' ? 'P1' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.length > 0 ? filteredQuestions.map((iq) => (
          <div 
            key={iq.id} 
            className={`bg-white rounded-[2rem] border transition-all duration-300 ${expandedId === iq.id ? 'border-indigo-400 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
          >
            <button 
              onClick={() => setExpandedId(expandedId === iq.id ? null : iq.id)}
              className="w-full text-left p-6 md:p-8 flex items-start gap-5"
            >
              <div className={`p-4 rounded-2xl hidden md:flex shrink-0 ${iq.subject === 'Paper 1' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
                {iq.subject === 'Paper 1' ? <GraduationCap size={28} /> : <Flame size={28} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${iq.tag === 'PYQ' ? 'bg-amber-100 text-amber-700' : iq.tag === 'High Yield' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {iq.tag}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <TrendingUp size={12} /> Asked {iq.frequency} Times
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{iq.subject}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight pr-10 serif-heading">
                  {iq.question}
                </h3>
              </div>
              <div className={`p-2 rounded-full transition-colors ${expandedId === iq.id ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>
                {expandedId === iq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>
            
            {expandedId === iq.id && (
              <div className="px-6 pb-8 md:px-8 md:pb-12 md:pl-28 animate-in slide-in-from-top-4 duration-500">
                <div className="p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 relative shadow-inner">
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md">MASTER HINGLISH EXPLANATION</div>
                  <p className="text-slate-700 leading-relaxed text-lg md:text-xl font-medium">
                    {iq.answer}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <button className="text-sm font-black text-indigo-600 flex items-center gap-2 hover:underline tracking-tight">
                    <Star size={18} /> SAVE FOR REVISION
                  </button>
                  <button className="text-sm font-black text-slate-400 flex items-center gap-2 hover:text-slate-600 tracking-tight">
                    <HelpCircle size={18} /> ASK PROFESSOR TO EXPAND
                  </button>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-bold">No questions match your search.</p>
            <button onClick={() => {setSearchTerm(''); setFilter('All');}} className="text-indigo-600 font-black mt-2 underline">Clear all filters</button>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-4xl font-bold mb-6 serif-heading leading-tight">JET 2025 "Must-Know" Ranking</h3>
          <p className="text-indigo-100 opacity-80 mb-8 text-xl leading-relaxed">The frequency data is calculated based on JET, NET, and SET exams from 2010 to 2024. Questions with frequency > 10 are <span className="text-white font-black underline">Essential</span> for cracking the cutoff.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-xl">DOWNLOAD HINGLISH PDF</button>
            <button className="px-8 py-4 bg-indigo-600 border border-indigo-400/30 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all">START 2025 PREDICTOR TEST</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/2 bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default ImportantQuestions;
