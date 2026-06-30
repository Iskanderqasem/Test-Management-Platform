'use client';
import React, { useState, useEffect } from 'react';
import { Users, Shield, Clock, Search, Plus, Check, X, Pencil, Trash2, Key, UserPlus, Mail } from 'lucide-react';
import { getUsers, saveUsers, getRequests, updateRequest, AppUser, AccessRequest } from '@/lib/auth';
import toast from '@/lib/toast';

const ROLES = ['Admin', 'Test Manager', 'Senior QA', 'QA Engineer', 'Developer', 'Viewer'];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: ['Manage Users', 'All Projects', 'All Test Plans', 'All Test Cases', 'All Reports', 'System Settings'],
  'Test Manager': ['All Projects', 'All Test Plans', 'All Test Cases', 'All Reports'],
  'Senior QA': ['Create Test Plans', 'Create Test Cases', 'Execute Tests', 'View Reports'],
  'QA Engineer': ['Create Test Cases', 'Execute Tests', 'Log Defects', 'View Reports'],
  Developer: ['View Test Cases', 'View Defects', 'Log Defects'],
  Viewer: ['View Projects', 'View Test Cases', 'View Reports'],
};

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Pending: 'bg-yellow-100 text-yellow-700',
};

type Modal =
  | { type: 'edit'; user: AppUser }
  | { type: 'delete'; user: AppUser }
  | { type: 'add' }
  | null;

function EditModal({ user, onSave, onClose }: { user: AppUser; onSave: (u: AppUser) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: user.name, username: user.username, email: user.email, password: '', role: user.role, status: user.status });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const save = () => {
    onSave({ ...user, ...form, password: form.password || user.password });
    toast.success('User updated');
    onClose();
  };
  return (
    <ModalShell title="Edit User" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Full Name" value={form.name} onChange={v => set('name', v)} />
        <Field label="Username" value={form.username} onChange={v => set('username', v)} />
        <Field label="Email" value={form.email} type="email" onChange={v => set('email', v)} />
        <Field label="New Password" value={form.password} type="password" placeholder="Leave blank to keep current" onChange={v => set('password', v)} />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full h-9 px-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value as AppUser['status'])} className="w-full h-9 px-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
            <option>Active</option><option>Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} className="h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47]">Save Changes</button>
        </div>
      </div>
    </ModalShell>
  );
}

function AddModal({ onSave, onClose }: { onSave: (u: AppUser) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'QA Engineer' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const save = () => {
    if (!form.name || !form.username || !form.email || !form.password) { toast.error('All fields are required'); return; }
    onSave({ id: `user-${Date.now()}`, ...form, status: 'Active', createdAt: new Date().toLocaleDateString(), lastLogin: 'Never' } as AppUser);
    toast.success('User created');
    onClose();
  };
  return (
    <ModalShell title="Add New User" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Full Name" value={form.name} onChange={v => set('name', v)} />
        <Field label="Username" value={form.username} onChange={v => set('username', v)} />
        <Field label="Email" value={form.email} type="email" onChange={v => set('email', v)} />
        <Field label="Password" value={form.password} type="password" onChange={v => set('password', v)} />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full h-9 px-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} className="h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47]">Create User</button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<'users' | 'roles' | 'requests'>('users');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [modal, setModal] = useState<Modal>(null);

  useEffect(() => {
    setUsers(getUsers());
    setRequests(getRequests());
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const saveUser = (updated: AppUser) => {
    const next = users.map(u => u.id === updated.id ? updated : u);
    setUsers(next);
    saveUsers(next);
  };

  const addUser = (u: AppUser) => {
    const next = [...users, u];
    setUsers(next);
    saveUsers(next);
  };

  const deleteUser = (id: string) => {
    if (id === 'admin-001') { toast.error('Cannot delete the admin account'); return; }
    const next = users.filter(u => u.id !== id);
    setUsers(next);
    saveUsers(next);
    setModal(null);
    toast.success('User deleted');
  };

  const handleRequest = (id: string, status: 'Approved' | 'Rejected') => {
    updateRequest(id, status);
    setRequests(getRequests());
    setUsers(getUsers());
    toast.success(status === 'Approved' ? 'User approved and account created (password: Welcome@123)' : 'Request rejected');
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {modal?.type === 'edit' && <EditModal user={modal.user} onSave={saveUser} onClose={() => setModal(null)} />}
      {modal?.type === 'add' && <AddModal onSave={addUser} onClose={() => setModal(null)} />}
      {modal?.type === 'delete' && (
        <ModalShell title="Delete User" onClose={() => setModal(null)}>
          <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete <strong>{modal.user.name}</strong>? This cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModal(null)} className="h-9 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={() => deleteUser(modal.user.id)} className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
          </div>
        </ModalShell>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin &amp; Users</h1>
          <p className="text-sm text-gray-400">Manage team members, roles, and access requests</p>
        </div>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors">
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {[
            { key: 'users', label: 'Users' },
            { key: 'roles', label: 'Roles & Permissions' },
            { key: 'requests', label: `Access Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <span className="text-sm text-gray-400">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{user.username}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium">{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setModal({ type: 'edit', user })}
                          title="Edit user"
                          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setModal({ type: 'edit', user })}
                          title="Change password"
                          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-colors">
                          <Key className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setModal({ type: 'delete', user })}
                          title="Delete user"
                          disabled={user.id === 'admin-001'}
                          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {tab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map(role => (
            <div key={role} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-[#f97316]" />
                <h3 className="font-semibold text-gray-900">{role}</h3>
                <span className="ml-auto text-xs text-gray-400">{users.filter(u => u.role === role).length} users</span>
              </div>
              <ul className="space-y-1.5">
                {ROLE_PERMISSIONS[role].map(perm => (
                  <li key={perm} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />{perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Access Requests Tab */}
      {tab === 'requests' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Access Requests</h3>
            <p className="text-xs text-gray-400 mt-0.5">When approved, account is created with password: Welcome@123</p>
          </div>
          {requests.length === 0 ? (
            <div className="py-16 text-center">
              <Mail className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No access requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map(req => (
                <div key={req.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                    {req.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{req.name}</p>
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{req.username}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-auto ${
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>{req.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{req.email} &middot; {req.submittedAt}</p>
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mt-2">{req.reason}</p>
                  </div>
                  {req.status === 'Pending' && (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleRequest(req.id, 'Approved')}
                        className="h-8 px-3 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => handleRequest(req.id, 'Rejected')}
                        className="h-8 px-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
