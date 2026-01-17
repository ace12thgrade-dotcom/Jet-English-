
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SYLLABUS_TOPICS } from '../constants';
import { Topic, Subject } from '../types';
import { Book, ChevronRight, Sparkles, Download, ArrowLeft, Search, Volume2, Pause, Play, Loader2, Info, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { generateNotes, generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

const NotesView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiNotes, setAiNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyError, setIsKeyError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<Subject | 'All'>('All');
  
  // Audio state
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => handleStopAudio();
  }, []);

  const handleFixConnection = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setError(null);
      setIsKeyError(false);
      if (selectedTopic) fetchAiNotes(selectedTopic.title);
    }
  };

  const fetchAiNotes = async (topicTitle: string) => {
    setLoading(true);
    setError(null);
    setIsKeyError(false);
    try {
      const content = await generateNotes(topicTitle);
      setAiNotes(content);
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('key') || err.message?.toLowerCase().includes('not found')) {
        setIsKeyError(true);
        setError("AI connection needs setup. Please click 'Fix Connection'.");
      } else {
        setError("Failed to call Gemini API. Check internet & try again.");
      }
    } finally {
      setLoading(false);
    }
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
    setIsAudioLoading(false);
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

    // Improved Chunking: Group sentences into larger blocks (~1200 chars) to reduce API overhead
    const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
    const blocks: string[] = [];
    let currentBlock = "";
    
    for (const s of sentences) {
      if ((currentBlock + s).length > 1200) {
        blocks.push(currentBlock);
        currentBlock = s;
      } else {
        currentBlock += s;
      }
    }
    if (currentBlock) blocks.push(currentBlock);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      // Parallel Pre-fetching Logic
      const audioBufferQueue: AudioBuffer[] = [];
      let fetchIndex = 0;
      let isFetching = false;

      const fetchNext = async () => {
        if (fetchIndex >= blocks.length || signal.aborted || isFetching) return;
        isFetching = true;
        try {
          const base64Audio = await generateSpeech(blocks[fetchIndex]);
          if (base64Audio && !signal.aborted) {
            const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
            audioBufferQueue.push(buffer);
            fetchIndex++;
          }
        } finally {
          isFetching = false;
        }
      };

      // Initial Fetch
      await fetchNext();
      setIsAudioLoading(false);

      let playIndex = 0;
      while (playIndex < blocks.length && !signal.aborted) {
        // Start fetching next while playing current
        if (fetchIndex < blocks.length && audioBufferQueue.length < 2) {
          fetchNext(); 
        }

        // If we don't have the buffer yet, wait for it
        if (audioBufferQueue.length === 0) {
          if (fetchIndex >= blocks.length) break; // Done
          await new Promise(r => setTimeout(r, 100));
          continue;
        }

        const buffer = audioBufferQueue.shift()!;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        const now = ctx.currentTime;
        // Schedule precisely back-to-back
        const startTime = Math.max(nextStartTimeRef.current, now + 0.01);
        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;

        sourceNodesRef.current.add(source);
        source.onended = () => sourceNodesRef.current.delete(source);

        playIndex++;
        
        // Wait slightly less than the duration to schedule the next one seamlessly
        const waitTime = (startTime - now + buffer.duration) * 1000 - 100;
        await new Promise(r => setTimeout(r, Math.max(0, waitTime)));
      }

      // Final check to turn off playing state after queue clears
      const checkEnd = setInterval(() => {
        if (sourceNodesRef.current.size === 0) {
          setIsPlaying(false);
          clearInterval(checkEnd);
        }
      }, 500);

    } catch (err) {
      console.error("Audio Playback Error:", err);
      handleStopAudio();
    } finally {
      if (!signal.aborted) setIsAudioLoading(false);
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
            setError(null);
            setIsKeyError(false);
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
          </div>

          <div className="prose prose-slate max-w-none">
            <div className={`p-6 rounded-2xl border mb-8 relative transition-all duration-500 ${isPlaying ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/30 border-slate-100'}`}>
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
            
            {error && (
              <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-700">
                <AlertCircle size={24} className="shrink-0" />
                <div className="flex-1">
                  <p className="font-bold">{isKeyError ? 'Connection Issue' : 'Error generating notes'}</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
                {isKeyError ? (
                  <button 
                    onClick={handleFixConnection}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                  >
                    <Key size={14} /> Fix Connection
                  </button>
                ) : (
                  <button 
                    onClick={() => fetchAiNotes(selectedTopic.title)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                  >
                    <RefreshCw size={14} /> Retry
                  </button>
                )}
              </div>
            )}

            {!aiNotes && !loading && !error && (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles size={32} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2 text-xl">Generate SARA AI Notes</h4>
                <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto font-medium">Get detailed Hinglish notes for JET 2025.</p>
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
                <p className="text-sm text-slate-400 mt-2 font-medium">Wait, detailed Hinglish notes are loading</p>
              </div>
            )}

            {aiNotes && (
              <div className="mt-8 animate-in fade-in zoom-in duration-700">
                <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4">
                  <div className="flex items-center gap-3 text-indigo-600 font-extrabold">
                    <Sparkles size={20} />
                    <span className="tracking-tight text-xl uppercase">SARA MASTER NOTES</span>
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
                  <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-slate-700 text-xl leading-relaxed font-medium font-serif">
                    {aiNotes}
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
          <h2 className="text-5xl font-bold serif-heading text-slate-800 tracking-tight">JET 2025 Syllabus</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Full Paper 1 & Literature modules covered.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 w-full sm:w-80 shadow-sm"
            />
          </div>
          <div className="flex p-1.5 bg-slate-200/40 rounded-[1.25rem]">
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
              <span className="text-[10px] font-black px-3 py-1 rounded-lg text-slate-400 bg-slate-50">
                {topic.category}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight serif-heading">
              {topic.title}
            </h3>
            
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
