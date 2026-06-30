'use client';
import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = '/'; }, 1200);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a5f] mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TestOS v2</h1>
          <p className="text-gray-500 text-sm mt-1">AI-Powered Test Management Platform</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sign in to your workspace</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</> : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">Demo: any email + password works</p>
        </div>
      </div>
    </div>
  );
}
