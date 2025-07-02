// pages/login.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, provider, signInWithPopup } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const router = useRouter();

  // ✅ Only redirect if user is logged in — once
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe(); // stop listening on unmount
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Don't need router.push here — it will happen from the listener
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ color: '#333' }}>Login</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
