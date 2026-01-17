
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import NotesView from './components/NotesView';
import QuizView from './components/QuizView';
import AITutor from './components/AITutor';
import ImportantQuestions from './components/ImportantQuestions';
import { LayoutDashboard, BookText, ClipboardList, MessageSquare, Menu, X, BrainCircuit, Lightbulb, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'quiz' | 'tutor' | 'important'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'notes', label: 'Study Notes', icon: <BookText size={20} /> },
    { id: 'important', label: 'Imp. Questions', icon: <Lightbulb size={20} /> },
    { id: 'quiz', label: 'Mock Exams', icon: <ClipboardList size={20} /> },
    { id: 'tutor', label: 'AI Lit Tutor', icon: <MessageSquare size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'notes': return <NotesView />;
      case 'important': return <ImportantQuestions />;
      case 'quiz': return <QuizView />;
      case 'tutor': return <AITutor />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <BrainCircuit size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight serif-heading">JET Mastery 2025</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden md:flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight serif-heading text-slate-800 tracking-tight">JET MASTERY</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scholar Edition 2025</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all
                ${activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
              `}
            >
              <span className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
            <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={16}/> SARA AI Active</h4>
            <p className="text-xs text-indigo-100 mb-4 opacity-90">Ready to explain complex theories in simple Hinglish.</p>
            <div className="w-full bg-indigo-400/30 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3"></div>
            </div>
            <p className="text-[10px] mt-2 font-bold uppercase tracking-wider">JET Exam: June 2025</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto h-screen scroll-smooth bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
