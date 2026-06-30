'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { saveRequest } from '@/lib/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', username: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.reason.trim().length < 20) {
      setError('Please provide a more detailed reason (at least 20 characters).');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      saveRequest({ name: form.name, email: form.email, username: form.username, reason: form.reason });

      // Open mailto to notify admin
      const subject = encodeURIComponent(`TestOS Access Request: ${form.name} (${form.username})`);
      const body = encodeURIComponent(
        `New access request received:\n\nName: ${form.name}\nEmail: ${form.email}\nUsername: ${form.username}\n\nReason:\n${form.reason}\n\nPlease log in to TestOS Admin panel to approve or reject this request.`
      );
      window.open(`mailto:iskandarqasem@gmail.com?subject=${subject}&body=${body}`, '_blank');

      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2340] via-[#1e3a5f] to-[#0f2340] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Your access request has been sent to the administrator for review.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            You will be notified once your request is approved. Default password on approval: <span className="font-mono font-semibold text-gray-600">Welcome@123</span>
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a5f] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2340] via-[#1e3a5f] to-[#0f2340] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4 border border-white/20">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TestOS</h1>
          <p className="text-blue-200 text-sm mt-1">Request Platform Access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Request Access</h2>
          <p className="text-sm text-gray-500 mb-6">Your request will be reviewed by the administrator.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="John Smith"
                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="john@company.com"
                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Desired Username</label>
              <input
                type="text" required value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="johnsmith"
                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Access</label>
              <textarea
                required value={form.reason} onChange={e => set('reason', e.target.value)} rows={4}
                placeholder="Describe your role and why you need access to TestOS..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.reason.length} / 20 minimum characters</p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-10 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
              ) : 'Submit Request'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
