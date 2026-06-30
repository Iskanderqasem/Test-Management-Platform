'use client';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  lastLogin: string;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  username: string;
  reason: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const USERS_KEY = 'testos_users';
const SESSION_KEY = 'testos_session';
const REQUESTS_KEY = 'testos_requests';

const DEFAULT_ADMIN: AppUser = {
  id: 'admin-001',
  name: 'Iskander Qasem',
  username: 'admin',
  email: 'iskanderqasem@gmail.com',
  password: 'Admin@TestOS2024',
  role: 'Admin',
  status: 'Active',
  createdAt: '2026-06-30',
  lastLogin: 'Never',
};

export function getUsers(): AppUser[] {
  if (typeof window === 'undefined') return [DEFAULT_ADMIN];
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const initial = [DEFAULT_ADMIN];
    localStorage.setItem(USERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
}

export function saveUsers(users: AppUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  const s = sessionStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

export function setCurrentUser(user: AppUser | null) {
  if (!user) {
    sessionStorage.removeItem(SESSION_KEY);
    document.cookie = 'testos_auth=; path=/; max-age=0';
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    document.cookie = `testos_auth=1; path=/; max-age=${60 * 60 * 8}`; // 8 hours
  }
}

export function login(username: string, password: string): AppUser | null {
  const users = getUsers();
  const user = users.find(
    u => (u.username === username || u.email === username) && u.password === password && u.status === 'Active'
  );
  if (user) {
    const updated = users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toLocaleString() } : u);
    saveUsers(updated);
    setCurrentUser({ ...user, lastLogin: new Date().toLocaleString() });
  }
  return user || null;
}

export function logout() {
  setCurrentUser(null);
  window.location.href = '/login';
}

export function getRequests(): AccessRequest[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveRequest(req: Omit<AccessRequest, 'id' | 'submittedAt' | 'status'>) {
  const requests = getRequests();
  const newReq: AccessRequest = {
    ...req,
    id: `req-${Date.now()}`,
    submittedAt: new Date().toLocaleString(),
    status: 'Pending',
  };
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([...requests, newReq]));
  return newReq;
}

export function updateRequest(id: string, status: 'Approved' | 'Rejected') {
  const requests = getRequests();
  const updated = requests.map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));

  if (status === 'Approved') {
    const req = requests.find(r => r.id === id);
    if (req) {
      const users = getUsers();
      const newUser: AppUser = {
        id: `user-${Date.now()}`,
        name: req.name,
        username: req.username,
        email: req.email,
        password: 'Welcome@123',
        role: 'QA Engineer',
        status: 'Active',
        createdAt: new Date().toLocaleDateString(),
        lastLogin: 'Never',
      };
      saveUsers([...users, newUser]);
    }
  }
  return updated;
}
