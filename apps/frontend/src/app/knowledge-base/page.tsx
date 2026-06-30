'use client';
import React, { useState } from 'react';
import { Search, Plus, BookOpen, Tag, Clock, ThumbsUp, FileText } from 'lucide-react';
import toast from '@/lib/toast';
const articles = [
  {id:'KB-001',title:'How to write effective test cases',category:'Best Practices',tags:['testing','methodology'],views:234,likes:45,updated:'2 days ago'},
  {id:'KB-002',title:'Setting up automated regression suite',category:'Automation',tags:['automation','selenium'],views:189,likes:38,updated:'1 week ago'},
  {id:'KB-003',title:'Defect severity vs priority guidelines',category:'Process',tags:['defects','process'],views:312,likes:67,updated:'3 days ago'},
  {id:'KB-004',title:'Performance testing with k6 framework',category:'Performance',tags:['performance','k6'],views:156,likes:29,updated:'5 days ago'},
  {id:'KB-005',title:'API testing best practices with Postman',category:'API Testing',tags:['api','postman'],views:278,likes:52,updated:'1 day ago'},
];
const catColor: Record<string,string> = {'Best Practices':'bg-blue-100 text-blue-700','Automation':'bg-purple-100 text-purple-700','Process':'bg-green-100 text-green-700','Performance':'bg-orange-100 text-orange-700','API Testing':'bg-cyan-100 text-cyan-700'};
export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('');
  const filtered = articles.filter(a=>a.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1><p className="text-sm text-gray-400">{articles.length} articles · Testing best practices & guides</p></div>
        <button onClick={() => toast.success('Create article coming soon')} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#162b47]"><Plus className="h-3.5 w-3.5" />New Article</button>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search knowledge base…" className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer hover:border-[#1e3a5f]/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${catColor[a.category]||'bg-gray-100 text-gray-600'}`}>{a.category}</span></div>
                <h3 className="text-sm font-bold text-gray-900 hover:text-[#1e3a5f]">{a.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  {a.tags.map(t=><span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{a.likes}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
