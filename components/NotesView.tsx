
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SYLLABUS_TOPICS } from '../constants';
import { Topic, Subject } from '../types';
import { Book, ChevronRight, Sparkles, Download, ArrowLeft, Search, Volume2, Pause, Play, Loader2, Info, AlertCircle, RefreshCw, Key, Zap, Clipboard, Check } from 'lucide-react';
import { generateNotes, generateQuickRevision, generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

const NotesView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiNotes, setAiNotes] = useState<string>('');
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [revLoading, setRevLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyError, setIsKeyError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<Subject | 'All'>('All');
  const [copied, setCopied] = useState(false);
  
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
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
      setIsKeyError(false);
    }
  };

  const fetchAiNotes = async (topicTitle: string) => {
    setLoading(true);
    setError(null);
    try {
      const content = await generateNotes(topicTitle);
      setAiNotes(content);
    } catch (err: any) {
      setError("Notes failed to load. Check AI connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickRevision = async (topicTitle: string) => {
    setRevLoading(true);
    try {
      const content = await generateQuickRevision(topicTitle);
      setRevisionNotes(content);
    } catch (err: any) {
      setError("Revision points failed to load.");
    } finally {
      setRevLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStopAudio = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    sourceNodesRef.current.forEach(node => { try { node.stop(); } catch (e) {} });
    sourceNodesRef.current.clear();
    setIsPlaying(false);
    setIsAudioLoading(false);
    nextStartTimeRef.current = 0;
  };

  const handleListen = async (text: string) => {
    if (isPlaying) { handleStopAudio(); return; }
    setIsPlaying(true);
    setIsAudioLoading(true);
    nextStartTimeRef.current = 0;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
    const blocks: string[] = [];
    let currentBlock = "";
    for (const s of sentences) {
      if ((currentBlock + s).length > 1200) { blocks.push(currentBlock); currentBlock = s; }
      else { currentBlock += s; }
    }
    if (currentBlock) blocks.push(currentBlock);

    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

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
        } finally { isFetching = false; }
      };

      await fetchNext();
      setIsAudioLoading(false);

      let playIndex = 0;
      while (playIndex < blocks.length && !signal.aborted) {
        if (fetchIndex < blocks.length && audioBufferQueue.length < 2) fetchNext();
        if (audioBufferQueue.length === 0) {
          if (fetchIndex >= blocks.length) break;
          await new Promise(r => setTimeout(r, 100));
          continue;
        }
        const buffer = audioBufferQueue.shift()!;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        const now = ctx.currentTime;
        const startTime = Math.max(nextStartTimeRef.current, now + 0.01);
        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;
        sourceNodesRef.current.add(source);
        source.onended = () => sourceNodesRef.current.delete(source);
        playIndex++;
        const waitTime = (startTime - now + buffer.duration) * 1000 - 100;
        await new Promise(r => setTimeout(r, Math.max(0, waitTime)));
      }
      const checkEnd = setInterval(() => {
        if (sourceNodesRef.current.size === 0) { setIsPlaying(false); clearInterval(checkEnd); }
      }, 500);
    } catch (err) { handleStopAudio(); }
  };

  const filteredTopics = useMemo(() => {
    return SYLLABUS_TOPICS.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || t.subject === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  if (selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300 pb-20">
        <button 
          onClick={() => { setSelectedTopic(null); setAiNotes(''); setRevisionNotes(''); handleStopAudio(); }}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> Back to Syllabus
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="mb-8">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedTopic.subject === 'Paper 1' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
              {selectedTopic.subject}
            </span>
            <h2 className="text-4xl font-bold serif-heading text-slate-800 mt-2">{selectedTopic.title}</h2>
          </div>

          {/* Syllabus Section */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Book size={16} className="text-indigo-600" /> Topic Scope
              </h3>
              <button onClick={() => handleListen(selectedTopic.content)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                {isPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedTopic.content}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => fetchAiNotes(selectedTopic.title)}
              className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Master Study Notes
            </button>
            <button 
              onClick={() => fetchQuickRevision(selectedTopic.title)}
              className="flex items-center justify-center gap-2 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
            >
              {revLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              Quick Revision Points
            </button>
          </div>

          {/* Quick Revision Section */}
          {revisionNotes && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-amber-600 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Zap size={18} /> Last Minute Revise
                </h4>
                <button 
                  onClick={() => handleCopyToClipboard(revisionNotes)}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Clipboard size={18} />}
                </button>
              </div>
              <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-3xl p-8">
                <div className="prose prose-amber max-w-none prose-p:text-amber-900 font-medium whitespace-pre-wrap text-lg leading-relaxed">
                  {revisionNotes}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Notes Section */}
          {aiNotes && (
            <div className="animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4">
                <span className="text-indigo-600 font-black uppercase tracking-tighter text-xl">SARA MASTER NOTES</span>
                <button 
                  onClick={() => handleListen(aiNotes)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${isPlaying ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}
                >
                  {isAudioLoading ? <Loader2 size={16} className="animate-spin" /> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? 'Stop Tutor' : 'Listen Full Lecture'}
                </button>
              </div>
              <div className="bg-white p-8 md:p-12 rounded-[2rem] border-2 border-indigo-50 shadow-xl prose prose-indigo max-w-none whitespace-pre-wrap text-slate-700 text-xl leading-relaxed font-serif">
                {aiNotes}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold serif-heading text-slate-800 tracking-tight">Exam Syllabus</h2>
          <p className="text-slate-500 mt-2 text-lg">Pick a module to start your prep.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full sm:w-80 shadow-sm"
            />
          </div>
          <div className="flex p-1.5 bg-slate-200/40 rounded-[1.25rem]">
            {['All', 'Paper 1', 'English Literature'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeFilter === f ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}
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
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight serif-heading group-hover:text-indigo-600 transition-colors">{topic.title}</h3>
            <p className="text-slate-500 line-clamp-3 mb-8 flex-1 font-medium">{topic.content}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-xs font-black text-indigo-600 flex items-center gap-2">
                <Sparkles size={16} /> SARA Enabled
              </span>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
