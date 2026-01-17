
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SYLLABUS_TOPICS } from '../constants';
import { Topic, Subject } from '../types';
import { Book, ChevronRight, Sparkles, Download, ArrowLeft, Search, Volume2, Pause, Play, Loader2, Info } from 'lucide-react';
import { generateNotes, generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

const NotesView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiNotes, setAiNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<Subject | 'All'>('All');
  
  // Audio state
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSegmentIndex, setPlayingSegmentIndex] = useState(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-stop audio if user navigates away or closes topic
  useEffect(() => {
    return () => handleStopAudio();
  }, []);

  const fetchAiNotes = async (topicTitle: string) => {
    setLoading(true);
    const content = await generateNotes(topicTitle);
    setAiNotes(content);
    setLoading(false);
  };

  const handleStopAudio = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    sourceNodesRef.current.clear();
    
    setIsPlaying(false);
    setPlayingSegmentIndex(-1);
    nextStartTimeRef.current = 0;
  };

  const handleListen = async (text: string) => {
    if (isPlaying) {
      handleStopAudio();
      return;
    }

    setIsPlaying(true);
    setIsAudioLoading(true);
    nextStartTimeRef.current = 0;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Smart chunking: Split by sentences or paragraphs to ensure the AI doesn't cut off
    // We limit chunks to ~500 chars to ensure fast and reliable TTS generation
    const chunks = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      for (let i = 0; i < chunks.length; i++) {
        if (signal.aborted) break;
        
        const chunkText = chunks[i].trim();
        if (!chunkText) continue;

        setPlayingSegmentIndex(i);
        
        // Fetch audio for the current chunk
        const base64Audio = await generateSpeech(chunkText);
        
        if (signal.aborted) break;
        if (!base64Audio) {
          console.warn("Skipping empty audio chunk");
          continue;
        }

        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        // Scheduling logic to prevent gaps and overlaps
        const now = ctx.currentTime;
        const startTime = Math.max(nextStartTimeRef.current, now + 0.05); // Small 50ms buffer
        source.start(startTime);
        nextStartTimeRef.current = startTime + audioBuffer.duration;

        sourceNodesRef.current.add(source);
        
        source.onended = () => {
          sourceNodesRef.current.delete(source);
          if (sourceNodesRef.current.size === 0 && i === chunks.length - 1) {
            setIsPlaying(false);
            setPlayingSegmentIndex(-1);
          }
        };

        // Turn off loading once the first sound starts
        if (i === 0) setIsAudioLoading(false);
        
        // Delay fetching the next chunk slightly to not overload the API
        // while the current one is still playing
        if (i < chunks.length - 1) {
            const timeUntilNext = (startTime - now) * 1000;
            // Wait until the current chunk is almost finished before fetching next to keep it "live"
            // but ensure we have it ready before the previous one ends.
            const waitTime = Math.max(0, timeUntilNext - 500); 
            await new Promise(r => setTimeout(r, Math.min(waitTime, 2000)));
        }
      }
    } catch (err) {
      console.error("Critical Audio Error:", err);
      handleStopAudio();
    } finally {
      if (!signal.aborted) {
        setIsAudioLoading(false);
      }
    }
  };

  const filteredTopics = useMemo(() => {
    return SYLLABUS_TOPICS.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || t.subject === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  if (selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300 pb-20">
        <button 
          onClick={() => { 
            setSelectedTopic(null); 
            setAiNotes(''); 
            handleStopAudio(); 
          }}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> Back to Syllabus Explorer
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${selectedTopic.subject === 'Paper 1' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                  {selectedTopic.subject}
                </span>
                <span className="px-3 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-full uppercase tracking-widest">
                  {selectedTopic.category}
                </span>
              </div>
              <h2 className="text-4xl font-bold serif-heading text-slate-800">{selectedTopic.title}</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 border border-slate-100 rounded-xl hover:border-indigo-100 transition-all font-bold text-sm"
              >
                <Download size={18} /> Export PDF
              </button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className={`p-6 rounded-2xl border mb-8 relative transition-all duration-500 ${isPlaying && playingSegmentIndex >= 0 ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/30 border-slate-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider m-0">
                  <Book size={16} className="text-indigo-600" /> Syllabus Overview
                </h3>
                <button 
                  onClick={() => handleListen(selectedTopic.content)}
                  disabled={isAudioLoading && !isPlaying}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isPlaying ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {isAudioLoading ? <Loader2 size={16} className="animate-spin" /> : isPlaying ? <Pause size={16} /> : <Volume2 size={16} />}
                  {isPlaying ? 'Stop Reading' : 'Listen Now'}
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{selectedTopic.content}</p>
            </div>
            
            {!aiNotes && !loading && (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles size={32} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2 text-xl">Generate SARA AI Notes</h4>
                <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto font-medium">Detailed Hinglish notes focusing on core theories, authors, and exam-oriented tips for JET 2025.</p>
                <button 
                  onClick={() => fetchAiNotes(selectedTopic.title)}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-extrabold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 mx-auto transform hover:-translate-y-1"
                >
                  <Sparkles size={20} /> Create Hinglish Notes
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-inner">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-indigo-400" />
                  </div>
                </div>
                <p className="font-bold text-slate-800 text-lg">AI Professor is writing your notes...</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">Organizing literary theories and Hinglish explanations</p>
              </div>
            )}

            {aiNotes && (
              <div className="mt-8 animate-in fade-in zoom-in duration-700">
                <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4">
                  <div className="flex items-center gap-3 text-indigo-600 font-extrabold">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Sparkles size={20} />
                    </div>
                    <span className="tracking-tight text-xl">SARA MASTER NOTES</span>
                  </div>
                  <button 
                    onClick={() => handleListen(aiNotes)}
                    disabled={isAudioLoading && !isPlaying}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${isPlaying ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {isAudioLoading ? <Loader2 size={16} className="animate-spin" /> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? 'Stop Tutor' : 'Listen Full Lecture'}
                  </button>
                </div>
                <div className={`bg-white p-8 md:p-12 rounded-[2rem] border-2 shadow-2xl transition-all duration-500 ${isPlaying ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
                  {isPlaying && (
                    <div className="mb-8 p-5 bg-indigo-600 text-white rounded-3xl flex items-center justify-between animate-in slide-in-from-top duration-500 shadow-lg shadow-indigo-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl animate-pulse">
                          <Volume2 size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">AI Audio Tutor</p>
                          <p className="text-base font-bold">Professor is explaining: {selectedTopic.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 h-6 items-end">
                        <div className="w-1.5 h-full bg-white/30 animate-pulse rounded-full"></div>
                        <div className="w-1.5 h-2/3 bg-white/60 animate-pulse [animation-delay:0.2s] rounded-full"></div>
                        <div className="w-1.5 h-full bg-white animate-pulse [animation-delay:0.4s] rounded-full"></div>
                        <div className="w-1.5 h-1/2 bg-white/50 animate-pulse [animation-delay:0.1s] rounded-full"></div>
                      </div>
                    </div>
                  )}
                  <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-slate-700 text-xl leading-relaxed font-medium font-serif">
                    {aiNotes}
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="font-bold">Exam Pro-Tip</p>
                        <p className="text-sm text-slate-400">Ye notes JET 2025 ke specific pattern par based hain. Technical terminology ko English mein yaad rakhein par understanding Hinglish se karein.</p>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold serif-heading text-slate-800 tracking-tight">Syllabus Explorer</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Deep-dive into Paper 1 and English Literature modules.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-80 shadow-sm font-medium"
            />
          </div>
          <div className="flex p-1.5 bg-slate-200/40 rounded-[1.25rem] backdrop-blur-sm">
            {['All', 'Paper 1', 'English Literature'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${activeFilter === f ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTopics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-300 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full transform hover:-translate-y-2 duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${topic.subject === 'Paper 1' ? 'bg-indigo-50 text-indigo-700' : 'bg-pink-50 text-pink-700'}`}>
                {topic.subject}
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${topic.difficulty === 'Easy' ? 'text-green-600 bg-green-50' : topic.difficulty === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'}`}>
                {topic.difficulty}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight serif-heading">
              {topic.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">{topic.category}</p>
            
            <p className="text-base text-slate-500 line-clamp-3 mb-8 flex-1 font-medium leading-relaxed">
              {topic.content}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
              <span className="text-xs font-extrabold text-indigo-600 flex items-center gap-2">
                <Sparkles size={16} /> SARA Enabled
              </span>
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">
                Explore <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
