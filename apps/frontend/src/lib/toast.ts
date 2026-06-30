'use client';

// Zero-dependency toast utility — dispatches custom DOM events
// Toast UI is rendered by ToastContainer in ClientLayout

type ToastType = 'success' | 'error' | 'info' | 'loading';

function dispatch(message: string, type: ToastType) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type, id: Math.random() } }));
}

const toast = {
  success: (msg: string) => dispatch(msg, 'success'),
  error: (msg: string) => dispatch(msg, 'error'),
  info: (msg: string) => dispatch(msg, 'info'),
  loading: (msg: string) => dispatch(msg, 'loading'),
};

export default toast;
