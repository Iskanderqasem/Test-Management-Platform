'use client';
import React, { useState } from 'react';
import { Users, Shield, Clock, Search, MoreHorizontal, Plus, Check, X } from 'lucide-react';
import toast from '@/lib/toast';

const ROLES = ['Admin', 'Test Manager', 'Senior QA', 'QA Engineer', 'Developer', 'Viewer'];

const MOCK_USERS = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Admin', status: 'Active', lastLogin: '2026-06-30 09:12' },
  { id: 2, name: 'James Patel', email: 'james.patel@company.com', role: 'Test Manager', status: 'Active', lastLogin: '2026-06-30 08:45' },
  { id: 3, name: 'Maria Gonzalez', email: 'maria.g@company.com', role: 'Senior QA', status: 'Active', lastLogin: '2026-06-29 17:30' },
  { id: 4, name: 'Liam O\'Brien', email: 'liam.ob@company.com', role: 'QA Engineer', status: 'Active', lastLogin: '2026-06-29 16:00' },
  { id: 5, name: 'Priya Sharma', email: 'priya.s@company.com', role: 'QA Engineer', status: 'Active', lastLogin: '2026-06-28 14:20' },
  { id: 6, name: 'Tom Nguyen', email: 'tom.n@company.com', role: 'Developer', status: 'Inactive', lastLogin: '2026-06-20 11:00' },
  { id: 7, name: 'Rachel Kim', email: 'rachel.k@company.com', role: 'Viewer', status: 'Pending', lastLogin: 'Never' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: ['Manage Users', 'All Projects', 'All Test Plans', 'All Test Cases', 'All Reports', 'System Settings'],
  'Test Manager': ['All Projects', 'All Test Plans', 'All Test Cases', 'All Reports'],
  'Senior QA': ['Create Test Plans', 'Create Test Cases', 'Execute Tests', 'View Reports'],
  'QA Engineer': ['Create Test Cases', 'Execute Tests', 'Log Defects', 'View Reports'],
  Developer: ['View Test Cases', 'View Defects', 'Log Defects'],
  Viewer: ['View Projects', 'View Test Cases', 'View Reports'],
};

const AUDIT_LOG = [
  { id: 1, user: 'Sarah Chen', action: 'Created user Rachel Kim', time: '2026-06-30 09:10', type: 'create' },
  { id: 2, user: 'Sarah Chen', action: 'Changed role of Tom Nguyen to Developer', time: '2026-06-29 15:30', type: 'update' },
  { id: 3, user: 'James Patel', action: 'Deactivated user Tom Nguyen', time: '2026-06-20 11:05', type: 'delete' },
  { id: 4, user: 'Sarah Chen', action: 'Invited Priya Sharma', time: '2026-06-15 10:00', type: 'create' },
  { id: 5, user: 'James Patel', action: 'Updated permissions for QA Engineer role', time: '2026-06-10 14:22', type: 'update' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const auditColor: Record<string, string> = {
  create: 'text-green-600',
  update: 'text-blue-600',
  delete: 'text-red-600',
};

export default function AdminPage() {
  const [tab, setTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = (id: number, role: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    setEditingRole(null);
    toast.success('Role updated');
  };

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    toast.success('User status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin & Users</h1>
          <p className="text-sm text-gray-400">Manage team members, roles, and permissions</p>
        </div>
        <button onClick={() => toast.success('Invite sent')} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors">
          <Plus className="h-4 w-4" /> Invite User
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {(['users', 'roles', 'audit'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'users' ? 'Users' : t === 'roles' ? 'Roles & Permissions' : 'Audit Log'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <span className="text-sm text-gray-400">{filtered.length} users</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
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
                      <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    {editingRole === user.id ? (
                      <select autoFocus defaultValue={user.role} onBlur={() => setEditingRole(null)}
                        onChange={e => changeRole(user.id, e.target.value)}
                        className="h-7 px-2 rounded border border-[#1e3a5f] text-xs focus:outline-none bg-white">
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setEditingRole(user.id)}
                        className="px-2.5 py-1 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium hover:bg-[#1e3a5f]/20 transition-colors">
                        {user.role}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(user.id)}
                      className="h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="grid grid-cols-2 gap-4">
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

      {tab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {AUDIT_LOG.map(log => (
              <div key={log.id} className="px-4 py-3 flex items-center gap-4">
                <Clock className="h-4 w-4 text-gray-300 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 text-sm">{log.user}</span>
                  <span className="text-gray-500 text-sm"> — {log.action}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
