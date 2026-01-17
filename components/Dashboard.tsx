
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Award, CheckCircle, Clock, Sparkles, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Teaching Apt.', progress: 75, color: '#6366f1' },
  { name: 'Renaissance', progress: 40, color: '#ec4899' },
  { name: 'Romantic Age', progress: 85, color: '#10b981' },
  { name: 'Research Meth.', progress: 30, color: '#f59e0b' },
  { name: 'Post-Colonial', progress: 55, color: '#8b5cf6' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold serif-heading text-slate-800">Welcome, Professor!</h1>
          <p className="text-slate-500 mt-1">Your JET 2025 prep is at 62% efficiency today.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 transition-transform hover:scale-105 cursor-default">
            <Sparkles size={18} />
            <span>AI Advantage Active</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { icon: <BookOpen className="text-indigo-600" />, label: 'Modules Mastered', value: '18/52', trend: '+3 this week', trendUp: true },
          { icon: <CheckCircle className="text-emerald-600" />, label: 'Avg Mock Score', value: '82%', trend: '+5% vs last', trendUp: true },
          { icon: <Clock className="text-amber-600" />, label: 'Focus Time', value: '142h', trend: '2.5h daily avg', trendUp: true },
          { icon: <TrendingUp className="text-rose-600" />, label: 'All India Rank', value: '#482', trend: 'In top 1%', trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">{stat.icon}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Award size={22} className="text-indigo-500" />
              Preparation Velocity
            </h3>
            <select className="text-xs font-bold text-slate-400 bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: '14px' }}
                />
                <Bar dataKey="progress" radius={[8, 8, 8, 8]} barSize={45}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Mastery Checklist</h3>
          <div className="space-y-4 flex-1">
            {[
              { task: 'Shakespearean Sonnets', progress: 100, color: 'bg-emerald-500' },
              { task: 'Research Ethics (Unit II)', progress: 80, color: 'bg-indigo-500' },
              { task: 'Post-Modern Critical Theory', progress: 35, color: 'bg-amber-500' },
              { task: 'ICT Terms & Basics', progress: 60, color: 'bg-blue-500' },
              { task: 'Victorian Prose Stylists', progress: 15, color: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.task}</span>
                  <span className="text-[10px] font-bold text-slate-400">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
            View Full Study Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
